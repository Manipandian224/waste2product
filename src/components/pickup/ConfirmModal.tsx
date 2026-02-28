'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { CheckCircle2, Truck, Box, Clock, ArrowRight, Sparkles, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  slot: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, date, slot }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass border-primary/20 rounded-[48px] p-12 max-w-xl overflow-hidden selection:bg-primary/20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
        
        <div className="flex flex-col items-center text-center space-y-10">
          <motion.div 
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative"
          >
            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
              <CheckCircle2 className="w-16 h-16 text-primary" />
            </div>
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center"
            >
              <Sparkles className="w-6 h-6 text-accent" />
            </motion.div>
          </motion.div>

          <div className="space-y-3">
            <DialogTitle className="text-4xl font-black font-headline tracking-tight">Mission Confirmed</DialogTitle>
            <DialogDescription className="text-muted-foreground text-lg font-medium">
              Your eco-pickup is queued for collection. We're proud of your contribution!
            </DialogDescription>
          </div>

          <div className="w-full grid grid-cols-2 gap-6">
            <div className="bg-white/5 p-6 rounded-[32px] border border-white/5 text-left group hover:bg-white/10 transition-colors">
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-2 flex items-center gap-2">
                <Box className="w-3 h-3" /> Scheduled Date
              </p>
              <p className="text-base font-bold">{date}</p>
            </div>
            <div className="bg-white/5 p-6 rounded-[32px] border border-white/5 text-left group hover:bg-white/10 transition-colors">
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-2 flex items-center gap-2">
                <Clock className="w-3 h-3" /> Time Window
              </p>
              <p className="text-base font-bold">{slot}</p>
            </div>
          </div>

          <div className="w-full relative py-10 px-8 bg-white/5 rounded-[40px] border border-white/5 overflow-hidden">
             <div className="absolute top-1/2 left-8 right-8 h-[2px] bg-white/10 -translate-y-1/2" />
             <div className="relative flex justify-between">
              {[
                { icon: Box, label: 'Pending', active: true },
                { icon: Truck, label: 'Dispatch', active: false },
                { icon: MapPin, label: 'Arrival', active: false },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center gap-4 z-10">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${step.active ? 'bg-primary border-primary text-white shadow-[0_0_20px_rgba(0,200,150,0.4)] scale-110' : 'bg-[#192723] border-white/10 text-muted-foreground'}`}>
                    <step.icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${step.active ? 'text-primary' : 'text-muted-foreground/50'}`}>{step.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Button variant="ghost" className="flex-1 rounded-[24px] h-14 border border-white/10 text-muted-foreground hover:text-white" onClick={onClose}>
              Dismiss
            </Button>
            <Button className="flex-1 rounded-[24px] h-14 bg-primary hover:bg-primary/90 text-lg font-bold shadow-xl" onClick={onClose}>
                Track My Pickup <ArrowRight className="ml-3 w-5 h-5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
