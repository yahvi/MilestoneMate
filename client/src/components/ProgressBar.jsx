import React from 'react';

export default function ProgressBar({ percentage = 0, totalMilestones = 0, completedMilestones = 0, size = 'md' }) {
  const safePercent = Math.min(100, Math.max(0, percentage));

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5 text-xs font-semibold text-[#283832]">
        <span>Project Progress</span>
        <div className="flex items-center gap-2">
          {totalMilestones > 0 && (
            <span className="text-[#68776F] font-medium">
              {completedMilestones} of {totalMilestones} milestones
            </span>
          )}
          <span className="font-black text-[#047857]">{safePercent}%</span>
        </div>
      </div>
      <div
        className={`w-full bg-[#EFE8DC] rounded-full overflow-hidden p-0.5 border border-[#E0D5C5] ${
          size === 'lg' ? 'h-4' : size === 'sm' ? 'h-2' : 'h-3'
        }`}
      >
        <div
          className="h-full bg-linear-to-r from-[#047857] via-[#059669] to-[#E34234] rounded-full transition-all duration-500 ease-out shadow-xs"
          style={{ width: `${safePercent}%` }}
        />
      </div>
    </div>
  );
}
