import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const STEP_TITLES = [
  "Personal Information",
  "Career Goal",
  "Education",
  "Skills & Tech",
  "Projects",
  "Experience",
  "Certifications",
  "Achievements & More",
  "Review & Generate"
];

export default function ProgressBar({ currentStep, totalSteps = 8, onJumpToStep }) {
  // currentStep is 1-indexed (1 to 8, or 9 for Review)
  const isReview = currentStep > totalSteps;
  const progressPercent = isReview ? 100 : Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3.5 px-4 sm:px-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        {/* Top text */}
        <div className="flex items-center justify-between mb-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="font-bold text-indigo-600 dark:text-indigo-400">
              {isReview ? 'Final Review' : `Step ${currentStep} of ${totalSteps}`}
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
              {STEP_TITLES[currentStep - 1] || 'Resume Details'}
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{progressPercent}% Completed</span>
        </div>

        {/* Progress Track */}
        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        {/* Step dots for fast jumping (on desktop) */}
        <div className="hidden sm:flex justify-between items-center mt-3 pt-1">
          {STEP_TITLES.slice(0, 8).map((title, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => onJumpToStep && onJumpToStep(stepNum)}
                className={`flex flex-col items-center group focus:outline-none ${
                  isCurrent ? 'cursor-default' : 'cursor-pointer'
                }`}
                title={`Jump to ${title}`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    isCompleted
                      ? 'bg-indigo-600 text-white'
                      : isCurrent
                      ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-2 border-indigo-600 scale-110 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : stepNum}
                </div>
                <span
                  className={`text-[10px] mt-1 tracking-tight font-medium max-w-[65px] text-center truncate ${
                    isCurrent ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                  }`}
                >
                  {title.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
