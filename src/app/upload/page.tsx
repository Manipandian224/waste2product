"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/shared/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Upload, Camera, Trash2, Calculator, CheckCircle2, AlertCircle, Loader2, Zap, ArrowRight, Sparkles, TrendingUp, Info } from 'lucide-react';
import { aiWasteAnalyzerAndCreditCalculator, type AiWasteAnalyzerOutput } from '@/ai/flows/ai-waste-analyzer-and-credit-calculator';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const WASTE_RATES: Record<string, number> = {
  'Paper': 12,
  'Plastic': 10,
  'Metal': 25,
  'E-waste': 30
};

export default function UploadPage() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [category, setCategory] = useState<string>('Paper');
  const [weight, setWeight] = useState<string>('1.0');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AiWasteAnalyzerOutput | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    const weightVal = parseFloat(weight);
    if (!preview || isNaN(weightVal) || weightVal <= 0) {
      toast({
        variant: "destructive",
        title: "Input Required",
        description: "Please capture an image and enter a valid weight before verifying.",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const output = await aiWasteAnalyzerAndCreditCalculator({
        photoDataUri: preview,
        selectedCategory: category as any,
        weightKg: weightVal
      });
      setResult(output);
      toast({
        title: "Analysis Complete",
        description: `Your ${output.wasteType} has been analyzed. You earned ${Math.round(output.greenCredits)} credits!`,
      });
    } catch (error: any) {
      console.error("Analysis error:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error.message || "There was an error analyzing your waste. Please try again with a clearer photo.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const estimatedCredits = result ? Math.round(result.greenCredits) : Math.round(WASTE_RATES[category] * parseFloat(weight || '0'));

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-24">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Upload Form */}
          <div className="lg:col-span-7 space-y-12">
            <header className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                <Sparkles className="w-3.5 h-3.5" />
                AI Vision Verification
              </div>
              <h1 className="text-5xl md:text-7xl font-black font-headline leading-[1.1] tracking-tight">
                Upload <br />
                <span className="text-primary italic">Recyclables</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-lg leading-relaxed font-medium">
                Our neural network classifies your waste in real-time, assessing quality and calculating exact green credit rewards.
              </p>
            </header>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div 
                className={`relative h-80 md:h-[450px] border-2 border-dashed rounded-[40px] flex flex-col items-center justify-center transition-all duration-500 overflow-hidden group ${preview ? 'border-primary/40 bg-primary/5' : 'border-white/10 hover:border-primary/30 hover:bg-white/5'}`}
              >
                {preview ? (
                  <div className="relative w-full h-full p-4 animate-in zoom-in duration-500">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-[32px] shadow-2xl" />
                    <button 
                      onClick={() => { setFile(null); setPreview(null); setResult(null); }}
                      className="absolute top-8 right-8 p-3 bg-destructive/90 backdrop-blur-md text-white rounded-2xl hover:scale-110 transition-all hover:rotate-6 active:scale-95"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-12 text-center space-y-6">
                    <div className="w-24 h-24 rounded-[32px] bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-primary/20 shadow-[0_0_50px_rgba(0,200,150,0.1)]">
                      <Camera className="w-10 h-10 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-bold font-headline">Capture or Drop Waste</p>
                      <p className="text-sm text-muted-foreground font-medium max-w-[240px]">High-resolution photos increase accuracy of AI credit calculation.</p>
                    </div>
                    <Badge variant="outline" className="px-4 py-1.5 rounded-full border-white/10 text-[10px] uppercase tracking-widest font-black">
                      JPG • PNG • MAX 5MB
                    </Badge>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={onFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-[10px] uppercase tracking-[0.3em] font-black text-muted-foreground ml-1">Waste Category</Label>
                  <Select value={category} onValueChange={(val) => { setCategory(val); setResult(null); }}>
                    <SelectTrigger className="h-16 rounded-2xl border-white/10 glass px-6 text-lg font-medium focus:ring-primary/20 transition-all">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/10 rounded-2xl">
                      <SelectItem value="Paper" className="h-12 focus:bg-primary/20 rounded-xl">Paper</SelectItem>
                      <SelectItem value="Plastic" className="h-12 focus:bg-primary/20 rounded-xl">Plastic</SelectItem>
                      <SelectItem value="Metal" className="h-12 focus:bg-primary/20 rounded-xl">Metal</SelectItem>
                      <SelectItem value="E-waste" className="h-12 focus:bg-primary/20 rounded-xl">E-waste</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] uppercase tracking-[0.3em] font-black text-muted-foreground ml-1">Quantity (kg)</Label>
                  <div className="relative group">
                    <Input 
                      type="number" 
                      step="0.1" 
                      value={weight} 
                      onChange={(e) => { setWeight(e.target.value); setResult(null); }}
                      className="h-16 rounded-2xl border-white/10 glass px-6 text-lg font-medium focus:ring-primary/20 transition-all placeholder:text-white/20" 
                      placeholder="0.0"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-[10px] text-primary tracking-widest uppercase">KILOGRAMS</div>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleUpload} 
                disabled={!preview || isAnalyzing}
                className="w-full h-20 rounded-[32px] bg-primary hover:bg-primary/90 text-2xl font-bold shadow-[0_20px_50px_rgba(0,200,150,0.3)] group relative overflow-hidden transition-all hover:-translate-y-2 active:scale-95 disabled:opacity-50 disabled:translate-y-0"
              >
                {isAnalyzing ? (
                  <div className="flex items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span className="animate-pulse">Neural Processing...</span>
                  </div>
                ) : (
                  <span className="flex items-center gap-4">
                    Verify & Calculate Credits
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform" />
                  </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Button>
            </motion.div>
          </div>

          {/* Right Column: AI Results & Calculator */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-32">
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass-darker border-none rounded-[48px] overflow-hidden shadow-3xl relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
                
                <CardHeader className="p-10 pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl font-black font-headline flex items-center gap-3">
                        <TrendingUp className="w-6 h-6 text-primary" />
                        Credit Engine
                      </CardTitle>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mt-1">Real-time market estimation</p>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-primary/20 font-black text-[10px] px-3 py-1">LIVE</Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-10 space-y-10">
                  <div className="relative py-12 px-8 bg-white/5 rounded-[40px] border border-white/5 overflow-hidden group">
                    <div className="absolute -right-8 -bottom-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                      <Zap className="w-48 h-48 rotate-12" />
                    </div>
                    
                    <div className="flex flex-col items-center text-center space-y-2">
                      <p className="text-[10px] text-primary font-black uppercase tracking-[0.4em]">Projected Reward</p>
                      <div className="flex items-center justify-center gap-4">
                        <Zap className="w-8 h-8 text-primary fill-current" />
                        <span className="text-8xl font-black font-headline tracking-tighter animate-in zoom-in duration-500" key={estimatedCredits}>
                          {estimatedCredits}
                        </span>
                      </div>
                      <p className="text-muted-foreground font-medium text-sm">Green Credits</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 rounded-[32px] bg-white/5 border border-white/5 space-y-2">
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Market Rate</p>
                      <p className="text-xl font-bold">{WASTE_RATES[category] || 0} <span className="text-xs text-primary font-black ml-1">Cr / kg</span></p>
                    </div>
                    <div className="p-6 rounded-[32px] bg-white/5 border border-white/5 space-y-2">
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Index Change</p>
                      <p className="text-xl font-bold text-accent">+2.45%</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-white/5">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Info className="w-4 h-4" />
                      <p className="text-xs leading-relaxed">
                        Algorithm: <span className="font-mono text-[10px] bg-white/5 px-2 py-0.5 rounded">Rate(c) × Weight(w) × Quality(q)</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-4 p-5 rounded-3xl bg-accent/5 border border-accent/10">
                      <div className="w-10 h-10 rounded-2xl bg-accent/20 flex items-center justify-center text-accent shrink-0">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <p className="text-[10px] font-bold text-accent/80 leading-relaxed uppercase tracking-wider">
                        High-quality, non-contaminated materials trigger a 1.2x multiplier.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="glass border-primary/20 rounded-[48px] overflow-hidden shadow-3xl bg-primary/5">
                    <CardHeader className="p-10 pb-0">
                      <CardTitle className="text-2xl font-black font-headline">Analysis Verdict</CardTitle>
                    </CardHeader>
                    <CardContent className="p-10 space-y-8">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="p-6 rounded-[32px] bg-background/50 border border-white/5 space-y-1">
                          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Detected</p>
                          <p className="text-2xl font-black text-primary">{result.wasteType}</p>
                        </div>
                        <div className="p-6 rounded-[32px] bg-background/50 border border-white/5 space-y-1">
                          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Quality</p>
                          <p className="text-2xl font-black">{(result.qualityScore * 100).toFixed(0)}%</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-end px-2">
                          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Contamination Level</p>
                          <span className={`text-sm font-black ${result.contamination > 20 ? 'text-destructive' : 'text-accent'}`}>
                            {result.contamination}%
                          </span>
                        </div>
                        <div className="h-4 bg-background/50 rounded-full overflow-hidden p-1 border border-white/5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${result.contamination}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full rounded-full ${result.contamination > 20 ? 'bg-destructive' : 'bg-accent'}`}
                          />
                        </div>
                      </div>

                      <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-[0_0_20px_rgba(0,200,150,0.5)]">
                            <CheckCircle2 className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-sm font-bold">Transaction Success</p>
                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Wallet Updated</p>
                          </div>
                        </div>
                        <Zap className="w-8 h-8 text-primary/20" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
