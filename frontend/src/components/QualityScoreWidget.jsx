import React from 'react';
import { Award, CheckCircle, TrendingUp, AlertTriangle, Lightbulb, ChevronRight } from 'lucide-react';

export default function QualityScoreWidget({ scoreData }) {
  if (!scoreData) return null;

  const {
    overallScore = 80,
    categoryScores = { content: 16, skills: 18, projects: 16, experience: 16, formatting: 16 },
    recommendations = [],
    rating = 'Good'
  } = scoreData;

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800';
    if (score >= 70) return 'text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700';
    return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800';
  };

  const getProgressColor = (score) => {
    if (score >= 17) return 'bg-emerald-500';
    if (score >= 13) return 'bg-neutral-900 dark:bg-white';
    return 'bg-amber-500';
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 p-5 shadow-sm space-y-4 text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
      {/* Top Header & Gauge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-neutral-900 dark:bg-neutral-800 border border-neutral-800 dark:border-neutral-700 flex items-center justify-center text-amber-400 shadow-sm">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-neutral-900 dark:text-white text-sm font-display">
              Resume Quality Score
            </h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">Evaluated on clarity, impact & ATS structure</p>
          </div>
        </div>

        {/* Big Badge */}
        <div className={`px-3 py-1.5 rounded-xl border font-extrabold text-sm flex items-center gap-1.5 ${getScoreColor(overallScore)}`}>
          <span>{overallScore}</span>
          <span className="text-xs font-semibold opacity-70">/ 100</span>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="space-y-2.5 pt-1">
        {Object.entries(categoryScores).map(([cat, score]) => {
          const maxCat = 20;
          const pct = Math.round((score / maxCat) * 100);
          return (
            <div key={cat} className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-neutral-700 dark:text-neutral-300 capitalize">
                <span>{cat}</span>
                <span className="font-semibold text-neutral-900 dark:text-white">{score}/{maxCat}</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getProgressColor(score)}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-2">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Improvement Suggestions:</span>
          </div>
          <ul className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
            {recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-neutral-900 dark:text-neutral-100 font-bold leading-tight mt-0.5">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
