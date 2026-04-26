import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import MonthlyWrap from './MonthlyWrap';

const MonthlyWrapModal = ({ isOpen, onClose, cycleData, reflections }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Immersive Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#fdfaf7]/95 backdrop-blur-3xl z-[100]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="fixed inset-0 z-[110] flex flex-col items-center justify-center pointer-events-none"
          >
            {/* Header Area */}
            <div className="absolute top-12 text-center pointer-events-none">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.6em] mb-4 block">Monthly Journey</span>
              <h2 className="text-4xl font-tales text-gray-800 font-light tracking-widest">Your Wrap</h2>
            </div>

            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-12 right-12 p-4 rounded-full hover:bg-black/5 transition-all pointer-events-auto group z-50"
            >
              <X size={24} className="text-gray-400 group-hover:rotate-90 transition-transform duration-500" />
            </button>

            {/* Content Container */}
            <div className="w-full h-full pointer-events-auto">
              <MonthlyWrap cycleData={cycleData} reflections={reflections} />
            </div>

            {/* Ambient Background Glows */}
            <motion.div 
              animate={{ opacity: [0.03, 0.08, 0.03] }}
              transition={{ duration: 12, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-purple-50 -z-10"
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MonthlyWrapModal;
