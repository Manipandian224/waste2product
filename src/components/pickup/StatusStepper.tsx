
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, Truck, ShieldCheck, Box, PackageCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PickupStatus } from '@/app/pickup/page';

const STEPS: { id: PickupStatus; label: string; icon: any }[] = [
  { id: 'Confirmed', label: 'Collection Confirmed', icon: ShieldCheck },
  { id: 'Assigned', label: 'Recycler Assigned', icon: Box },
  { id: 'On The Way', label: 'On The Way', icon: Truck },
  { id: 'Arriving Soon', label: 'Arriving Soon', icon: Clock },
  { id: 'Collected', label: 'Collected', icon: PackageCheck },
];

export const StatusStepper: React.FC<{ currentStatus: PickupStatus }> = ({ currentStatus }) => {
  const activeIndex = STEPS.findIndex(s => s.id === currentStatus);

  return (
    <div className="space-y-8 relative pl-2">
      <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-white/5" />
      <motion.div 
        initial={{ height: 0 }}
        animate={{ height: `${(activeIndex / (STEPS.length - 1)) * 100}%` }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="absolute left-[19px] top-4 w-0.5 bg-primary z-10 origin-top"
      />

      {STEPS.map((step, i) => {
        const isPast = i < activeIndex;
        const isCurrent = i === activeIndex;
        const isActive = isPast || isCurrent;

        return (
          <div key={step.id} className="flex items-center gap-6 relative z-20 group">
            <div className={cn(
              "w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-700 border-2",
              isActive 
                ? "bg-primary border-primary shadow-[0_0_20px_rgba(0,200,150,0.4)]" 
                : "bg-[#192723] border-white/10"
            )}>
              {isPast ? (
                <Check className="w-5 h-5 text-white stroke-[4px]" />
              ) : isCurrent ? (
                <step.icon className="w-5 h-5 text-white animate-pulse" />
              ) : (
                <step.icon className="w-5 h-5 text-white/10" />
              )}
              
              {isCurrent && (
                <motion.div 
                  layoutId="pulse-stepper"
                  className="absolute inset-0 bg-primary rounded-2xl animate-ping opacity-20"
                />
              )}
            </div>
            <div className="flex flex-col">
              <span className={cn(
                "font-bold text-sm tracking-tight transition-colors duration-700",
                isActive ? "text-foreground" : "text-muted-foreground/20"
              )}>
                {step.label}
              </span>
              {isCurrent && (
                <span className="text-[10px] text-primary font-black uppercase tracking-widest animate-in fade-in slide-in-from-left-2">
                  Live Update
                </span>
              )}
              {isPast && (
                <span className="text-[8px] text-muted-foreground/40 font-bold uppercase tracking-widest">
                  Completed
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
