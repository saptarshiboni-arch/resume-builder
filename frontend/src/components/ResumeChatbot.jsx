import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Copy,
  Check
} from 'lucide-react';
import { chatWithResumeApi } from '../services/api';

const QUICK_PROMPTS = [
  '🎯 How can I improve my ATS score?',
  '💡 Review my professional summary',
  '🚀 Strengthen my project bullet points',
  '🛠️ Are my skill categories complete?',
  '📄 Tips to fit within 1–2 pages'
];

export default function ResumeChatbot({ resumeData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const initialBotMessage = {
    id: 1,
    sender: 'assistant',
    text: `Hello! I'm your **AI Resume & ATS Advisor**.\n\nAsk me anything about your resume, or click one of the quick suggestions below for instant feedback!`,
    isTyping: false,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  const [messages, setMessages] = useState([initialBotMessage]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const timeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 60);
      inputRef.current?.focus();
    }
  }, [isOpen, messages.length]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  /**
   * Premium Organic Token-Level Typewriter Streaming
   * Breaks text into tokens (words, punctuation, linebreaks) with dynamic cadence pauses:
   * - standard words: ~32ms
   * - commas / colons: ~65ms
   * - sentence ends (. ! ?): ~120ms
   * - paragraph breaks (\n\n): ~160ms
   */
  const streamBotResponse = (fullText) => {
    const botMsgId = Date.now();
    const botMsg = {
      id: botMsgId,
      sender: 'assistant',
      text: '',
      isTyping: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, botMsg]);
    setIsStreaming(true);

    // Tokenize fullText into words, whitespace, and punctuation
    const tokens = fullText.match(/(\r\n|\n|\r|[^\s\r\n]+|\s+)/g) || [fullText];
    let tokenIndex = 0;
    let accumulatedText = '';

    const streamNextToken = () => {
      if (tokenIndex >= tokens.length) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botMsgId ? { ...m, text: fullText, isTyping: false } : m
          )
        );
        setIsStreaming(false);
        timeoutRef.current = null;
        setTimeout(scrollToBottom, 50);
        return;
      }

      const token = tokens[tokenIndex];
      accumulatedText += token;
      tokenIndex++;

      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMsgId ? { ...m, text: accumulatedText } : m
        )
      );

      // Keep scrolling smoothly during streaming
      if (tokenIndex % 2 === 0 || token.includes('\n')) {
        scrollToBottom();
      }

      // Dynamic pacing based on token content
      let delay = 30; // base word delay
      if (token.includes('\n\n')) {
        delay = 140; // paragraph break
      } else if (token.includes('\n')) {
        delay = 80; // line break
      } else if (/[.!?]$/.test(token.trim())) {
        delay = 110; // sentence ending
      } else if (/[,:;—]$/.test(token.trim())) {
        delay = 60; // clause separator
      } else if (token.length > 8) {
        delay = 38; // longer technical word
      }

      timeoutRef.current = setTimeout(streamNextToken, delay);
    };

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(streamNextToken, 40);
  };

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || loading || isStreaming) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        sender: m.sender,
        text: m.text
      }));

      const replyText = await chatWithResumeApi(query, historyPayload, resumeData);
      setLoading(false);
      streamBotResponse(replyText || 'Here is your resume feedback.');
    } catch (err) {
      setLoading(false);
      streamBotResponse(`I encountered an issue analyzing your resume. Please try asking again!`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopy = (text, idx) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  /**
   * Helper to format markdown gracefully even during active streaming
   * Automatically balances unclosed asterisks so layout never jumps
   */
  const renderFormattedText = (rawText, isTyping = false) => {
    if (!rawText && isTyping) {
      return (
        <span className="inline-block w-2 h-4 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-[2px] shadow-[0_0_8px_rgba(99,102,241,0.6)] animate-pulse align-middle ml-1" />
      );
    }
    if (!rawText) return null;

    // Balance unclosed ** tags during streaming to prevent visual flicker
    let balancedText = rawText;
    const boldMatches = balancedText.match(/\*\*/g);
    if (boldMatches && boldMatches.length % 2 !== 0) {
      balancedText += '**';
    }

    const lines = balancedText.split('\n');
    return lines.map((line, i) => {
      const trimmed = line.trim();
      const isLastLine = i === lines.length - 1;

      if (!trimmed) return <div key={i} className="h-2" />;

      // Header 3 (###)
      if (trimmed.startsWith('### ')) {
        return (
          <h4 key={i} className="text-sm font-bold text-slate-900 dark:text-white mt-2 mb-1 flex items-center flex-wrap">
            <span>{trimmed.replace('### ', '')}</span>
            {isTyping && isLastLine && (
              <span className="inline-block w-2 h-3.5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-[2px] shadow-[0_0_8px_rgba(99,102,241,0.6)] animate-pulse align-middle ml-1.5" />
            )}
          </h4>
        );
      }

      // Bullet points (- or * or 1.)
      const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed);
      const formattedContent = trimmed
        .replace(/^[-*]\s+|\d+\.\s+/, '')
        .split(/(\*\*.*?\*\*|\*.*?\*)/g)
        .map((chunk, cIdx) => {
          if (chunk.startsWith('**') && chunk.endsWith('**')) {
            return (
              <strong key={cIdx} className="font-semibold text-slate-900 dark:text-slate-100">
                {chunk.slice(2, -2)}
              </strong>
            );
          }
          if (chunk.startsWith('*') && chunk.endsWith('*')) {
            return (
              <em key={cIdx} className="italic text-indigo-600 dark:text-indigo-400">
                {chunk.slice(1, -1)}
              </em>
            );
          }
          return chunk;
        });

      if (isBullet) {
        return (
          <div key={i} className="flex items-start gap-2 my-1 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
            <span className="text-indigo-500 font-bold mt-0.5">•</span>
            <div>
              {formattedContent}
              {isTyping && isLastLine && (
                <span className="inline-block w-2 h-3.5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-[2px] shadow-[0_0_8px_rgba(99,102,241,0.6)] animate-pulse align-middle ml-1.5" />
              )}
            </div>
          </div>
        );
      }

      return (
        <p key={i} className="text-xs leading-relaxed my-1 text-slate-700 dark:text-slate-300">
          {formattedContent}
          {isTyping && isLastLine && (
            <span className="inline-block w-2 h-3.5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-[2px] shadow-[0_0_8px_rgba(99,102,241,0.6)] animate-pulse align-middle ml-1.5" />
          )}
        </p>
      );
    });
  };

  const isBusy = loading || isStreaming;

  return (
    <>
      {/* ── Floating Launcher Button ────────────────────────────── */}
      <div
        className="fixed bottom-6 right-6"
        style={{ zIndex: 99999 }}
      >
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 text-white shadow-2xl hover:shadow-indigo-500/40 border border-indigo-400/30 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Toggle AI Resume Review Chatbot"
        >
          {isOpen ? (
            <>
              <X className="w-5 h-5 text-white" />
              <span className="text-xs font-bold tracking-wide">Close Chat</span>
            </>
          ) : (
            <>
              <div className="relative">
                <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
                </span>
              </div>
              <span className="text-xs font-bold tracking-wide">Ask AI Reviewer</span>
            </>
          )}
        </button>
      </div>

      {/* ── Chatbot Window Modal / Drawer ───────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-4 sm:right-6 w-[92vw] sm:w-[420px] max-h-[620px] h-[75vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            style={{ zIndex: 99998 }}
          >
            {/* ── Header ─────────────────────────────────────────── */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 flex items-center justify-between border-b border-indigo-900/50 select-none">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-amber-300 shadow-inner">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-white font-display">AI Resume Advisor</h3>
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-1.5 py-0.2 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 truncate max-w-[210px]">
                    Role: {resumeData?.career?.targetRole || 'Software Professional'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Close Chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* ── Messages Stream ─────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/70 dark:bg-slate-950/70">
              {messages.map((msg, idx) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id || idx}
                    className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5 border border-indigo-200 dark:border-indigo-800">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl p-3 shadow-xs relative group ${
                        isUser
                          ? 'bg-indigo-600 text-white rounded-br-none'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none'
                      }`}
                    >
                      {isUser ? (
                        <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      ) : (
                        <div className="space-y-1">
                          {renderFormattedText(msg.text, msg.isTyping)}
                          {!msg.isTyping && (
                            <div className="flex items-center justify-between pt-1 mt-2 border-t border-slate-100 dark:border-slate-800/60 text-[10px] text-slate-400">
                              <span>{msg.timestamp}</span>
                              <button
                                type="button"
                                onClick={() => handleCopy(msg.text, idx)}
                                className="inline-flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-1 cursor-pointer"
                                title="Copy response"
                              >
                                {copiedIdx === idx ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {isUser && (
                      <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Typing indicator (while waiting for server response) */}
              {loading && (
                <div className="flex gap-2.5 items-center">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-200 dark:border-indigo-800">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-2xl rounded-bl-none flex items-center gap-1.5 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* ── Quick Prompts Suggestion Bar ──────────────────────── */}
            <div className="px-3 py-2 bg-slate-100/90 dark:bg-slate-900/90 border-t border-slate-200/80 dark:border-slate-800 overflow-x-auto whitespace-nowrap flex gap-1.5">
              {QUICK_PROMPTS.map((prompt, pIdx) => (
                <button
                  key={pIdx}
                  type="button"
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isBusy}
                  className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-600 dark:text-slate-300 transition-all shrink-0 shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* ── Input Box ───────────────────────────────────────── */}
            <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isBusy ? 'AI Advisor is typing...' : 'Ask about your ATS score, summary, or bullets...'}
                  disabled={isBusy}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isBusy}
                  className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 disabled:hover:bg-indigo-600 transition-colors shrink-0 shadow-xs cursor-pointer"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
