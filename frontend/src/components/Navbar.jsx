import React from 'react';
import { Sparkles, FileText, PlayCircle, PlusCircle, CheckCircle } from 'lucide-react';

export default function Navbar({ currentView, setCurrentView, onLoadDemo, onStartNew }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-2.5 group text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-slate-900 tracking-tight font-display">ResumeAI</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">MVP</span>
            </div>
            <p className="text-[11px] text-slate-500 -mt-0.5 font-medium">Smart AI Resume Builder</p>
          </div>
        </button>

        {/* Navigation Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Demo Button */}
          <button
            id="btn-nav-demo"
            onClick={onLoadDemo}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 rounded-lg transition-colors"
            title="Load sample Alex Johnson data to test immediately"
          >
            <PlayCircle className="w-3.5 h-3.5 text-indigo-600" />
            <span>Try Demo</span>
          </button>

          {/* Current view switcher / start button */}
          {currentView === 'landing' ? (
            <button
              id="btn-nav-create"
              onClick={onStartNew}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 rounded-lg shadow-sm shadow-indigo-500/30 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create My Resume</span>
            </button>
          ) : currentView === 'wizard' ? (
            <button
              onClick={() => setCurrentView('landing')}
              className="text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Exit to Home
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('wizard')}
                className="text-xs font-semibold text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                Edit Answers
              </button>
              <button
                onClick={onStartNew}
                className="hidden md:inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 px-3 py-1.5 rounded-lg border border-indigo-200 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>New Resume</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
