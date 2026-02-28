import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { Button } from '@/components/ui/button';
import { ArrowRight, Recycle, ShieldCheck, Zap, Globe, Cpu, ShoppingBag, Upload } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LandingPage() {
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-recycle');

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative px-6 pt-12 md:pt-20 pb-20 md:pb-32 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] md:text-xs font-bold uppercase tracking-wider">
              <Recycle className="w-3 h-3" />
              Circular Economy Powered by AI
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight font-headline">
              Turn Your <span className="text-primary italic">Waste</span> Into <span className="text-accent underline decoration-accent/30">Wealth</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl">
              Upload waste, earn Green Credits using AI analysis, and shop for sustainable products. Join the revolution of circular consumption.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="rounded-full bg-primary hover:bg-primary/90 h-12 md:h-14 px-6 md:px-8 text-base md:text-lg font-bold">
                <Link href="/upload" className="flex items-center">Upload Waste Now <ArrowRight className="ml-2 w-5 h-5" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full border-primary/20 h-12 md:h-14 px-6 md:px-8 text-base md:text-lg font-bold hover:bg-primary/5">
                <Link href="/marketplace">Explore Marketplace</Link>
              </Button>
            </div>
            
            <div className="flex items-center gap-6 md:gap-8 pt-4">
              <div className="space-y-1">
                <p className="text-xl md:text-2xl font-bold text-white">12,450+</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Active Users</p>
              </div>
              <div className="w-px h-8 md:h-10 bg-white/10"></div>
              <div className="space-y-1">
                <p className="text-xl md:text-2xl font-bold text-white">45.2 Tons</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Waste Collected</p>
              </div>
            </div>
          </div>

          <div className="relative animate-in fade-in slide-in-from-right-8 duration-700 delay-200 hidden md:block">
            <div className="absolute -inset-4 bg-primary/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="relative glass p-4 rounded-3xl transform hover:scale-[1.02] transition-transform">
              <Image 
                src={heroImg?.imageUrl || ''} 
                alt="Circular Economy" 
                width={600} 
                height={400} 
                className="rounded-2xl object-cover w-full h-auto"
                data-ai-hint="recycling sustainability"
              />
              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 glass p-4 rounded-2xl shadow-2xl animate-float hidden lg:block">
                <div className="flex items-center gap-3">
                  <div className="bg-green-500/20 p-2 rounded-lg">
                    <ShieldCheck className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">AI Verification</p>
                    <p className="text-sm font-bold">99.2% Accuracy</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 glass p-4 rounded-2xl shadow-2xl animate-float hidden lg:block" style={{ animationDelay: '2s' }}>
                <div className="flex items-center gap-3">
                  <div className="bg-accent/20 p-2 rounded-lg">
                    <Zap className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Credits Earned</p>
                    <p className="text-sm font-bold">2.4M Tokens</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white/5 border-y border-white/5 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'CO2 Saved', value: '1,240T', icon: Globe },
            { label: 'Recycled Goods', value: '45,000+', icon: ShoppingBag },
            { label: 'Waste Pickups', value: '8,420', icon: Recycle },
            { label: 'AI Processed', value: '120k+', icon: Cpu },
          ].map((stat, i) => (
            <div key={i} className="text-center space-y-2 group">
              <div className="mx-auto w-10 md:w-12 h-10 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <stat.icon className="w-5 md:w-6 h-5 md:h-6 text-primary" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16 font-headline">The Circular Loop</h2>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {[
            { title: 'Upload Waste', desc: 'Take a photo of your recyclables. Our AI analyzes and calculates green credits instantly.', icon: Upload },
            { title: 'Earn Credits', desc: 'Get rewarded for your environmental impact with digital Green Credits stored in your wallet.', icon: Zap },
            { title: 'Shop Sustainable', desc: 'Use your credits to buy premium recycled and upcycled products from our marketplace.', icon: ShoppingBag },
          ].map((step, i) => (
            <div key={i} className="glass p-6 md:p-8 rounded-3xl space-y-4 hover:border-primary/40 transition-colors">
              <div className="w-12 md:w-14 h-12 md:h-14 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-lg md:text-xl">
                {i + 1}
              </div>
              <h3 className="text-lg md:text-xl font-bold font-headline">{step.title}</h3>
              <p className="text-sm md:text-base text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
