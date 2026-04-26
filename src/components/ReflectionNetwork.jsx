import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Wind, Sprout } from 'lucide-react';

const PollenParticles = ({ count = 6, phaseId }) => (
  <g>
    {[...Array(count)].map((_, i) => (
      <motion.circle
        key={i}
        r={1 + Math.random() * 1.5}
        fill={`var(--${phaseId}-accent)`}
        initial={{
          x: (Math.random() - 0.5) * 40,
          y: (Math.random() - 0.5) * 40,
          opacity: 0
        }}
        animate={{
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          opacity: [0, 0.6, 0],
          scale: [0.5, 1.2, 0.5]
        }}
        transition={{
          duration: 4 + Math.random() * 4,
          repeat: Infinity,
          delay: Math.random() * 2
        }}
        className="filter blur-[1px]"
      />
    ))}
  </g>
);

const GardenStem = ({ start, end, phaseId, strength = 1, delay = 0, isSubBranch = false }) => {
  // Create a more organic, multi-point curve
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const midX = start.x + dx * 0.5 + (Math.random() - 0.5) * 80;
  const midY = start.y + dy * 0.5 + (Math.random() - 0.5) * 80;
  
  const path = `M ${start.x} ${start.y} Q ${midX} ${midY}, ${end.x} ${end.y}`;

  return (
    <g>
      <motion.path
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: (isSubBranch ? 0.6 : 0.9) + strength * 0.1 }}
        transition={{ duration: 3, delay, ease: "easeInOut" }}
        d={path}
        fill="none"
        stroke={`var(--${phaseId}-accent)`}
        strokeWidth={(isSubBranch ? 3 : 6) + strength * 4}
        strokeLinecap="round"
        className="filter drop-shadow-lg brightness-[0.6]"
      />
      
      {/* Organic Nodes/Leaves along the curve */}
      {[0.2, 0.5, 0.8].map((t, i) => {
        const x = start.x + (midX - start.x) * t * 2 + (end.x - midX) * Math.max(0, t * 2 - 1);
        const y = start.y + (midY - start.y) * t * 2 + (end.y - midY) * Math.max(0, t * 2 - 1);
        
        return (
          <motion.path
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: isSubBranch ? 0.8 : 1.2, opacity: 0.8 }}
            transition={{ delay: delay + 1 + i * 0.4 }}
            d="M 0 0 C 8 -8, 15 -8, 20 0 C 15 8, 8 8, 0 0"
            fill={`var(--${phaseId}-accent)`}
            className="filter brightness-[0.5]"
            style={{ x, y, rotate: Math.random() * 360 }}
          />
        );
      })}
    </g>
  );
};

