import React from 'react';
import { Sparkles, ShieldCheck, Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md py-10 mt-20 no-print transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Description */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white flex items-center justify-center text-white dark:text-neutral-950">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-neutral-900 dark:text-white text-sm">ResumeCraft Studio</div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Professional resume synthesis & ATS optimization.</p>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-600 dark:text-neutral-300">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Zero-Hallucination AI Guardrails</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
              <span>Instant A4 PDF Export</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 gap-4">
          <p>© {new Date().getFullYear()} ResumeCraft Studio. Designed for high-impact job applications.</p>
          <p className="flex items-center gap-1">
            Built with React, Vite & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
