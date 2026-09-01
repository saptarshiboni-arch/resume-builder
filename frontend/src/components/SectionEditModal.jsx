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
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-900 dark:text-slate-100"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                  {title || 'Edit & Enhance Content'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Edit manually or refine with AI tone presets</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* AI Preset Toolbar */}
          <div className="px-6 py-3 bg-indigo-50/60 dark:bg-indigo-950/40 border-b border-indigo-100/60 dark:border-indigo-900/60 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-900 dark:text-indigo-300">
              <Wand2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>AI Tone Rewrites:</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                disabled={isEnhancing}
                onClick={() => handleAiEnhance('professional')}
                className="px-2.5 py-1 text-xs font-medium bg-white dark:bg-slate-800 hover:bg-indigo-600 dark:hover:bg-indigo-600 hover:text-white dark:hover:text-white text-indigo-700 dark:text-indigo-300 rounded-lg border border-indigo-200 dark:border-indigo-800 transition-all shadow-sm disabled:opacity-50 flex items-center gap-1"
              >
                <span>Make More Professional ✨</span>
              </button>
              <button
                type="button"
                disabled={isEnhancing}
                onClick={() => handleAiEnhance('concise')}
                className="px-2.5 py-1 text-xs font-medium bg-white dark:bg-slate-800 hover:bg-indigo-600 dark:hover:bg-indigo-600 hover:text-white dark:hover:text-white text-indigo-700 dark:text-indigo-300 rounded-lg border border-indigo-200 dark:border-indigo-800 transition-all shadow-sm disabled:opacity-50 flex items-center gap-1"
              >
                <span>Make Concise ✨</span>
              </button>
              <button
                type="button"
                disabled={isEnhancing}
                onClick={() => handleAiEnhance('technical')}
                className="px-2.5 py-1 text-xs font-medium bg-white dark:bg-slate-800 hover:bg-indigo-600 dark:hover:bg-indigo-600 hover:text-white dark:hover:text-white text-indigo-700 dark:text-indigo-300 rounded-lg border border-indigo-200 dark:border-indigo-800 transition-all shadow-sm disabled:opacity-50 flex items-center gap-1"
              >
                <span>Make More Technical ✨</span>
              </button>
            </div>
          </div>

          {/* Text Area */}
          <div className="p-6 flex-1 overflow-y-auto">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Content:
            </label>
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className={`w-full p-3.5 text-sm text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-950 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-y ${
                  isEnhancing ? 'opacity-50 pointer-events-none' : 'border-slate-300 dark:border-slate-700'
                }`}
                placeholder="Enter text..."
              />
              {isEnhancing && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-xs rounded-xl">
                  <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-semibold text-xs animate-pulse">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>AI is polishing your content ({activeTone})...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Undo bar */}
            {(history.length > 0 || content !== originalContent) && (
              <div className="flex items-center justify-between mt-2 text-xs">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                  Content has been modified.
                </span>
                <button
                  type="button"
                  onClick={handleUndo}
                  className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
                >
                  <Undo className="w-3 h-3" />
                  <span>Undo last change</span>
                </button>
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 rounded-lg shadow-sm shadow-indigo-500/20 transition-all flex items-center gap-1.5"
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
