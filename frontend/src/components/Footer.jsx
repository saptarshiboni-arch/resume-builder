import React from 'react';
import { Sparkles, ShieldCheck, Zap, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/80 py-10 mt-20 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Description */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">ResumeAI Builder</div>
              <p className="text-xs text-slate-500">Autonomous AI-powered resume synthesis & ATS optimization.</p>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Zero-Hallucination AI Guardrails</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Instant A4 PDF Export</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AI Resume Builder MVP. Designed for high-impact job applications.</p>
          <p className="flex items-center gap-1">
            Built with React, Vite, Tailwind CSS & Flask
          </p>
        </div>
      </div>
    </footer>
  );
}
