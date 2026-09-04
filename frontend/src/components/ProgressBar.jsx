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
    <div className="w-full bg-white dark:bg-neutral-900 border-b border-neutral-200/80 dark:border-neutral-800 py-3.5 px-4 sm:px-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        {/* Top text */}
        <div className="flex items-center justify-between mb-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-900 dark:text-neutral-100">
              {isReview ? 'Final Review' : `Step ${currentStep} of ${totalSteps}`}
            </span>
            <span className="text-neutral-300 dark:text-neutral-700">•</span>
            <span className="font-medium text-neutral-600 dark:text-neutral-400 truncate">
              {STEP_TITLES[currentStep - 1] || 'Resume Details'}
            </span>
          </div>
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">{progressPercent}% Completed</span>
        </div>

        {/* Progress Track */}
        <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-neutral-900 dark:bg-white rounded-full"
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
                      ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-950'
                      : isCurrent
                      ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white border-2 border-neutral-900 dark:border-white scale-110 shadow-sm'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : stepNum}
                </div>
                <span
                  className={`text-[10px] mt-1 tracking-tight font-medium max-w-[65px] text-center truncate ${
                    isCurrent ? 'text-neutral-900 dark:text-white font-bold' : 'text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-800 dark:group-hover:text-neutral-200'
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
