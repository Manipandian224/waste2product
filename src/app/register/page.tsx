'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/shared/Navbar';
import { InputField, SocialButton } from '@/components/auth/auth-form-components';
import { Mail, Lock, User as UserIcon, ArrowRight, Recycle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { signInWithGoogle, syncUserProfile } from '@/firebase/auth/auth-service';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const auth = useAuth();
  const firestore = useFirestore();
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !firestore) return;

    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      await syncUserProfile(firestore, result.user, { name });
      
      toast({
        title: "Account created!",
        description: `Welcome to the community, ${name}!`,
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!auth || !firestore) return;
    setLoading(true);
    try {
      await signInWithGoogle(auth, firestore);
      toast({
        title: "Welcome to the community!",
        description: "Redirecting to your dashboard.",
      });
      router.push('/dashboard');
    } catch (error: any) {
      // Ignore errors if the user simply closes the popup
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        setLoading(false);
        return;
      }
      toast({
        variant: "destructive",
        title: "Google Sign-In Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F2027] overflow-hidden flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col lg:flex-row-reverse">
        {/* Left Side (Desktop right): Animated Branding */}
        <section className="hidden lg:flex flex-1 relative items-center justify-center p-20 bg-gradient-to-br from-[#0F2027] via-[#203A43] to-[#0F2027]">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 space-y-8 max-w-lg text-right"
          >
            <div className="bg-accent/20 w-20 h-20 rounded-3xl flex items-center justify-center backdrop-blur-xl border border-accent/30 ml-auto">
              <Recycle className="w-10 h-10 text-accent" />
            </div>
            <div className="space-y-4">
              <h1 className="text-6xl font-black font-headline leading-tight">
                Start Your <br />
                <span className="text-accent italic">Eco Journey</span>
              </h1>
              <p className="text-xl text-muted-foreground/80 leading-relaxed">
                Connect with local recyclers, track your carbon footprint, and earn rewards for saving the planet.
              </p>
            </div>
            
            <div className="flex justify-end gap-6 pt-10">
              <div className="glass p-6 rounded-3xl space-y-2 w-40 text-left">
                <p className="text-2xl font-bold">100%</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Circular</p>
              </div>
              <div className="glass p-6 rounded-3xl space-y-2 w-40 text-left">
                <p className="text-2xl font-bold">Madurai</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Hub Location</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Right Side (Desktop left): Registration Card */}
        <section className="flex-1 flex items-center justify-center p-6 relative">
          <div className="lg:hidden absolute inset-0 bg-gradient-to-br from-[#0F2027] via-[#203A43] to-[#0F2027] -z-10"></div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md glass p-10 rounded-[40px] shadow-2xl space-y-8"
          >
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold font-headline">Join the Revolution</h2>
              <p className="text-muted-foreground">Sign up to start recycling today</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              <InputField 
                label="Full Name" 
                icon={UserIcon} 
                value={name} 
                onChange={setName} 
                placeholder="John Doe"
              />
              <InputField 
                label="Email Address" 
                icon={Mail} 
                type="email" 
                value={email} 
                onChange={setEmail} 
                placeholder="john@example.com"
              />
              <InputField 
                label="Password" 
                icon={Lock} 
                type="password" 
                value={password} 
                onChange={setPassword} 
                placeholder="••••••••"
              />

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-lg font-bold shadow-lg group"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            <div className="relative flex items-center gap-4 text-muted-foreground py-2">
              <div className="flex-1 h-px bg-white/10"></div>
              <span className="text-[10px] uppercase font-black tracking-widest">Or sign up with</span>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>

            <SocialButton onClick={handleGoogleLogin} loading={loading} />

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-primary font-bold hover:underline" suppressHydrationWarning>
                Sign In
              </Link>
            </p>
          </motion.div>
        </section>
      </main>
    </div>
  );
}