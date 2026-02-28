'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/shared/Navbar';
import { InputField, SocialButton } from '@/components/auth/auth-form-components';
import { Mail, Lock, LogIn, Recycle, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { signInWithGoogle, syncUserProfile } from '@/firebase/auth/auth-service';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
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

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !firestore) return;

    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await syncUserProfile(firestore, result.user);
      toast({
        title: "Welcome back!",
        description: "Logged in successfully to Waste2Product.",
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "Please check your credentials.",
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
        title: "Welcome back!",
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
      
      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Left Side: Animated Branding */}
        <section className="hidden lg:flex flex-1 relative items-center justify-center p-20 bg-gradient-to-br from-[#0F2027] via-[#203A43] to-[#0F2027]">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 space-y-8 max-w-lg"
          >
            <div className="bg-primary/20 w-20 h-20 rounded-3xl flex items-center justify-center backdrop-blur-xl border border-primary/30">
              <Recycle className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-4">
              <h1 className="text-6xl font-black font-headline leading-tight">
                Turn Waste <br />
                <span className="text-primary italic">Into Wealth</span>
              </h1>
              <p className="text-xl text-muted-foreground/80 leading-relaxed">
                Join the largest AI-driven circular economy. Upload waste, earn credits, and shop sustainable.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 pt-10">
              <div className="glass p-6 rounded-3xl space-y-2">
                <Sparkles className="text-accent w-6 h-6" />
                <p className="text-2xl font-bold">12.4T</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">CO2 Saved</p>
              </div>
              <div className="glass p-6 rounded-3xl space-y-2">
                <LogIn className="text-primary w-6 h-6" />
                <p className="text-2xl font-bold">45k+</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Eco Heroes</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Right Side: Login Card */}
        <section className="flex-1 flex items-center justify-center p-6 relative">
          <div className="lg:hidden absolute inset-0 bg-gradient-to-br from-[#0F2027] via-[#203A43] to-[#0F2027] -z-10"></div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md glass p-10 rounded-[40px] shadow-2xl space-y-10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Recycle className="w-32 h-32 text-primary rotate-12" />
            </div>

            <div className="text-center space-y-2 relative">
              <h2 className="text-3xl font-bold font-headline">Welcome Back</h2>
              <p className="text-muted-foreground">Log in to your Eco-Hero account</p>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-6">
              <InputField 
                label="Email Address" 
                icon={Mail} 
                type="email" 
                value={email} 
                onChange={setEmail} 
                placeholder="name@example.com"
              />
              <div className="space-y-2">
                <InputField 
                  label="Password" 
                  icon={Lock} 
                  type="password" 
                  value={password} 
                  onChange={setPassword} 
                  placeholder="••••••••"
                />
                <div className="flex justify-end">
                  <Link href="/forgot-password" size="sm" className="text-xs text-primary font-bold hover:underline transition-all" suppressHydrationWarning>
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-lg font-bold shadow-[0_8px_30px_rgb(0,200,150,0.3)] group relative overflow-hidden"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            <div className="relative flex items-center gap-4 text-muted-foreground py-2">
              <div className="flex-1 h-px bg-white/10"></div>
              <span className="text-[10px] uppercase font-black tracking-widest">Or continue with</span>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>

            <SocialButton onClick={handleGoogleLogin} loading={loading} />

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/register" className="text-primary font-bold hover:underline" suppressHydrationWarning>
                Create Account
              </Link>
            </p>
          </motion.div>
        </section>
      </main>
    </div>
  );
}