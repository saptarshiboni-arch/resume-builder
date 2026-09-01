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
      color: "from-blue-500 to-indigo-500"
    },
    {
      step: "02",
      title: "AI Synthesis & Enhancement",
      desc: "AI elevates simple wording ('I made a website for students') into high-impact action bullets with zero hallucination.",
      icon: Wand2,
      color: "from-indigo-500 to-purple-500"
    },
    {
      step: "03",
      title: "Choose Resume Style",
      desc: "Switch between Modern, Minimalist, and Executive Professional templates with live instant preview.",
      icon: Layout,
      color: "from-purple-500 to-pink-500"
    },
    {
      step: "04",
      title: "In-Place Edits & PDF Export",
      desc: "Tweak any bullet with 1-click tone presets ('Make More Technical ✨') and export a clean A4 PDF.",
      icon: Download,
      color: "from-pink-500 to-rose-500"
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden"
        >
          <div className="px-6 sm:px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg font-display">How ResumeAI Works</h3>
                <p className="text-xs text-slate-500">From raw experience to an interview-ready resume in under 3 minutes</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md hover:border-indigo-100 transition-all group">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${s.color} text-white flex items-center justify-center shadow-sm`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black text-slate-300 group-hover:text-indigo-600 transition-colors">
                      STEP {s.step}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">{s.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="px-6 sm:px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-200/50 transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onStart();
              }}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 shadow-md shadow-indigo-500/20 transition-all"
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
