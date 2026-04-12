import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, CartesianGrid, XAxis, YAxis, Bar,
} from 'recharts';
import {
  Activity, Quote, Target, Brain, ShieldAlert, TrendingUp,
  MessageSquare, AlertTriangle, RefreshCw, Wifi,
} from 'lucide-react';
import { motion } from 'framer-motion';

const API_BASE = 'http://localhost:8001';
const COLORS = ['#10b981', '#f43f5e', '#64748b'];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [insightsRes, summaryRes] = await Promise.all([
        axios.get(`${API_BASE}/insights/overall`, { timeout: 10000 }),
        axios.get(`${API_BASE}/insights/summary`, { timeout: 10000 }),
      ]);
      setData(insightsRes.data);
      setSummary(summaryRes.data.ai_summary);
    } catch (e) {
      console.error(e);
      setError(e.message || 'Connection failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
      <div className="text-brand-500 animate-pulse font-black text-xs tracking-[0.3em] uppercase">
        Initializing Neural Core
      </div>
    </div>
  );

  if (error || !data) return (
    <div className="h-full flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-10 max-w-lg w-full text-center space-y-6"
      >
        {/* Animated warning icon */}
        <div className="w-20 h-20 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
          <AlertTriangle size={40} className="text-rose-400" />
        </div>

        <div>
          <h2 className="text-2xl font-black text-white mb-2">ML Core Unreachable</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Cannot connect to the backend at{' '}
            <code className="text-brand-400 bg-slate-800 px-2 py-0.5 rounded font-mono text-xs">
              {API_BASE}
            </code>
          </p>
        </div>

        {/* Steps */}
        <div className="text-left space-y-3">
          <p className="text-xs font-black uppercase tracking-widest text-slate-500">How to fix:</p>
          {[
            'Open a terminal in the project root folder',
            'Run:  run_backend.bat  (or see below)',
            'Wait for "Uvicorn running on http://0.0.0.0:8001"',
            'Then click Retry below',
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3 text-sm text-slate-300">
              <span className="min-w-[22px] h-[22px] rounded-full bg-brand-500/20 text-brand-400 text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span>{step}</span>
            </div>
          ))}
          <div className="mt-2 p-3 bg-slate-950 rounded-xl border border-white/5">
            <code className="text-xs text-emerald-400 font-mono">
              python -m uvicorn backend.main:app --port 8001 --reload
            </code>
          </div>
        </div>

        <button
          onClick={fetchData}
          className="w-full flex items-center justify-center gap-3 py-3.5 bg-brand-500 hover:bg-brand-400 active:scale-95 text-slate-950 font-black rounded-xl transition-all shadow-lg shadow-brand-500/20"
        >
          <RefreshCw size={18} />
          Retry Connection
        </button>

        <div className="flex items-center gap-2 justify-center text-xs text-slate-600">
          <Wifi size={12} />
          <span>Error: {error || 'No data received'}</span>
        </div>
      </motion.div>
    </div>
  );

  const pieData = Object.entries(data.overall_sentiment).map(([name, value]) => ({ name, value }));
  const barData = Object.entries(data.emotion_distribution).map(([name, val]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    count: val,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[1600px] mx-auto space-y-10"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Intelligence Overview</h1>
          <p className="text-slate-500 mt-2 font-medium">
            Aggregate sentiment analysis from {data.total_reviews.toLocaleString()} unique data points.
          </p>
        </div>
        <div className="flex bg-slate-900 border border-white/5 rounded-2xl p-1 shadow-inner">
          <button className="px-4 py-2 text-xs font-bold text-white bg-slate-800 rounded-xl shadow-lg">Real-time</button>
          <button className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-300 transition-colors">Historical</button>
        </div>
      </header>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Corpus"     value={data.total_reviews.toLocaleString()} icon={<Activity className="text-indigo-400"/>} metric="Processed"   change="+12%" />
        <StatCard title="Positivity Index" value={`${data.positive_percentage}%`}       icon={<Target className="text-emerald-400"/>}  metric="Trust Score" change="+2.4%" />
        <StatCard title="At-Risk Sentiment" value={`${data.negative_percentage}%`}      icon={<ShieldAlert className="text-rose-400"/>} metric="Toxicity"    change="-5.1%" />
        <StatCard title="Aspect Mentions"  value={Object.keys(data.trending_keywords).length} icon={<TrendingUp className="text-brand-400"/>} metric="Trending" change="Active" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 glass-panel p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold flex items-center gap-3">
              <Brain className="text-brand-500" size={20}/> Core Sentiment
            </h3>
            <span className="text-[10px] font-mono text-slate-500 border border-slate-700 px-2 py-0.5 rounded uppercase">
              Vector Mapping
            </span>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100}
                  paddingAngle={8} dataKey="value" stroke="none" animationBegin={200}>
                  {pieData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }} itemStyle={{ fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 flex justify-center gap-6">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-xs font-bold text-slate-400">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-8 glass-panel p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold flex items-center gap-3">
              <Activity className="text-indigo-500" size={20}/> Emotional Spectrum Analysis
            </h3>
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Live Stream</span>
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.5}/>
                <XAxis dataKey="name" stroke="#64748b" tickLine={false} axisLine={false} dy={15} fontSize={11} fontWeight={700}/>
                <YAxis stroke="#475569" tickLine={false} axisLine={false} dx={-10} fontSize={11} fontWeight={600}/>
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}/>
                <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={45}>
                  {barData.map((entry, index) => (
                    <Cell key={index} fill={
                      entry.name === 'Happy'       ? '#10b981' :
                      entry.name === 'Frustrated'  ? '#f43f5e' :
                      entry.name === 'Angry'       ? '#ef4444' :
                      'url(#barGradient)'
                    }/>
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
        <div className="glass-panel p-8">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-3 text-white">
            <TrendingUp size={20} className="text-brand-400" /> Key Aspect Performance
          </h3>
          <div className="space-y-6">
            {Object.entries(data.trending_keywords).map(([aspect, score], i) => (
              <div key={aspect} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="capitalize font-bold text-slate-300">{aspect}</span>
                  <span className="font-mono text-brand-400">{score} mentions</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((score / 200) * 100, 100)}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className={`h-full bg-gradient-to-r ${i % 2 === 0 ? 'from-brand-500 to-indigo-500' : 'from-indigo-500 to-purple-500'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-8 bg-gradient-to-br from-indigo-900/20 to-transparent">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-3 text-white">
            <MessageSquare size={20} className="text-indigo-400" /> AI Strategic Summary
          </h3>
          <div className="p-6 bg-slate-950/40 rounded-2xl border border-white/5 space-y-4">
            <p className="text-slate-300 leading-relaxed">
              {summary || `Total corpus analysis indicates a high baseline of customer satisfaction (${data.positive_percentage}%).`}
            </p>
            <Quote className="text-slate-600 mb-2" size={32} />
            <p className="text-slate-400 text-sm italic font-medium leading-relaxed">
              "The trajectory suggests that while fundamental utility is high, the emotional friction points across
              the corpus indicate areas for potential optimization in user retention."
            </p>
            <div className="pt-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center font-black text-[10px] text-slate-900">AI</div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Synthetic Intelligence Report</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ title, value, icon, metric, change }) {
  const isPositive = change.startsWith('+') || change === 'Active';
  return (
    <div className="glass-panel p-6 border-l-4 border-l-brand-500 bg-gradient-to-br from-slate-900 to-transparent hover:border-l-brand-400 transition-all group overflow-hidden relative">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-500/5 rounded-full blur-3xl group-hover:bg-brand-500/10 transition-colors" />
      <div className="flex justify-between items-start mb-4 relative z-10">
        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{title}</span>
        <div className="p-2.5 bg-slate-800 rounded-xl group-hover:scale-110 transition-transform">{icon}</div>
      </div>
      <div className="flex items-end justify-between relative z-10">
        <div>
          <div className="text-3xl font-black text-white">{value}</div>
          <p className="mt-1 text-[10px] text-slate-500 font-mono tracking-tighter uppercase">{metric}</p>
        </div>
        <div className={`px-2 py-1 rounded-lg text-[10px] font-black ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
          {change}
        </div>
      </div>
    </div>
  );
}
