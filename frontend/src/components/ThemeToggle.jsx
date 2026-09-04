import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = "" }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      id="theme-toggle-btn"
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
        isDark
          ? 'bg-neutral-800 text-amber-400 hover:bg-neutral-700 border border-neutral-600 hover:border-amber-400 shadow-sm'
          : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 hover:text-neutral-950 border border-neutral-300 shadow-xs'
      } ${className}`}
      aria-label={isDark ? "Switch to Day mode" : "Switch to Night mode"}
      title={isDark ? "Switch to Day mode (Light)" : "Switch to Night mode (Dark)"}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex items-center justify-center text-amber-400"
          >
            <Sun className="w-4 h-4" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex items-center justify-center text-slate-700 hover:text-indigo-600"
          >
            <Moon className="w-4 h-4" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
