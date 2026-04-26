import React from 'react';
import { motion } from 'framer-motion';
import { isSameDay, isToday, format, isAfter } from 'date-fns';
import { getPhaseForDate } from '../data/cycleUtils';

const DayCell = ({ date, isSelected, onClick, lastPeriodStart }) => {
  const phase = getPhaseForDate(date, lastPeriodStart);
  const today = isToday(date);
  const future = isAfter(date, new Date()) && !today;

  const phaseColors = {
    menstrual: 'from-pink-100/50 to-rose-200/30',
    follicular: 'from-peach-100/50 to-orange-200/30',
    ovulation: 'from-yellow-100/50 to-amber-200/30',
    luteal: 'from-purple-100/50 to-indigo-200/30',
  };

  const dotColors = {
    menstrual: 'bg-rose-400/60',
    follicular: 'bg-orange-300/60',
    ovulation: 'bg-amber-400/60',
    luteal: 'bg-indigo-400/60',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(date)}
      className={`relative aspect-square cursor-pointer flex flex-col items-center justify-center p-1
                 rounded-2xl transition-all duration-500 overflow-hidden
                 ${isSelected ? 'shadow-inner scale-95 ring-2 ring-white/50' : 'hover:shadow-md'}
                 ${today ? 'shadow-[0_0_15px_rgba(255,255,255,0.8)] z-10' : ''}
                 bg-gradient-to-br ${phaseColors[phase]}
                 ${future ? 'opacity-40 grayscale-[0.2] blur-[0.3px]' : 'opacity-100'}
                 border border-white/20`}
    >
      {/* Background Glow for Today */}
      {today && (
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 bg-white rounded-full blur-xl"
        />
      )}

      {/* Sweet Phase Dot (Only for Menstrual Phase) */}
      {phase === 'menstrual' && (
        <div className={`absolute top-2.5 right-2.5 w-2 h-2 rounded-full ${dotColors[phase]} shadow-sm transition-all duration-500`} />
      )}

      <span className={`text-xl font-normal z-10 ${today ? 'text-gray-800' : 'text-gray-500'}`}>
        {format(date, 'd')}
      </span>
    </motion.div>
  );
};

export default DayCell;
