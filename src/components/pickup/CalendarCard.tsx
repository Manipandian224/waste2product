'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar } from '@/components/ui/calendar';
import { ChevronRight, CalendarDays } from 'lucide-react';

interface CalendarCardProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
}

export const CalendarCard: React.FC<CalendarCardProps> = ({ selectedDate, onDateSelect }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-[400px] glass rounded-[2rem] animate-pulse" />;

  // Get start of today to correctly disable past dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="glass rounded-[2rem] p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-headline">Select Date</h2>
            <p className="text-xs text-muted-foreground font-medium">Available Monday – Friday</p>
          </div>
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-3 py-1 rounded-full">
          {new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date())}
        </span>
      </div>

      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          disabled={(date) => date < today || date.getDay() === 0 || date.getDay() === 6}
          className="rounded-2xl border-none"
          classNames={{
            selected: "bg-primary text-primary-foreground font-bold rounded-full scale-110 shadow-lg shadow-primary/20 hover:bg-primary",
            today: "text-primary font-bold border-b-2 border-primary rounded-none",
            day_button: "h-10 w-10 p-0 font-medium transition-all hover:bg-primary/10 hover:text-primary hover:rounded-full text-foreground",
            weekday: "text-muted-foreground font-bold text-[10px] uppercase tracking-widest pb-4 w-10",
          }}
        />
      </div>

      <AnimatePresence>
        {selectedDate && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="pt-6 border-t border-white/5 overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pick-up Date</p>
                <p className="font-bold text-foreground uppercase text-lg">
                  {new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).format(selectedDate)}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
