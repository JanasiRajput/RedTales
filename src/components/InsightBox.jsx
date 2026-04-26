import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getInsight } from '../data/cycleUtils';

const InsightBox = ({ date, lastPeriodStart }) => {
  const insight = getInsight(date || new Date(), lastPeriodStart);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-auto p-5 rounded-3xl bg-white/40 border border-white/60 backdrop-blur-md shadow-sm"
    >
      <div className="flex items-start gap-3">
        <div className="text-xl">🔮</div>
        <div className="space-y-1">
          <h4 className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Today's Insight</h4>
          <AnimatePresence mode="wait">
            <motion.p
              key={insight}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="text-[15px] text-gray-700 leading-relaxed font-normal"
            >
              {insight}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default InsightBox;
