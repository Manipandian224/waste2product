'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/shared/Navbar';
import { Button } from '@/components/ui/button';
import { CalendarCard } from '@/components/pickup/CalendarCard';
import { SlotTimeline } from '@/components/pickup/SlotTimeline';
import { TrackingCard } from '@/components/pickup/TrackingCard';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { collection, doc, updateDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowRight, MapPin, Edit2, Sparkles, CheckCircle2, Truck } from 'lucide-react';
import { ConfirmModal } from '@/components/pickup/ConfirmModal';

export type PickupStatus = 'Confirmed' | 'Assigned' | 'On The Way' | 'Arriving Soon' | 'Collected';

export default function PickupPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [activePickupId, setActivePickupId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [address] = useState("Eco Tower, Madurai, TN 625001");

  // Fetch active pickup if it exists - memoized to prevent infinite loops
  const pickupRef = useMemoFirebase(() => {
    if (!db || !activePickupId) return null;
    return doc(db, 'pickups', activePickupId);
  }, [db, activePickupId]);

  const { data: pickupData } = useDoc(pickupRef);

  // Simulation Logic: Updates Firestore status over time
  useEffect(() => {
    if (!activePickupId || !db || !pickupData) return;

    const stages: { status: PickupStatus; delay: number }[] = [
      { status: 'Assigned', delay: 4000 },
      { status: 'On The Way', delay: 10000 },
      { status: 'Arriving Soon', delay: 20000 },
      { status: 'Collected', delay: 30000 },
    ];

    const currentStageIndex = stages.findIndex(s => s.status === pickupData.status);
    const nextStage = stages[currentStageIndex + 1];

    if (nextStage && pickupData.status !== 'Collected') {
      const timer = setTimeout(() => {
        const ref = doc(db, 'pickups', activePickupId);
        updateDoc(ref, { 
          status: nextStage.status,
          updatedAt: serverTimestamp() 
        });
      }, nextStage.delay - (currentStageIndex >= 0 ? stages[currentStageIndex].delay : 0));

      return () => clearTimeout(timer);
    }
  }, [activePickupId, pickupData?.status, db]);

  const handleConfirm = async () => {
    if (!selectedDate || !selectedSlot) {
      toast({
        variant: "destructive",
        title: "Selection Required",
        description: "Please pick a date and time slot first.",
      });
      return;
    }

    if (!user || !db) return;

    setIsBooking(true);
    
    const pickupId = `pickup_${Date.now()}`;
    const newPickup = {
      userId: user.uid,
      date: selectedDate.toISOString().split('T')[0],
      timeSlot: selectedSlot,
      address: address,
      status: "Confirmed",
      recyclerName: "Arjun Kumar",
      vehicleType: "Electric Van",
      eta: 12,
      createdAt: serverTimestamp(),
    };

    try {
      const docRef = doc(db, 'pickups', pickupId);
      await setDoc(docRef, newPickup);
      
      // Delay slightly for effect before showing modal/tracking
      setTimeout(() => {
        setIsBooking(false);
        setActivePickupId(pickupId); // Switch to Tracking UI
        setShowConfirmModal(true); // Show success celebration
      }, 800);
      
    } catch (e: any) {
      setIsBooking(false);
      toast({
        variant: "destructive",
        title: "Booking Error",
        description: "Could not schedule pickup. Please check permissions.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20">
        <AnimatePresence mode="wait">
          {!activePickupId ? (
            <motion.div 
              key="booking"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="grid lg:grid-cols-2 gap-10 items-start"
            >
              <div className="space-y-8">
                <header className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                    <Sparkles className="w-3 h-3" /> Mission Setup
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">
                    Schedule <br/><span className="text-primary italic">Pickup</span>
                  </h1>
                  <p className="text-muted-foreground font-medium max-w-sm">
                    Plan your recycling collection window. Our eco-fleet is ready for deployment.
                  </p>
                </header>

                <CalendarCard 
                  selectedDate={selectedDate} 
                  onDateSelect={setSelectedDate} 
                />

                <div className="glass p-8 rounded-[2rem] space-y-4 border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Logistics Target</p>
                        <p className="font-bold text-sm text-foreground">{address}</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-muted-foreground hover:text-primary">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-8 lg:sticky lg:top-32">
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-widest">
                  <Sparkles className="w-3 h-3" /> Time Window
                </div>
                
                <SlotTimeline 
                  selectedSlot={selectedSlot} 
                  onSlotSelect={setSelectedSlot} 
                />

                <div className="pt-4">
                  <Button 
                    onClick={handleConfirm}
                    disabled={isBooking || !selectedSlot || !selectedDate}
                    className="w-full h-24 rounded-[2.5rem] bg-primary hover:bg-primary/90 text-white text-xl font-bold shadow-2xl shadow-primary/20 group relative overflow-hidden transition-all active:scale-95 disabled:opacity-50"
                  >
                    <AnimatePresence mode="wait">
                      {isBooking ? (
                        <motion.div 
                          key="loading"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-3"
                        >
                          <Loader2 className="w-6 h-6 animate-spin" />
                          <span>Initiating Drone...</span>
                        </motion.div>
                      ) : (
                        <motion.div 
                          key="idle"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-3"
                        >
                          <CheckCircle2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
                          <span>Confirm Collection</span>
                          <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="tracking"
              initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              className="max-w-5xl mx-auto"
            >
              {pickupData && (
                <TrackingCard 
                  pickup={pickupData}
                  onBack={() => setActivePickupId(null)}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <ConfirmModal 
          isOpen={showConfirmModal} 
          onClose={() => setShowConfirmModal(false)}
          date={selectedDate?.toDateString() || ""}
          slot={selectedSlot || ""}
        />
      </main>
    </div>
  );
}
