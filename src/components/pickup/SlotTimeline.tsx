'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Clock, Check } from 'lucide-react';

const SLOTS = [
  { id: '1', time: '09:00 – 11:00 AM', status: 'available' },
  { id: '2', time: '11:00 – 01:00 PM', status: 'available' },
  { id: '3', time: '02:00 – 04:00 PM', status: 'booked' },
  { id: '4', time: '04:00 – 06:00 PM', status: 'available' },
];

interface SlotTimelineProps {
  selectedSlot: string | null;
  onSlotSelect: (slot: string) => void;
}

export const SlotTimeline: React.FC<SlotTimelineProps> = ({ selectedSlot, onSlotSelect }) => {
  return (
    <div className="glass rounded-[2rem] p-8 space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold font-headline">Time Window</h2>
          <p className="text-xs text-muted-foreground font-medium">Estimated arrival window</p>
        </div>
      </div>

      <div className="space-y-3">
        {SLOTS.map((slot, i) => (
          <motion.button
            key={slot.id}
            disabled={slot.status === 'booked'}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            whileTap={slot.status === 'available' ? { scale: 0.98 } : {}}
            onClick={() => onSlotSelect(slot.time)}
            className={cn(
              "w-full p-6 rounded-3xl text-left transition-all border relative flex items-center justify-between group",
              selectedSlot === slot.time 
                ? "bg-primary/20 border-primary shadow-lg shadow-primary/10" 
                : slot.status === 'booked'
                  ? "bg-white/5 border-transparent opacity-40 cursor-not-allowed"
                  : "bg-white/5 border-white/5 hover:border-primary/20 hover:bg-white/10"
            )}
          >
            {selectedSlot === slot.time && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-primary rounded-r-full" />
            )}
            
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                selectedSlot === slot.time ? "bg-primary border-primary" : "border-white/20 group-hover:border-primary/30"
              )}>
                {selectedSlot === slot.time && <Check className="w-3 h-3 text-white stroke-[4px]" />}
              </div>
              <span className={cn(
                "font-bold text-sm tracking-tight transition-colors",
                selectedSlot === slot.time ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
              )}>
                {slot.time}
              </span>
            </div>

            {slot.status === 'booked' && (
              <span className="text-[10px] uppercase font-black px-3 py-1 bg-white/5 text-muted-foreground rounded-full">Booked</span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
