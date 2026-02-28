
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StatusStepper } from './StatusStepper';
import { RecyclerCard } from './RecyclerCard';
import { AnimatedRoute } from './AnimatedRoute';
import { MapPin, ArrowLeft, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PickupStatus } from '@/app/pickup/page';

interface TrackingCardProps {
  pickup: any;
  onBack: () => void;
}

export const TrackingCard: React.FC<TrackingCardProps> = ({ pickup, onBack }) => {
  const isCompleted = pickup.status === 'Collected';

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary font-bold text-sm transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          Dashboard
        </button>
        <div className="px-4 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
          {isCompleted ? 'Collection Complete' : 'Live Tracking'}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Section: Status & Simulation */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass rounded-[2.5rem] p-10 space-y-10 border-white/5 shadow-2xl overflow-hidden relative">
            <AnimatePresence mode="wait">
              {isCompleted ? (
                <motion.div 
                  key="completed"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-12 space-y-6"
                >
                  <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center border-4 border-primary">
                    <CheckCircle2 className="w-12 h-12 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black font-headline">Collection Successful</h2>
                    <p className="text-muted-foreground max-w-xs mx-auto">Your eco-contribution has been verified and credits have been issued to your wallet.</p>
                  </div>
                  <Button onClick={onBack} className="rounded-full px-8 bg-primary">Return to Home</Button>
                </motion.div>
              ) : (
                <motion.div key="tracking-content" className="space-y-10">
                  <header className="space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h2 className="text-3xl font-black font-headline tracking-tight">Eco-Tracker</h2>
                        <p className="text-muted-foreground font-medium flex items-center gap-2 text-sm">
                          <ShieldCheck className="w-4 h-4 text-primary" /> 
                          Real-time logistics monitoring
                        </p>
                      </div>
                      <div className="text-right glass p-4 rounded-2xl border-white/5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Arrival Window</p>
                        <p className="font-bold text-primary">{pickup.timeSlot}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-5 bg-white/5 rounded-2xl border border-white/5">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Destination</p>
                        <p className="text-sm font-bold text-foreground leading-tight">{pickup.address}</p>
                      </div>
                    </div>
                  </header>

                  <AnimatedRoute status={pickup.status} />

                  <RecyclerCard status={pickup.status} pickup={pickup} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Section: Progress Steps */}
        <div className="lg:col-span-5">
          <div className="glass rounded-[2.5rem] p-10 border-white/5 space-y-8">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
               <Sparkles className="w-3 h-3 text-primary" /> Logistics Journey
            </div>
            <StatusStepper currentStatus={pickup.status} />
          </div>
        </div>
      </div>
    </div>
  );
};
