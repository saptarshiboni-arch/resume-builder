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
    if (score >= 70) return 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800';
    return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800';
  };

  const getProgressColor = (score) => {
    if (score >= 17) return 'bg-emerald-500';
    if (score >= 13) return 'bg-indigo-500';
    return 'bg-amber-500';
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm space-y-4 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Header & Gauge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-sm">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm font-display">
              Resume Quality Score
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Evaluated on clarity, impact & ATS structure</p>
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
              <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 capitalize">
                <span>{cat}</span>
                <span className="font-semibold text-slate-900 dark:text-white">{score}/{maxCat}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
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
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Improvement Suggestions:</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            {recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold leading-tight mt-0.5">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
