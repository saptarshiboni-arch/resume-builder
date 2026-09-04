import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Wand2, Check, RefreshCw, AlertCircle, Undo } from 'lucide-react';
import { enhanceSectionApi } from '../services/api';

export default function SectionEditModal({
  isOpen,
  onClose,
  title,
  sectionType, // "summary" | "project_description" | "experience_bullet"
  initialContent,
  onSave,
  context = {}
}) {
  const [content, setContent] = useState(initialContent || '');
  const [originalContent, setOriginalContent] = useState(initialContent || '');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [activeTone, setActiveTone] = useState(null);
  const [history, setHistory] = useState([]);

  // Sync state if initialContent changes
  React.useEffect(() => {
    if (isOpen) {
      setContent(initialContent || '');
      setOriginalContent(initialContent || '');
      setHistory([]);
      setActiveTone(null);
    }
  }, [isOpen, initialContent]);

  if (!isOpen) return null;

  const handleAiEnhance = async (tone) => {
    if (!content.trim()) return;
    setIsEnhancing(true);
    setActiveTone(tone);
    try {
      // Save current content to history for undo
      setHistory((prev) => [...prev, content]);
      const enhanced = await enhanceSectionApi(sectionType, content, tone, context);
      if (enhanced) {
        setContent(enhanced);
      }
    } catch (err) {
      console.error("AI enhance failed:", err);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setContent(prev);
      setHistory((h) => h.slice(0, -1));
    } else {
      setContent(originalContent);
    }
  };

  const handleSave = () => {
    onSave(content);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] text-neutral-900 dark:text-neutral-100"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-950">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white flex items-center justify-center border border-neutral-300 dark:border-neutral-700">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-neutral-900 dark:text-white text-sm sm:text-base">
                  {title || 'Edit & Enhance Content'}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Edit manually or refine with AI tone presets</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* AI Preset Toolbar */}
          <div className="px-6 py-3 bg-neutral-100 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900 dark:text-white">
              <Wand2 className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
              <span>AI Tone Refinements:</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                disabled={isEnhancing}
                onClick={() => handleAiEnhance('professional')}
                className="px-2.5 py-1 text-xs font-bold bg-white dark:bg-neutral-800 hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 text-neutral-800 dark:text-neutral-100 rounded-lg border border-neutral-300 dark:border-neutral-600 transition-all shadow-xs disabled:opacity-50 flex items-center gap-1"
              >
                <span>Make More Professional ✨</span>
              </button>
              <button
                type="button"
                disabled={isEnhancing}
                onClick={() => handleAiEnhance('concise')}
                className="px-2.5 py-1 text-xs font-bold bg-white dark:bg-neutral-800 hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 text-neutral-800 dark:text-neutral-100 rounded-lg border border-neutral-300 dark:border-neutral-600 transition-all shadow-xs disabled:opacity-50 flex items-center gap-1"
              >
                <span>Make Concise ✨</span>
              </button>
              <button
                type="button"
                disabled={isEnhancing}
                onClick={() => handleAiEnhance('technical')}
                className="px-2.5 py-1 text-xs font-bold bg-white dark:bg-neutral-800 hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 text-neutral-800 dark:text-neutral-100 rounded-lg border border-neutral-300 dark:border-neutral-600 transition-all shadow-xs disabled:opacity-50 flex items-center gap-1"
              >
                <span>Make More Technical ✨</span>
              </button>
            </div>
          </div>

          {/* Text Area */}
          <div className="p-6 flex-1 overflow-y-auto">
            <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
              Content:
            </label>
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className={`w-full p-3.5 text-sm text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-950 border rounded-xl focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent outline-none transition-all resize-y shadow-xs ${
                  isEnhancing ? 'opacity-50 pointer-events-none' : 'border-neutral-300 dark:border-neutral-700'
                }`}
                placeholder="Enter text..."
              />
              {isEnhancing && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xs rounded-xl">
                  <div className="flex items-center gap-2 text-neutral-900 dark:text-white font-bold text-xs animate-pulse">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>AI is polishing your content ({activeTone})...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Undo bar */}
            {(history.length > 0 || content !== originalContent) && (
              <div className="flex items-center justify-between mt-2 text-xs">
                <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
                  Content has been modified.
                </span>
                <button
                  type="button"
                  onClick={handleUndo}
                  className="flex items-center gap-1 text-neutral-800 dark:text-neutral-200 hover:underline font-bold"
                >
                  <Undo className="w-3 h-3" />
                  <span>Undo last change</span>
                </button>
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="px-6 py-4 bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 active:scale-98 rounded-lg shadow-md transition-all flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Changes</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
