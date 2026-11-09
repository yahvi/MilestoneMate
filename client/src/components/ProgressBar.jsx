import React from 'react';

export default function ProgressBar({ percentage = 0, totalMilestones = 0, completedMilestones = 0, size = 'md' }) {
  const safePercent = Math.min(100, Math.max(0, percentage));

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5 text-xs font-medium text-slate-700">
        <span>Project Progress</span>
        <div className="flex items-center gap-2">
          {totalMilestones > 0 && (
            <span className="text-slate-500 font-normal">
              {completedMilestones} of {totalMilestones} milestones
            </span>
          )}
          <span className="font-bold text-indigo-600">{safePercent}%</span>
        </div>
      </div>
      <div
        className={`w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60 ${
          size === 'lg' ? 'h-4' : size === 'sm' ? 'h-2' : 'h-3'
        }`}
      >
        <div
          className="h-full bg-linear-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-full transition-all duration-500 ease-out shadow-2xs"
          style={{ width: `${safePercent}%` }}
        />
      </div>
    </div>
  );
}
