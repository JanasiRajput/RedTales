import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Fingerprint, Activity, Sparkles } from 'lucide-react';

const NeuralPath = ({ start, end, phaseId, strength = 1, delay = 0 }) => {
  const midX = (start.x + end.x) / 2 + (Math.random() - 0.5) * 40;
  const midY = (start.y + end.y) / 2 + (Math.random() - 0.5) * 40;

  return (
    <motion.path
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.3 + strength * 0.1 }}
      transition={{ duration: 2, delay, ease: "easeInOut" }}
      d={`M ${start.x} ${start.y} Q ${midX} ${midY}, ${end.x} ${end.y}`}
      fill="none"
      stroke={`var(--${phaseId}-accent)`}
      strokeWidth={1 + strength * 1.5}
      strokeLinecap="round"
      className="filter blur-[1px]"
    />
  );
};

const NeuralNode = ({ x, y, phaseId, size = 6, label, delay = 0, isGlowing = false }) => (
  <motion.g
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ type: 'spring', damping: 15, delay }}
  >
    {isGlowing && (
      <motion.circle
        cx={x}
        cy={y}
        r={size * 2}
        fill={`var(--${phaseId}-accent)`}
        animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.5, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="filter blur-xl"
      />
    )}
    <motion.circle
      cx={x}
      cy={y}
      r={size}
      fill={`var(--${phaseId}-accent)`}
      className="cursor-help shadow-lg"
      whileHover={{ scale: 1.5 }}
    />
    {label && (
      <motion.text
        x={x}
        y={y + size + 12}
        textAnchor="middle"
        className="text-[8px] font-bold fill-gray-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {label}
      </motion.text>
    )}
  </motion.g>
);

const ReflectionNetwork = ({ isOpen, onClose, reflections, activePhaseId }) => {
  const phaseIds = ['menstrual', 'follicular', 'ovulation', 'luteal'];
  
  // Logic to process patterns
  const networkData = useMemo(() => {
    const center = { x: 0, y: 0 };
    const phaseNodes = phaseIds.map((id, i) => {
      const angle = (i * 90 - 45) * (Math.PI / 180);
      const dist = 120;
      return {
        id,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        reflections: reflections.filter(r => r.phaseId === id)
      };
    });

    const patterns = phaseNodes.map(phase => {
      const moodCounts = {};
      phase.reflections.forEach(r => {
        if (r.mood) moodCounts[r.mood] = (moodCounts[r.mood] || 0) + 1;
      });
      return { phaseId: phase.id, moods: moodCounts };
    });

    return { center, phaseNodes, patterns };
  }, [reflections]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#fdfaf7]/90 backdrop-blur-2xl z-[80]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[90] flex flex-col items-center justify-center pointer-events-none"
          >
            <div className="absolute top-12 text-center pointer-events-auto">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.6em] mb-4 block">Reflection System</span>
              <h2 className="text-4xl font-tales text-gray-800 font-light tracking-widest">Neural Network</h2>
            </div>

            <button 
              onClick={onClose}
              className="absolute top-12 right-12 p-4 rounded-full hover:bg-black/5 transition-all pointer-events-auto group"
            >
              <X size={24} className="text-gray-400 group-hover:rotate-90 transition-transform duration-500" />
            </button>

            <div className="relative w-full max-w-4xl aspect-square flex items-center justify-center pointer-events-auto">
              <svg viewBox="-300 -300 600 600" className="w-full h-full overflow-visible">
                {networkData.phaseNodes.map((phase, i) => (
                  <NeuralPath 
                    key={`path-${phase.id}`}
                    start={networkData.center}
                    end={phase}
                    phaseId={phase.id}
                    strength={phase.reflections.length > 0 ? 2 : 1}
                    delay={i * 0.2}
                  />
                ))}

                {networkData.phaseNodes.map((phase, pIdx) => (
                  phase.reflections.map((ref, rIdx) => {
                    const angle = Math.atan2(phase.y, phase.x) + (rIdx - (phase.reflections.length - 1) / 2) * 0.25;
                    const dist = 220;
                    const rx = Math.cos(angle) * dist;
                    const ry = Math.sin(angle) * dist;
                    const strength = networkData.patterns[pIdx].moods[ref.mood] || 1;

                    return (
                      <React.Fragment key={ref.id}>
                        <NeuralPath 
                          start={phase}
                          end={{ x: rx, y: ry }}
                          phaseId={phase.id}
                          strength={strength}
                          delay={pIdx * 0.2 + rIdx * 0.1 + 0.5}
                        />
                        <NeuralNode 
                          x={rx} y={ry} 
                          phaseId={phase.id} 
                          size={4 + strength * 2}
                          isGlowing={strength > 1}
                          delay={pIdx * 0.2 + rIdx * 0.1 + 1.5}
                        />
                      </React.Fragment>
                    );
                  })
                ))}

                <motion.g
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12 }}
                >
                  <motion.circle
                    r="45"
                    fill="white"
                    animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="filter blur-xl"
                  />
                  <circle r="38" fill="white" className="shadow-2xl" />
                  <defs>
                    <clipPath id="avatarCircle">
                      <circle cx="0" cy="0" r="35" />
                    </clipPath>
                    <radialGradient id="avatarOverlay" cx="50%" cy="50%" r="50%">
                      <stop offset="85%" stopColor="white" stopOpacity="0" />
                      <stop offset="100%" stopColor="white" stopOpacity="0.8" />
                    </radialGradient>
                  </defs>
                  <circle r="35" fill="white" />
                  <image
                    href="/images/avatar.png"
                    x="-35" y="-35" width="70" height="70"
                    clipPath="url(#avatarCircle)"
                    className="select-none pointer-events-none"
                  />
                  <circle r="35" fill="url(#avatarOverlay)" className="pointer-events-none" />
                  <circle r="35" fill="none" stroke="white" strokeWidth="3" className="opacity-60" />
                  <text y="58" textAnchor="middle" className="text-[10px] font-bold uppercase tracking-[0.4em] fill-gray-400">You</text>
                </motion.g>

                {networkData.phaseNodes.map((phase, i) => (
                  <motion.g
                    key={`node-${phase.id}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 15, delay: i * 0.2 + 0.8 }}
                  >
                    <NeuralNode 
                      x={phase.x} y={phase.y} 
                      phaseId={phase.id} 
                      size={14} 
                      isGlowing={phase.id === activePhaseId}
                    />
                    <text 
                      x={phase.x} y={phase.y + 25} 
                      textAnchor="middle" 
                      className="text-[8px] font-bold uppercase tracking-[0.4em] fill-gray-300"
                    >
                      {phase.id.charAt(0)}
                    </text>
                  </motion.g>
                ))}
              </svg>
            </div>

            <div className="absolute bottom-12 text-center max-w-sm pointer-events-auto space-y-6">
               <div className="flex justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.5)]" />
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-200" />
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Strengthening</span>
                  </div>
               </div>
               <p className="text-xs text-gray-400 font-normal leading-relaxed">
                  Your cycle is a neural pattern. Repeated moods and experiences strengthen these pathways, 
                  creating a unique emotional fingerprint.
               </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ReflectionNetwork;
