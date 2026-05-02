import React from 'react';
import { motion } from 'framer-motion';

export default function ProgressBar({ progress, color = 'bg-primary-500', height = 'h-3', showText = true }) {
  // Ensure progress is between 0 and 100
  const normalizedProgress = Math.min(100, Math.max(0, isNaN(progress) ? 0 : progress));

  return (
    <div className="flex items-center gap-3 w-full">
      <div className={`flex-1 ${height} bg-slate-100 rounded-full overflow-hidden`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${normalizedProgress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-full ${color}`}
        />
      </div>
      {showText && (
        <span className="text-sm font-bold text-slate-500 font-inter min-w-[36px]">
          {Math.round(normalizedProgress)}%
        </span>
      )}
    </div>
  );
}
