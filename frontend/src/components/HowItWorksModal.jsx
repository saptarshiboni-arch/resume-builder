import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Sparkles, Wand2, Layout, Download, ArrowRight } from 'lucide-react';

export default function HowItWorksModal({ isOpen, onClose, onStart }) {
  if (!isOpen) return null;

  const steps = [
    {
      step: "01",
      title: "Guided Questionnaire",
      desc: "Answer straightforward questions with easy selection pills. No typing long essays from scratch.",
      icon: CheckCircle2,
    },
    {
      step: "02",
      title: "AI Synthesis & Enhancement",
      desc: "Refines simple wording into high-impact action bullets with zero hallucination.",
      icon: Wand2,
    },
    {
      step: "03",
      title: "Choose Resume Style",
      desc: "Switch between Modern, Minimalist, and Executive Professional templates with live instant preview.",
      icon: Layout,
    },
    {
      step: "04",
      title: "In-Place Edits & PDF Export",
      desc: "Tweak any bullet with 1-click tone presets ('Make Concise', 'Make Technical') and export a clean A4 PDF.",
      icon: Download,
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-3xl overflow-hidden text-neutral-900 dark:text-neutral-100"
        >
          <div className="px-6 sm:px-8 py-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-950">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-neutral-900 dark:text-white text-lg font-display">How ResumeCraft Works</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">From raw experience to an interview-ready resume in under 3 minutes</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-850 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all group shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white flex items-center justify-center shadow-xs border border-neutral-300 dark:border-neutral-700">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black text-neutral-400 dark:text-neutral-500">
                      STEP {s.step}
                    </span>
                  </div>
                  <h4 className="font-bold text-neutral-900 dark:text-white text-sm mb-1">{s.title}</h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">{s.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="px-6 sm:px-8 py-4 bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white px-4 py-2 rounded-lg hover:bg-neutral-200/50 dark:hover:bg-neutral-800 transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onStart();
              }}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 active:scale-98 shadow-md transition-all"
            >
              <span>Start Building Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
