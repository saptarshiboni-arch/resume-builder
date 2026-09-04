import React from 'react';
import { Sparkles, PlayCircle, PlusCircle, LogIn } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import UserMenu from './UserMenu';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ currentView, setCurrentView, onLoadDemo, onStartNew }) {
  const { isAuthenticated, openAuthModal } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 dark:border-neutral-800/80 bg-[#fbfaf8]/90 dark:bg-[#0c0d0e]/90 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-2.5 group text-left focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center shadow-sm group-hover:scale-105 transition-all">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg text-neutral-900 dark:text-white tracking-tight font-display">Resume<span className="text-neutral-500 dark:text-neutral-400">Craft</span></span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">PRO</span>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 -mt-0.5 font-medium">Smart Resume Studio</p>
          </div>
        </button>

        {/* Navigation Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Demo Button */}
          <button
            id="btn-nav-demo"
            onClick={onLoadDemo}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-neutral-100/80 dark:bg-neutral-850 hover:bg-neutral-200/80 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/80 rounded-lg transition-colors"
            title="Load sample Alex Johnson data to test immediately"
          >
            <PlayCircle className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
            <span>Try Demo</span>
          </button>

          {/* Current view switcher / start button */}
          {currentView === 'landing' ? (
            <button
              id="btn-nav-create"
              onClick={onStartNew}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 active:scale-98 rounded-lg shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Resume</span>
            </button>
          ) : currentView === 'wizard' ? (
            <button
              onClick={() => setCurrentView('landing')}
              className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Exit to Home
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('wizard')}
                className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 px-3 py-1.5 rounded-lg transition-colors border border-neutral-200 dark:border-neutral-700"
              >
                Edit Answers
              </button>
              <button
                onClick={onStartNew}
                className="hidden md:inline-flex items-center gap-1 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white bg-neutral-100 dark:bg-neutral-850 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/80 rounded-lg transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Theme Toggle (Night & Day Mode) */}
          <div className="pl-1 sm:pl-1.5 border-l border-neutral-200 dark:border-neutral-800">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
