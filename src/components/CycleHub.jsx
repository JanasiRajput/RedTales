import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronRight, Edit3, Check, Info } from 'lucide-react';
import { format } from 'date-fns';
import { getCycleState } from '../data/cycleUtils';

const CycleHub = ({ cycleData, onUpdate, isEditing, setIsEditing }) => {
  const [tempDate, setTempDate] = useState(cycleData?.lastPeriodStart ? format(cycleData.lastPeriodStart, 'yyyy-MM-dd') : '');
  const [tempDuration, setTempDuration] = useState(cycleData?.duration || 5);

  const state = cycleData?.lastPeriodStart ? getCycleState(new Date(), cycleData.lastPeriodStart, cycleData.duration) : null;

  const handleSave = () => {
    if (tempDate) {
      onUpdate({
        lastPeriodStart: new Date(tempDate),
        duration: parseInt(tempDuration) || 5
      });
      setIsEditing(false);
    }
  };

  return (
    <div className="relative w-full max-w-[30rem] mx-auto p-4">
      <AnimatePresence mode="wait">
        {isEditing || !cycleData?.lastPeriodStart ? (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass p-12 rounded-[4rem] border border-white/50 shadow-2xl space-y-10"
          >
            <div className="text-center space-y-3">
              <h3 className="text-3xl font-medium text-gray-800 tracking-tight">Your Cycle Hub</h3>
              <p className="text-base text-gray-400">Let's set up your tracking</p>
            </div>

            <div className="space-y-8">
              {/* Date Input */}
              <div className="space-y-4">
                <label className="text-[13px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-3">
                  <Calendar size={18} /> Last Period Started
                </label>
                <input
                  type="date"
                  value={tempDate}
                  onChange={(e) => setTempDate(e.target.value)}
                  className="w-full p-6 rounded-3xl bg-white/50 border-2 border-transparent focus:border-pink-200 focus:bg-white outline-none transition-all text-xl text-gray-700 font-medium"
                />
              </div>

              {/* Duration Input */}
              <div className="space-y-4">
                <label className="text-[13px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-3">
                  <Info size={18} /> Period Duration (Days)
                </label>
                <div className="flex items-center gap-6">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={tempDuration}
                    onChange={(e) => setTempDuration(e.target.value)}
                    className="flex-grow h-3 bg-gray-100 rounded-full appearance-none cursor-pointer accent-pink-300"
                  />
                  <span className="text-2xl font-medium text-gray-600 w-10">{tempDuration}</span>
                </div>
              </div>

              <button
                disabled={!tempDate}
                onClick={handleSave}
                className={`w-full py-6 rounded-3xl font-bold text-lg shadow-lg flex items-center justify-center gap-4 transition-all
                           ${tempDate ? 'bg-gray-800 text-white hover:scale-[1.02] active:scale-95' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
              >
                <Check size={24} />
                Confirm Cycle
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="tracking"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="relative flex flex-col items-center"
          >
            {/* Progress Arc (Scaled Up) */}
            <div className="relative w-80 h-80 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                {/* Background Ring */}
                <circle
                  cx="160"
                  cy="160"
                  r="140"
                  fill="none"
                  stroke="#F7FAFC"
                  strokeWidth="12"
                  className="opacity-50"
                />
                {/* Progress Ring */}
                <motion.circle
                  cx="160"
                  cy="160"
                  r="140"
                  fill="none"
                  stroke={`var(--${state.phaseId}-accent)`}
                  strokeWidth="12"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 1000" }}
                  animate={{ strokeDasharray: `${(state.progressPercent / 100) * 880} 1000` }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  style={{ strokeDashoffset: 0 }}
                />
              </svg>

              {/* Center Info */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[12px] font-bold text-gray-400 uppercase tracking-[0.4em] mb-2">Day</span>
                <motion.span 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-8xl font-rose text-gray-800 leading-none"
                >
                  {state.cycleDay}
                </motion.span>
                <span className="text-[14px] font-bold text-gray-500 mt-2 uppercase tracking-[0.3em]">{state.phaseId}</span>
              </div>
              
              {/* Current Pos Glow */}
              <motion.div
                className="absolute w-6 h-6 rounded-full blur-md"
                style={{ 
                  backgroundColor: `var(--${state.phaseId}-accent)`,
                  left: '50%',
                  top: '50%',
                  transform: `rotate(${state.progressPercent * 3.6 - 90}deg) translate(140px) rotate(${-(state.progressPercent * 3.6 - 90)}deg) translate(-50%, -50%)`
                }}
              />
            </div>

            {/* Prediction Label (Scaled Up) */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-10 text-center p-6 glass rounded-3xl border border-white/40 shadow-sm"
            >
              <p className="text-lg text-gray-500 font-normal">
                Your next period is predicted for <span className="font-bold text-gray-700">{format(state.nextPeriod, 'MMMM d')}</span>
              </p>
            </motion.div>

            {/* Edit Button (Relocated for visibility) */}
            <button
              onClick={() => setIsEditing(true)}
              className="absolute -top-4 -right-4 p-3 rounded-2xl glass border border-white/50 text-gray-400 hover:text-gray-800 transition-all hover:scale-110 shadow-sm z-50 bg-white/50"
              title="Edit cycle"
            >
              <Edit3 size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CycleHub;
