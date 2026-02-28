
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Home, Sparkles } from 'lucide-react';
import { PickupStatus } from '@/app/pickup/page';

export const AnimatedRoute: React.FC<{ status: PickupStatus }> = ({ status }) => {
  // Map status to a percentage of the route completed
  const statusMap: Record<PickupStatus, number> = {
    'Confirmed': 0,
    'Assigned': 15,
    'On The Way': 50,
    'Arriving Soon': 85,
    'Collected': 100,
  };

  const progress = statusMap[status] || 0;

  return (
    <div className="relative py-12 px-4">
      <div className="absolute inset-0 bg-primary/5 rounded-[2rem] -z-10" />
      
      {/* Route Path Line */}
      <div className="relative h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          className="absolute left-0 top-0 h-full bg-primary"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        {/* Dotted indicator */}
        <div className="absolute inset-0 border-t-2 border-dashed border-white/10" />
      </div>

      {/* Origin Point */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2">
        <div className="w-3 h-3 rounded-full bg-white/20 border-2 border-background" />
      </div>

      {/* Recycler Vehicle */}
      <motion.div 
        className="absolute top-1/2 -translate-y-1/2 -ml-6"
        initial={{ left: '0%' }}
        animate={{ left: `${progress}%` }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
        <div className="relative">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 bg-primary/30 blur-xl rounded-full"
          />
          <div className="bg-primary p-3 rounded-2xl shadow-xl shadow-primary/40 relative">
            <Truck className="w-6 h-6 text-white" />
          </div>
          {status !== 'Collected' && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-background/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[8px] font-black uppercase tracking-widest animate-bounce">
              {status}
            </div>
          )}
        </div>
      </motion.div>

      {/* Destination Home */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
        <div className="relative">
          <div className={`p-4 rounded-3xl border-2 transition-all duration-700 ${progress === 100 ? 'bg-primary border-primary shadow-2xl' : 'bg-[#192723] border-white/10'}`}>
            <Home className={`w-6 h-6 ${progress === 100 ? 'text-white' : 'text-muted-foreground'}`} />
          </div>
          {progress === 100 && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-4 -right-4 bg-accent p-1.5 rounded-full shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
