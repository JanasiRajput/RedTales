import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CalendarGrid from './CalendarGrid';
import InsightBox from './InsightBox';

const CalendarSidebar = ({ selectedDate, onDateSelect, lastPeriodStart }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <div
      className="h-full w-full md:w-[400px] lg:w-[440px]
                 p-6 md:p-10 pt-16 flex flex-col glass rounded-[3rem] border-2 border-white/40 shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 md:mb-10">
        <h2 className="text-3xl font-tales text-gray-700 font-medium lowercase tracking-wide">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-3">
          <button 
            onClick={prevMonth}
            className="p-3 rounded-full hover:bg-white/50 transition-colors text-gray-400 hover:text-gray-600"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={nextMonth}
            className="p-3 rounded-full hover:bg-white/50 transition-colors text-gray-400 hover:text-gray-600"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <CalendarGrid 
        currentMonth={currentMonth} 
        selectedDate={selectedDate}
        onDateSelect={onDateSelect}
        lastPeriodStart={lastPeriodStart}
      />

      {/* Insight Box */}
      <div className="mt-8">
        <InsightBox date={selectedDate} lastPeriodStart={lastPeriodStart} />
      </div>

      {/* Subtle Legend */}
      <div className="mt-8 flex justify-between px-2">
         {['menstrual', 'follicular', 'ovulation', 'luteal'].map(p => (
           <div key={p} className="flex items-center gap-2.5">
             <div className={`w-3 h-3 rounded-full shadow-sm
               ${p === 'menstrual' ? 'bg-rose-300' : 
                 p === 'follicular' ? 'bg-orange-300' : 
                 p === 'ovulation' ? 'bg-amber-300' : 'bg-indigo-300'}`} 
             />
             <span className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">
               {p.slice(0, 3)}
             </span>
           </div>
         ))}
      </div>
    </div>
  );
};

export default CalendarSidebar;
