import React from 'react';
import { Sparkles, PlayCircle, PlusCircle, LogIn } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import UserMenu from './UserMenu';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ currentView, setCurrentView, onLoadDemo, onStartNew }) {
  const { isAuthenticated, openAuthModal } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors duration-200">
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
              <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight font-display">ResumeAI</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80">MVP</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 -mt-0.5 font-medium">Smart AI Resume Builder</p>
          </div>
        </button>

        {/* Navigation Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Demo Button */}
          <button
            id="btn-nav-demo"
            onClick={onLoadDemo}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/80 dark:border-indigo-800/80 rounded-lg transition-colors"
            title="Load sample Alex Johnson data to test immediately"
          >
            <PlayCircle className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Try Demo</span>
          </button>

          {/* Current view switcher / start button */}
          {currentView === 'landing' ? (
            <button
              id="btn-nav-create"
              onClick={onStartNew}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 rounded-lg shadow-sm shadow-indigo-500/30 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create My Resume</span>
            </button>
          ) : currentView === 'wizard' ? (
            <button
              onClick={() => setCurrentView('landing')}
              className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Exit to Home
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('wizard')}
                className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors"
              >
                Edit Answers
              </button>
              <button
                onClick={onStartNew}
                className="hidden md:inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/50 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>New Resume</span>
              </button>
            </div>
          )}

          {/* Auth State Button / User Avatar Menu */}
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <button
              id="btn-nav-auth"
              type="button"
              onClick={() => openAuthModal('login')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-lg transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Theme Toggle (Night & Day Mode) */}
          <div className="pl-1 sm:pl-1.5 border-l border-slate-200 dark:border-slate-800">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
