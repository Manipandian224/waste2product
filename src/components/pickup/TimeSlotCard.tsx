
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Zap, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const SLOTS = [
  { id: 's1', time: '09:00 AM – 11:00 AM', status: 'available' },
  { id: 's2', time: '11:00 AM – 01:00 PM', status: 'available' },
  { id: 's3', time: '02:00 PM – 04:00 PM', status: 'booked' },
  { id: 's4', time: '04:00 PM – 06:00 PM', status: 'available' },
];

interface TimeSlotCardProps {
  selectedSlot: string | null;
  onSlotSelect: (slot: string) => void;
  isVisible: boolean;
}

export const TimeSlotCard: React.FC<TimeSlotCardProps> = ({ selectedSlot, onSlotSelect, isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="h-full"
        >
          <Card className="glass border-none rounded-[40px] overflow-hidden shadow-2xl h-full">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-4 text-xl font-headline">
                <div className="w-10 h-10 rounded-xl bg-accent/20 text-accent flex items-center justify-center border border-accent/20">
                  <Clock className="w-5 h-5" />
                </div>
                Pickup Slots
              </CardTitle>
            </CardHeader>
            <div className="p-8 pt-0 space-y-4">
              {SLOTS.map((slot, i) => (
                <motion.button
                  key={slot.id}
                  disabled={slot.status === 'booked'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={slot.status === 'available' ? { scale: 1.02, x: 8 } : {}}
                  whileTap={slot.status === 'available' ? { scale: 0.98 } : {}}
                  onClick={() => onSlotSelect(slot.time)}
                  className={cn(
                    "w-full p-6 rounded-3xl text-left border transition-all relative overflow-hidden group",
                    selectedSlot === slot.time 
                      ? "bg-primary/20 border-primary text-primary shadow-[0_0_30px_rgba(0,200,150,0.3)]" 
                      : slot.status === 'booked'
                        ? "bg-white/5 border-white/5 opacity-40 cursor-not-allowed"
                        : "bg-white/5 border-white/5 hover:bg-white/10 text-muted-foreground hover:text-white"
                  )}
                >
                  <div className="flex justify-between items-center relative z-10">
                    <div className="flex items-center gap-4">
                      {selectedSlot === slot.time ? (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white">
                          <Check className="w-3.5 h-3.5 stroke-[4px]" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-white/10 group-hover:border-white/30 transition-colors" />
                      )}
                      <span className="font-bold text-sm tracking-tight">{slot.time}</span>
                    </div>
                    {slot.status === 'booked' && (
                      <span className="text-[10px] uppercase font-black px-3 py-1 bg-white/5 rounded-full opacity-60">Reserved</span>
                    )}
                  </div>
                  {selectedSlot === slot.time && (
                    <motion.div 
                      layoutId="slotGlow"
                      className="absolute inset-0 bg-primary/5 blur-2xl pointer-events-none"
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
