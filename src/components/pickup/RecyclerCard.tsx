'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Truck, Phone, Sparkles, MessageCircle, ShieldCheck } from 'lucide-react';
import { PickupStatus } from '@/app/pickup/page';
import { Button } from '@/components/ui/button';

interface RecyclerCardProps {
  status: PickupStatus;
  pickup: any;
}

export const RecyclerCard: React.FC<RecyclerCardProps> = ({ status, pickup }) => {
  const [eta, setEta] = useState(pickup.eta || 12);

  useEffect(() => {
    if (status === 'On The Way' || status === 'Arriving Soon') {
      const timer = setInterval(() => {
        setEta(prev => Math.max(1, prev - 1));
      }, 15000); // Faster simulation for demo
      return () => clearInterval(timer);
    }
  }, [status]);

  const isAssigned = status !== 'Confirmed';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
        <Sparkles className="w-3 h-3 text-primary" /> Recycler Details
      </div>

      <div className="p-6 glass-darker rounded-[2rem] border border-white/5 space-y-6">
        <AnimatePresence mode="wait">
          {!isAssigned ? (
            <motion.div 
              key="waiting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-6 space-y-4"
            >
              <div className="w-16 h-16 rounded-3xl bg-white/5 animate-pulse flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white/20 animate-spin" />
              </div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] animate-pulse">Searching for nearby recycler...</p>
            </motion.div>
          ) : (
            <motion.div 
              key="assigned"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-[2rem] bg-primary/20 flex items-center justify-center border-2 border-primary/30 shadow-2xl overflow-hidden">
                       <User className="w-8 h-8 text-primary" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-accent rounded-full border-2 border-background flex items-center justify-center">
                      <ShieldCheck className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-foreground">Arjun Kumar</h4>
                    <div className="flex items-center gap-2">
                      <div className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest">
                        {pickup.vehicleType}
                      </div>
                      <div className="flex items-center gap-1 text-[8px] font-bold text-muted-foreground uppercase">
                        <Truck className="w-3 h-3" /> TN-64-EA-2024
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary">Arrival In</p>
                  <div className="flex items-baseline justify-end gap-1">
                    <motion.span 
                      key={eta}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-3xl font-black font-headline text-foreground"
                    >
                      {status === 'Collected' ? '0' : eta}
                    </motion.span>
                    <span className="text-xs font-bold text-muted-foreground">min</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="rounded-2xl h-14 border-white/5 bg-white/5 hover:bg-white/10 flex items-center gap-2 font-bold text-sm">
                  <MessageCircle className="w-4 h-4 text-primary" />
                  Message
                </Button>
                <Button className="rounded-2xl h-14 bg-primary hover:bg-primary/90 flex items-center gap-2 font-bold text-sm">
                  <Phone className="w-4 h-4" />
                  Call Now
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const Loader2 = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);