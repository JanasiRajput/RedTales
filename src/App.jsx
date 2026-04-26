import React, { useState } from 'react';
import CharacterCard from './components/CharacterCard';
import PhaseModal from './components/PhaseModal';
import ReflectionModal from './components/ReflectionModal';
import CycleHub from './components/CycleHub';
import ReflectionNetwork from './components/ReflectionNetwork';
import MonthlyWrapModal from './components/MonthlyWrapModal';
import CalendarSidebar from './components/CalendarSidebar';
import { phases } from './data/phases';
import { getPhaseForDate } from './data/cycleUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, ChevronLeft, ChevronRight, TreePine, Sparkles, LogIn, LogOut, RefreshCw } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Persistent Cycle Data
  const [cycleData, setCycleData] = useState(() => {
    const saved = localStorage.getItem('redTales_cycleData');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...parsed, lastPeriodStart: new Date(parsed.lastPeriodStart) };
    }
    return null;
  });

  const [isEditingCycle, setIsEditingCycle] = useState(!cycleData);
  const [activePhaseId, setActivePhaseId] = useState(() => getPhaseForDate(new Date(), cycleData?.lastPeriodStart));
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReflectionModalOpen, setIsReflectionModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTreeOpen, setIsTreeOpen] = useState(false);
  const [isWrapOpen, setIsWrapOpen] = useState(false);
  const [feedbackPhaseId, setFeedbackPhaseId] = useState(null);
  const [reflections, setReflections] = useState([]);
  const { loginWithRedirect, logout, isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync active phase when date or cycle data changes
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const phaseId = getPhaseForDate(date, cycleData?.lastPeriodStart);
    setActivePhaseId(phaseId);
  };

  const handleUpdateCycle = (data) => {
    setCycleData(data);
    localStorage.setItem('redTales_cycleData', JSON.stringify(data));
    const phaseId = getPhaseForDate(selectedDate, data.lastPeriodStart);
    setActivePhaseId(phaseId);
  };

  const handleOpenModal = (phase) => {
    setSelectedPhase(phase);
    setIsModalOpen(true);
  };

  const handleOpenReflection = (phase) => {
    setSelectedPhase(phase);
    setIsReflectionModalOpen(true);
  };

  const handleSaveReflection = (phaseId, data) => {
    const newReflection = {
      id: Date.now(),
      phaseId,
      timestamp: new Date(),
      ...data
    };
    setReflections(prev => [...prev, newReflection]);
    setFeedbackPhaseId(phaseId);
    setTimeout(() => setFeedbackPhaseId(null), 1500);
  };

  const handleSyncLifestyle = async () => {
    if (!isAuthenticated) {
      loginWithRedirect({
        authorizationParams: {
          connection: 'google-oauth2'
        }
      });
      return;
    }

    setIsSyncing(true);
    try {
      const token = await getAccessTokenSilently();
      const energyLevel = (activePhaseId === 'follicular' || activePhaseId === 'ovulation') ? 'high' : 'low';

      const response = await fetch('http://localhost:8000/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ energy_level: energyLevel })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Sync failed');

      console.log('Sync result:', data);
      alert(`Sync successful! Actions taken: ${data.actions_taken.map(a => a.summary || a.title).join(', ')}`);
    } catch (error) {
      console.error('Sync failed:', error);
      alert('Sync failed. Please check console for details.');
    } finally {
      setIsSyncing(false);
    }
  };

  const activePhase = phases.find(p => p.id === activePhaseId);

  return (
    <div className="relative h-screen w-full bg-[#fdfaf7] overflow-x-hidden overflow-y-auto p-4 md:p-8 lg:p-12 font-['Outfit',_sans-serif]">
      {/* Fixed Branding (Inset from top-right edge) */}
      <div className="fixed top-4 right-4 md:top-8 md:right-8 lg:top-12 lg:right-12 z-[60] text-right pointer-events-none">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col items-end"
        >
          <h1 className="text-6xl md:text-7xl font-rose text-[#DC143C]/90 leading-[0.7] lowercase font-normal">
            red
          </h1>
          <h1 className="text-2xl md:text-3xl font-tales text-gray-700/80 tracking-[0.2em] uppercase font-normal">
            Tales
          </h1>
        </motion.div>
      </div>

      {/* Sidebar Toggle Button (Inset) */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`fixed top-4 md:top-8 lg:top-12 z-50 p-3 md:p-4 rounded-2xl glass border border-white/50 shadow-lg 
                   hover:scale-110 transition-all duration-500 text-gray-500 hover:text-gray-800
                   ${isSidebarOpen
            ? 'left-[calc(100%-60px)] md:left-[450px] lg:left-[500px]'
            : 'left-4 md:left-8 lg:left-12'}`}
      >
        {isSidebarOpen ? <ChevronLeft size={24} /> : <Menu size={24} />}
      </button>

      {/* Navigation Buttons (Stacked & Inset) */}
      <div className="fixed top-32 md:top-44 right-4 md:right-8 lg:right-12 z-50 flex flex-col gap-3 md:gap-4 items-end">
        <button
          onClick={() => setIsTreeOpen(true)}
          className="px-4 py-3 md:px-6 md:py-4 rounded-2xl glass border border-white/50 shadow-lg 
                     hover:scale-110 transition-all duration-300 text-gray-500 hover:text-gray-800
                     flex items-center gap-2 md:gap-3 group w-fit"
        >
          <TreePine size={24} className="group-hover:text-emerald-500 transition-colors" />
          <span className="text-base font-semibold tracking-wide">Tree</span>
        </button>

        <button
          onClick={() => setIsWrapOpen(true)}
          className="px-4 py-3 md:px-6 md:py-4 rounded-2xl glass border border-white/50 shadow-lg 
                     hover:scale-110 transition-all duration-300 text-gray-500 hover:text-gray-800
                     flex items-center gap-2 md:gap-3 group w-fit"
        >
          <Sparkles size={20} className="md:w-6 md:h-6 group-hover:text-pink-400 transition-colors" />
          <span className="text-sm md:text-base font-semibold tracking-wide">Wrap</span>
        </button>

        <button
          onClick={handleSyncLifestyle}
          disabled={isSyncing}
          className="px-4 py-3 md:px-6 md:py-4 rounded-2xl glass border border-white/50 shadow-lg 
                     hover:scale-110 transition-all duration-300 text-gray-500 hover:text-gray-800
                     flex items-center gap-2 md:gap-3 group w-fit bg-white/30"
        >
          <RefreshCw size={24} className={`${isSyncing ? 'animate-spin text-blue-500' : 'group-hover:text-blue-500'} transition-colors`} />
          <span className="text-base font-semibold tracking-wide">Sync AI</span>
        </button>

        {isAuthenticated ? (
          <button
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            className="px-4 py-3 md:px-6 md:py-4 rounded-2xl glass border border-white/50 shadow-lg 
                       hover:scale-110 transition-all duration-300 text-gray-500 hover:text-gray-800
                       flex items-center gap-2 md:gap-3 group w-fit"
          >
            <LogOut size={20} className="md:w-6 md:h-6 group-hover:text-red-500 transition-colors" />
            <span className="text-sm md:text-base font-semibold tracking-wide">Logout</span>
          </button>
        ) : (
          <button
            onClick={() => loginWithRedirect({
              authorizationParams: {
                connection: 'google-oauth2'
              }
            })}
            className="px-4 py-3 md:px-6 md:py-4 rounded-2xl glass border border-white/50 shadow-lg 
                       hover:scale-110 transition-all duration-300 text-gray-500 hover:text-gray-800
                       flex items-center gap-2 md:gap-3 group w-fit"
          >
            <LogIn size={20} className="md:w-6 md:h-6 group-hover:text-emerald-500 transition-colors" />
            <span className="text-sm md:text-base font-semibold tracking-wide">Login</span>
          </button>
        )}
      </div>

      {/* Left Sidebar (Inset via fixed positioning) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -500, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -500, opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 150 }}
            className="fixed inset-0 md:inset-auto md:left-8 lg:left-12 md:top-8 lg:top-12 md:bottom-8 lg:bottom-12 z-[100] md:z-40 p-4 md:p-0"
          >
            {/* Mobile Overlay Backdrop */}
            <div
              className="absolute inset-0 bg-[#fdfaf7]/80 backdrop-blur-md md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
            <div className="relative h-full w-full md:w-auto">
              <CalendarSidebar
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                lastPeriodStart={cycleData?.lastPeriodStart}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area (Framed within safe boundaries) */}
      <motion.div
        layout
        className={`relative h-full transition-all duration-700 ease-in-out flex flex-col
                   ${isSidebarOpen ? 'md:pl-[450px] lg:pl-[500px] md:pr-12' : 'pl-0 md:pr-12'}
                   ${isTreeOpen ? 'blur-md scale-95 opacity-50' : ''}`}
      >
        {/* Vertical Distribution (Shifted slightly for balance) */}
        <div className="flex-grow flex flex-col justify-center items-center -mt-8">
          {/* Cycle Hub */}
          <div className="w-full mb-8">
            <CycleHub
              cycleData={cycleData}
              onUpdate={handleUpdateCycle}
              isEditing={isEditingCycle}
              setIsEditing={setIsEditingCycle}
            />
          </div>

          {/* Character Row */}
          <div className="relative z-10 w-full mt-2 overflow-x-auto custom-scrollbar pb-4 px-4">
            <div className="flex justify-start md:justify-center gap-6 md:gap-10 lg:gap-12 items-end min-w-max md:min-w-0 mx-auto">
              {phases.map((phase) => (
                <CharacterCard
                  key={phase.id}
                  phase={phase}
                  isActive={activePhaseId === phase.id}
                  showFeedback={feedbackPhaseId === phase.id}
                  onClick={() => handleOpenModal(phase)}
                  onPlusClick={() => handleOpenReflection(phase)}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modals & Overlays */}
      <PhaseModal
        phase={selectedPhase}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <ReflectionModal
        phase={selectedPhase}
        isOpen={isReflectionModalOpen}
        onClose={() => setIsReflectionModalOpen(false)}
        onSave={handleSaveReflection}
      />
      <ReflectionNetwork
        isOpen={isTreeOpen}
        onClose={() => setIsTreeOpen(false)}
        reflections={reflections}
        activePhaseId={activePhaseId}
      />
      <MonthlyWrapModal
        isOpen={isWrapOpen}
        onClose={() => setIsWrapOpen(false)}
        cycleData={cycleData}
        reflections={reflections}
      />
    </div>
  );
}

export default App;
