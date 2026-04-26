import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const PhaseModal = ({ phase, isOpen, onClose }) => {
  if (!phase) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md 
                       p-8 rounded-[2rem] shadow-xl z-50 glass
                       bg-white/90 border-2`}
            style={{ borderColor: `var(--${phase.id}-accent)` }}
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>

            <div className="space-y-6">
              <div className="flex items-center gap-6">
                {phase.image && (
                  <div className="w-20 h-20 rounded-2xl bg-white/50 p-2 flex items-center justify-center border border-white/20">
                    <img src={phase.image} alt="" className="w-full h-full object-contain" />
                  </div>
                )}
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Phase</span>
                  <h2 className="text-4xl font-medium tracking-tight" style={{ color: `var(--${phase.id}-text)` }}>
                    {phase.name}
                  </h2>
                </div>
              </div>

              <p className="text-xl leading-relaxed text-gray-700 font-normal">
                {phase.shortExplanation}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-white/50 border border-white/20">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest">Mood</span>
                  <span className="text-gray-800 font-normal text-lg">{phase.mood}</span>
                </div>
                <div className="p-5 rounded-2xl bg-white/50 border border-white/20">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest">Energy</span>
                  <span className="text-gray-800 font-normal text-lg">{phase.energy}</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-opacity-30 italic text-gray-600 border-l-4 text-lg font-normal"
                   style={{ 
                     backgroundColor: `var(--${phase.id}-bg)`,
                     borderLeftColor: `var(--${phase.id}-accent)`
                   }}>
                "{phase.relatableLine}"
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PhaseModal;
