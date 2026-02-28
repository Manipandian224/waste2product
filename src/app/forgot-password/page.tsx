'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/shared/Navbar';
import { InputField } from '@/components/auth/auth-form-components';
import { Mail, ArrowLeft, Loader2, Sparkles, Recycle, Send } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const auth = useAuth();
  const { toast } = useToast();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;

    if (!email) {
      toast({
        variant: "destructive",
        title: "Email Required",
        description: "Please enter your registered email address.",
      });
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setIsSent(true);
      toast({
        title: "Reset Email Sent",
        description: "Check your inbox for further instructions.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Request Failed",
        description: error.message || "We couldn't find an account with that email.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F2027] overflow-hidden flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-6 relative">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] animate-pulse delay-700"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-md glass p-10 rounded-[40px] shadow-2xl space-y-8 relative overflow-hidden"
        >
          {/* Decorative Icon */}
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Recycle className="w-32 h-32 text-primary rotate-12" />
          </div>

          {!isSent ? (
            <>
              <div className="text-center space-y-3 relative">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold font-headline">Password Recovery</h2>
                <p className="text-muted-foreground text-sm">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-6">
                <InputField 
                  label="Email Address" 
                  icon={Mail} 
                  type="email" 
                  value={email} 
                  onChange={setEmail} 
                  placeholder="hero@waste2product.com"
                />

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-lg font-bold shadow-lg group relative overflow-hidden"
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      Send Reset Link
                      <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6 py-4"
            >
              <div className="mx-auto w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mb-2">
                <Send className="w-10 h-10 text-accent animate-bounce" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold font-headline text-accent">Check Your Email</h2>
                <p className="text-muted-foreground">
                  We've sent a recovery link to: <br />
                  <span className="text-foreground font-bold">{email}</span>
                </p>
              </div>
              <div className="pt-4 border-t border-white/5">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the email? Check your spam folder or
                </p>
                <button 
                  onClick={() => setIsSent(false)} 
                  className="text-primary font-bold hover:underline mt-1"
                >
                  try again
                </button>
              </div>
            </motion.div>
          )}

          <div className="pt-4 text-center">
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
