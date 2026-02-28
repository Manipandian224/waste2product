"use client"

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Zap, 
  Trash2, 
  Leaf, 
  Trophy, 
  ArrowUpRight, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { generateEcoInsights, type AiDrivenEcoInsightsOutput } from '@/ai/flows/ai-driven-eco-insights';

const WASTE_HISTORY = [
  { month: 'Jan', amount: 12 },
  { month: 'Feb', amount: 18 },
  { month: 'Mar', amount: 15 },
  { month: 'Apr', amount: 25 },
  { month: 'May', amount: 22 },
  { month: 'Jun', amount: 30 },
];

const CATEGORY_DATA = [
  { name: 'Plastic', value: 400, color: 'hsl(165, 100%, 39%)' },
  { name: 'Paper', value: 300, color: 'hsl(146, 44%, 58%)' },
  { name: 'Metal', value: 300, color: 'hsl(180, 50%, 50%)' },
  { name: 'E-waste', value: 200, color: 'hsl(160, 30%, 40%)' },
];

export default function DashboardPage() {
  const [insights, setInsights] = useState<AiDrivenEcoInsightsOutput | null>(null);

  useEffect(() => {
    async function loadInsights() {
      try {
        const data = await generateEcoInsights({});
        setInsights(data);
      } catch (e) {
        // Silent fail as it's a dashboard enhancement
      }
    }
    loadInsights();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8 md:space-y-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-bold font-headline">Welcome back, Eco Hero!</h1>
            <p className="text-sm md:text-base text-muted-foreground">Your impact this month has been exceptional.</p>
          </div>
          <div className="glass px-4 md:px-6 py-3 md:py-4 rounded-2xl md:rounded-3xl flex items-center gap-4 w-full md:w-auto animate-in slide-in-from-right-8 duration-500">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-accent/20 flex items-center justify-center">
              <Trophy className="w-5 h-5 md:w-6 md:h-6 text-accent" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">Rank</p>
              <p className="text-lg md:text-xl font-bold">Gold Guardian</p>
            </div>
          </div>
        </header>

        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: 'Green Credits', value: '24,500', icon: Zap, color: 'text-primary' },
            { label: 'Waste Submitted', value: '142 kg', icon: Trash2, color: 'text-accent' },
            { label: 'CO2 Saved', value: '0.8 Tons', icon: Leaf, color: 'text-green-400' },
            { label: 'Eco Score', value: '88/100', icon: ShieldCheck, color: 'text-blue-400' },
          ].map((stat, i) => (
            <Card key={i} className="glass border-none rounded-2xl md:rounded-3xl animate-in fade-in zoom-in duration-500" style={{ animationDelay: `${i * 100}ms` }}>
              <CardContent className="p-4 md:p-6 text-left">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 md:p-3 rounded-xl md:rounded-2xl bg-white/5 ${stat.color}`}>
                    <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="text-[10px] bg-green-500/10 text-green-500 px-2 py-1 rounded-full flex items-center gap-1 font-bold">
                    <ArrowUpRight className="w-3 h-3" /> +12%
                  </div>
                </div>
                <p className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl md:text-3xl font-black mt-1">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          <Card className="lg:col-span-2 glass border-none rounded-2xl md:rounded-3xl p-4 md:p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-lg md:text-xl">Monthly Waste Collection</CardTitle>
              <CardDescription className="text-xs md:text-sm">Track your recycling progress over time</CardDescription>
            </CardHeader>
            <div className="h-64 md:h-80 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={WASTE_HISTORY}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(165, 100%, 39%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(165, 100%, 39%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="month" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#192723', border: '1px solid #ffffff10', borderRadius: '12px' }}
                    itemStyle={{ color: '#00C896' }}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#00C896" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="glass border-none rounded-2xl md:rounded-3xl p-4 md:p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-lg md:text-xl">Waste Categories</CardTitle>
              <CardDescription className="text-xs md:text-sm">Distribution by weight</CardDescription>
            </CardHeader>
            <div className="h-48 md:h-64 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CATEGORY_DATA}
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {CATEGORY_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{ backgroundColor: '#192723', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl md:text-2xl font-bold">142</span>
                <span className="text-[8px] md:text-[10px] text-muted-foreground uppercase tracking-widest">kg Total</span>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              {CATEGORY_DATA.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-[10px] md:text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-bold">{((item.value / 1200) * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* AI Insights & Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold font-headline flex items-center gap-2">
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-accent" />
              AI Environmental Insights
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {insights ? (
                insights.insightCards.map((insight, i) => (
                  <Card key={i} className="glass-darker border-l-4 border-l-primary rounded-xl md:rounded-2xl animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${i * 150}ms` }}>
                    <CardContent className="p-4">
                      <p className="text-xs md:text-sm font-medium">{insight}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                Array(4).fill(0).map((_, i) => (
                  <Card key={i} className="glass-darker h-20 md:h-24 animate-pulse rounded-xl md:rounded-2xl" />
                ))
              )}
            </div>
            {insights && (
              <div className="glass p-4 md:p-6 rounded-2xl md:rounded-3xl space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Clock className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="font-bold text-xs md:text-sm">Forecast</span>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground italic">&quot;{insights.wasteGrowthForecast}&quot;</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold font-headline">Recent Activity</h2>
            <div className="space-y-3 md:space-y-4">
              {[
                { title: 'Waste Pickup Confirmed', time: '2 hours ago', amount: '+450 Cr', icon: Trash2 },
                { title: 'Purchased Eco-Tech Lamp', time: '1 day ago', amount: '-1200 Cr', icon: ShoppingBag },
                { title: 'AI Analysis Completed', time: '3 days ago', amount: '+120 Cr', icon: ShieldCheck },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between p-3 md:p-4 glass rounded-xl md:rounded-2xl hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      {activity.icon && <activity.icon className="w-4 h-4 md:w-5 md:h-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-xs md:text-sm">{activity.title}</p>
                      <p className="text-[8px] md:text-[10px] text-muted-foreground uppercase tracking-widest">{activity.time}</p>
                    </div>
                  </div>
                  <div className={`font-black text-xs md:text-base ${activity.amount.startsWith('+') ? 'text-accent' : 'text-white'}`}>
                    {activity.amount}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