const FlowerBloom = ({ x, y, phaseId, stage = 0, delay = 0 }) => {
  const petalConfig = {
    menstrual: { count: 3, shape: "M 0 0 C -8 -15, 8 -15, 0 0", rotate: 120 },
    follicular: { count: 5, shape: "M 0 0 C -5 -20, 5 -20, 0 0", rotate: 72 },
    ovulation: { count: 10, shape: "M 0 0 C -12 -25, 12 -25, 0 0", rotate: 36 },
    luteal: { count: 6, shape: "M 0 0 C -15 -20, 15 -20, 0 0", rotate: 60 }
  };

  const config = petalConfig[phaseId];
  const scale = 0.8 + stage * 1.2;

  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', damping: 15, delay }}
      className="cursor-help"
      style={{ x, y }}
    >
      {stage > 0.4 && (
        <motion.circle
          r={35 * stage}
          fill={`var(--${phaseId}-accent)`}
          animate={{ opacity: [0.1, 0.4, 0.1], scale: [1, 1.5, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="filter blur-3xl brightness-[0.9]"
        />
      )}

      <g>
        {[...Array(config.count)].map((_, i) => (
          <motion.path
            key={i}
            d={config.shape}
            fill={`var(--${phaseId}-accent)`}
            className="filter drop-shadow-2xl brightness-[0.7]"
            initial={{ rotate: i * config.rotate, scale: 0 }}
            animate={{ 
              rotate: i * config.rotate, 
              scale: scale,
              opacity: 0.95
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 20, delay: delay + i * 0.05 }}
          />
        ))}
      </g>

      <motion.circle
        r={5 + stage * 6}
        fill={`var(--${phaseId}-accent)`}
        className="filter blur-[1px] brightness-[0.5]"
        animate={{ 
          opacity: [0.7, 1.0, 0.7],
          scale: [1, 1.2, 1] 
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.circle
        r={3 + stage * 2}
        fill="white"
        className="opacity-80"
      />
      
      {stage > 0.8 && <PollenParticles phaseId={phaseId} />}
    </motion.g>
  );
};

const ReflectionNetwork = ({ isOpen, onClose, reflections, activePhaseId }) => {
  const [showInfo, setShowInfo] = React.useState(false);
  const phaseIds = ['menstrual', 'follicular', 'ovulation', 'luteal'];
  
  const networkData = useMemo(() => {
    const center = { x: 0, y: 0 };
    
    const phaseNodes = phaseIds.map((id, i) => {
      // Base angle for the 4 quadrants
      const baseAngle = (i * 90 - 45) * (Math.PI / 180);
      const dist = 140;
      
      // Main branch endpoint
      const mainX = Math.cos(baseAngle) * dist;
      const mainY = Math.sin(baseAngle) * dist;
      
      const phaseReflections = reflections.filter(r => r.phaseId === id);
      
      // Create sub-branches for each reflection to form a tree
      const subBranches = phaseReflections.map((ref, rIdx) => {
        // Spread sub-branches organically around the main branch
        const spread = 0.8;
        const subAngle = baseAngle + (rIdx - (phaseReflections.length - 1) / 2) * spread;
        const subDist = 240 + (Math.random() - 0.5) * 60;
        
        return {
          id: ref.id,
          mood: ref.mood,
          x: Math.cos(subAngle) * subDist,
          y: Math.sin(subAngle) * subDist,
          // Random split point along the main branch
          splitPoint: {
            x: mainX * (0.4 + Math.random() * 0.4),
            y: mainY * (0.4 + Math.random() * 0.4)
          }
        };
      });

      return {
        id,
        x: mainX,
        y: mainY,
        subBranches
      };
    });

    return { center, phaseNodes };
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
            className="fixed inset-0 bg-[#fdfaf7]/99 backdrop-blur-3xl z-[80]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="fixed inset-12 z-[90] flex flex-col items-center justify-center glass rounded-[4rem] border-2 border-white/80 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] pointer-events-none overflow-hidden"
          >
            {/* Header Area */}
            <div className="absolute top-12 text-center pointer-events-auto">
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-[0.6em] mb-4 block flex items-center justify-center gap-4">
                <Sprout size={20} className="text-emerald-700/60" />
                Reflective Ecosystem
              </span>
              <h2 className="text-6xl md:text-7xl font-rose text-gray-800 font-light tracking-[0.1em]">Cycle Garden</h2>
            </div>

            {/* Left Side Legend */}
            <div className="absolute left-12 top-1/2 -translate-y-1/2 flex flex-col gap-10 pointer-events-auto">
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-[0.4em] mb-4">Phase Legend</span>
              {phaseIds.map(id => (
                <div key={id} className="flex items-center gap-6 group cursor-default">
                  <div className={`relative w-6 h-6`}>
                     <div className={`absolute inset-0 rounded-full bg-[var(--${id}-accent)] opacity-30 group-hover:opacity-50 transition-opacity animate-pulse`} />
                     <div className={`absolute inset-1.5 rounded-full bg-[var(--${id}-accent)] shadow-sm brightness-[0.7]`} />
                  </div>
                  <span 
                    className="text-xl font-medium capitalize tracking-widest transition-all duration-300"
                    style={{ color: `var(--${id}-accent)`, filter: 'brightness(0.7)' }}
                  >
                    {id}
                  </span>
                </div>
              ))}
            </div>

            {/* Right Side Info Trigger */}
            <div className="absolute right-12 top-1/2 -translate-y-1/2 pointer-events-auto">
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="p-6 rounded-full glass border border-white/50 shadow-lg hover:scale-110 transition-all text-gray-400 hover:text-emerald-800"
              >
                <Sparkles size={28} />
              </button>
            </div>

            {/* Info Pop-up Card */}
            <AnimatePresence>
              {showInfo && (
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.9 }}
                  className="absolute right-40 top-1/2 -translate-y-1/2 w-72 glass p-8 rounded-[2.5rem] border-2 border-white/80 shadow-2xl pointer-events-auto space-y-6"
                >
                  <div className="space-y-3">
                    <h3 className="text-2xl font-rose text-gray-800 font-light">Your Living Cycle</h3>
                    <p className="text-[9px] text-gray-400 font-medium leading-relaxed uppercase tracking-[0.4em]">Growth through reflection</p>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <p className="text-[9px] font-medium text-emerald-800 uppercase tracking-widest opacity-60">The System</p>
                      <p className="text-xs text-gray-600 font-medium leading-relaxed">
                        Each branch represents a phase of your cycle. As you add notes and moods, your garden grows.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[9px] font-medium text-emerald-800 uppercase tracking-widest opacity-60">Symbolism</p>
                      <p className="text-xs text-gray-600 font-medium leading-relaxed">
                        Buds represent your first thoughts, while full blooms signify deep emotional engagement.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowInfo(false)}
                    className="w-full py-3.5 rounded-2xl bg-gray-800 text-white text-[9px] font-medium uppercase tracking-[0.4em] hover:bg-emerald-800 transition-all shadow-lg"
                  >
                    Got it
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              onClick={onClose}
              className="absolute top-12 right-12 p-6 rounded-full hover:bg-black/5 transition-all pointer-events-auto group"
            >
              <X size={32} className="text-gray-400 group-hover:rotate-90 transition-transform duration-500" />
            </button>

            <div className="relative w-full max-w-2xl aspect-square flex items-center justify-center pointer-events-auto">
              <svg viewBox="-300 -300 600 600" className="w-full h-full overflow-visible">
                {/* Tree Structure */}
                {networkData.phaseNodes.map((phase, i) => (
                  <React.Fragment key={`phase-tree-${phase.id}`}>
                    <GardenStem 
                      start={networkData.center}
                      end={{ x: phase.x, y: phase.y }}
                      phaseId={phase.id}
                      strength={phase.subBranches.length > 0 ? 1.5 : 1}
                      delay={i * 0.2}
                    />

                    {phase.subBranches.map((sub, sIdx) => (
                      <React.Fragment key={sub.id}>
                        <GardenStem 
                          start={sub.splitPoint}
                          end={{ x: sub.x, y: sub.y }}
                          phaseId={phase.id}
                          strength={0.8}
                          isSubBranch={true}
                          delay={i * 0.2 + sIdx * 0.1 + 0.5}
                        />
                        <FlowerBloom 
                          x={sub.x} y={sub.y} 
                          phaseId={phase.id} 
                          stage={sub.mood ? 0.9 : 0.4}
                          delay={i * 0.2 + sIdx * 0.1 + 1.5}
                        />
                      </React.Fragment>
                    ))}

                    <FlowerBloom 
                      x={phase.x} y={phase.y} 
                      phaseId={phase.id} 
                      stage={Math.min(phase.subBranches.length / 4, 1)}
                      delay={i * 0.2 + 0.8}
                    />
                  </React.Fragment>
                ))}

                {/* Central Core (Hub Style) */}
                <motion.g
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12 }}
                >
                  <motion.circle
                    r="100"
                    fill="none"
                    stroke="#F7FAFC"
                    strokeWidth="1"
                    animate={{ opacity: [0.1, 0.3, 0.1], scale: [0.9, 1.1, 0.9] }}
                    transition={{ duration: 8, repeat: Infinity }}
                  />
                  <motion.circle
                    r="80"
                    fill="white"
                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                    className="filter blur-2xl"
                  />
                  
                  <circle r="60" fill="white" className="shadow-2xl" />
                  <defs>
                    <clipPath id="avatarCircle">
                      <circle cx="0" cy="0" r="58" />
                    </clipPath>
                    <radialGradient id="avatarOverlay" cx="50%" cy="50%" r="50%">
                      <stop offset="85%" stopColor="white" stopOpacity="0" />
                      <stop offset="100%" stopColor="white" stopOpacity="0.8" />
                    </radialGradient>
                  </defs>
                  <circle r="58" fill="white" />
                  <image
                    href="/images/avatar.png"
                    x="-58" y="-58" width="116" height="116"
                    clipPath="url(#avatarCircle)"
                    className="select-none pointer-events-none"
                  />
                  <circle r="58" fill="url(#avatarOverlay)" className="pointer-events-none" />
                  <text y="85" textAnchor="middle" className="text-[10px] font-medium uppercase tracking-[0.5em] fill-gray-400">Guardian</text>
                </motion.g>
              </svg>
            </div>

            {/* Bottom Details */}
            <div className="absolute bottom-12 text-center max-w-2xl pointer-events-auto space-y-10">
               <div className="flex justify-center gap-16">
                  <div className="flex items-center gap-4">
                    <Sparkles size={24} className="text-emerald-700/50" />
                    <span className="text-[10px] font-medium text-gray-500 uppercase tracking-[0.3em]">Full Bloom</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Wind size={24} className="text-gray-400/50" />
                    <span className="text-[10px] font-medium text-gray-500 uppercase tracking-[0.3em]">Dormant Bud</span>
                  </div>
               </div>
               <p className="text-xl text-gray-500 font-medium leading-relaxed italic max-w-xl mx-auto opacity-80">
                  "Your thoughts are seeds. The more you reflect, the more your emotional landscape blooms into a unique, personal garden."
               </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ReflectionNetwork;
