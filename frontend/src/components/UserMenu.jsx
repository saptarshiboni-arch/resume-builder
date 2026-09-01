import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut,
  FileText,
  ChevronDown,
  Briefcase,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  if (!user) return null;

  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Trigger Button */}
      <button
        id="user-profile-menu-btn"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-left focus:outline-none"
      >
        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow-xs">
          {initials}
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-xs font-bold text-slate-900 dark:text-white leading-none truncate max-w-[100px]">
            {user.name}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight truncate max-w-[100px]">
            {user.targetRole || 'Member'}
          </div>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/90 dark:border-slate-800 p-2 z-50 text-slate-900 dark:text-slate-100"
          >
            {/* Header info */}
            <div className="p-3 bg-slate-50/80 dark:bg-slate-800/50 rounded-xl mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {initials}
                </div>
                <div className="overflow-hidden">
                  <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                    {user.name}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {user.email}
                  </div>
                </div>
              </div>

              <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-indigo-700 dark:text-indigo-300 font-semibold bg-indigo-50 dark:bg-indigo-950/70 px-2 py-1 rounded-lg border border-indigo-200/60 dark:border-indigo-800/60">
                <Briefcase className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                <span>{user.targetRole} • {user.careerLevel || 'Standard'}</span>
              </div>
            </div>

            {/* Saved Resumes Info */}
            <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-1">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Saved Resumes:</span>
              </span>
              <span className="font-bold text-slate-900 dark:text-white px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px]">
                {user.resumes?.length || 1}
              </span>
            </div>

            {/* Actions */}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors text-left"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
