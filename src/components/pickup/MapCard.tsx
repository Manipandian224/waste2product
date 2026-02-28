
'use client';

import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { MapPin, Navigation, Loader2, AlertTriangle, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const darkMapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#0d1b18" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#0d1b18" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#00C896" }] },
  { "feature": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#ffffff" }] },
  { "feature": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#00C896" }] },
  { "feature": "road", "elementType": "geometry", "stylers": [{ "color": "#192723" }] },
  { "feature": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#2c5364" }] },
  { "feature": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#ffffff" }] },
  { "feature": "water", "elementType": "geometry", "stylers": [{ "color": "#0f2027" }] }
];

interface MapCardProps {
  location: { lat: number; lng: number };
  address: string;
}

export const MapCard: React.FC<MapCardProps> = ({ location, address }) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey || ''
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-2xl font-black font-headline flex items-center gap-3">
            <Navigation className="w-6 h-6 text-primary" />
            Live Tracker
          </h3>
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Satellite Navigation System</p>
        </div>
        <Badge className="bg-primary text-white border-none px-4 py-1.5 rounded-full font-black text-[10px] tracking-widest animate-pulse">
          MADURAI HUB • ONLINE
        </Badge>
      </div>

      <Card className="glass rounded-[48px] overflow-hidden aspect-square border-none relative shadow-2xl group border border-white/5">
        {loadError || !apiKey ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/50 p-12 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-destructive" />
            </div>
            <div className="space-y-3">
              <h4 className="font-black text-xl font-headline">Navigation Offline</h4>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                Maps API is not configured. Please enable the Maps JavaScript API in your Cloud Console.
              </p>
            </div>
          </div>
        ) : !isLoaded ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#192723]">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-6" />
            <div className="text-center">
              <p className="text-sm font-black text-primary uppercase tracking-[0.3em] animate-pulse">Initializing Link</p>
              <p className="text-[10px] text-white/40 font-bold uppercase mt-2">Connecting to eco-grid...</p>
            </div>
          </div>
        ) : (
          <>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={location}
              zoom={15}
              options={{
                styles: darkMapStyle,
                disableDefaultUI: true,
                zoomControl: false,
                gestureHandling: 'cooperative'
              }}
            >
              <Marker 
                position={location} 
                icon={{
                  path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
                  fillColor: '#00C896',
                  fillOpacity: 1,
                  strokeWeight: 4,
                  strokeColor: '#FFFFFF',
                  scale: 2.2,
                  anchor: new google.maps.Point(12, 22),
                }}
              />
            </GoogleMap>
            
            {/* Pulsing Marker Overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[22px] pointer-events-none">
              <div className="w-16 h-16 rounded-full bg-primary/20 animate-ping opacity-40" />
            </div>
          </>
        )}
        
        <div className="absolute bottom-8 left-8 right-8">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass p-6 rounded-[32px] border-white/10 shadow-3xl backdrop-blur-3xl group-hover:bg-white/10 transition-colors"
          >
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30">
                <MapPin className="text-primary w-7 h-7" />
              </div>
              <div className="space-y-2">
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black flex items-center gap-2">
                  <Sparkles className="w-3 h-3" /> Pickup Address
                </p>
                <p className="text-base font-bold leading-tight line-clamp-2">{address || "Set destination address..."}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};
