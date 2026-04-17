import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { BarChart3, ArrowRight, Zap, Target, TrendingUp } from 'lucide-react';

const API_BASE = '/api_internal';

export default function Compare() {
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleCompare = async () => {
    if (!p1 || !p2) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/advanced/compare?p1=${p1}&p2=${p2}`, { timeout: 120000 });
      setResults(res.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Competitive Benchmarking</h1>
          <p className="text-slate-400 mt-2">Side-by-side analytical comparison of market rivals.</p>
        </div>
        <div className="p-4 rounded-3xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
          <BarChart3 size={32} />
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-6 mb-10 items-end">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Product A</label>
          <input className="glass-input w-full" value={p1} onChange={e => setP1(e.target.value)} placeholder="Enter Product Name..." />
        </div>
        <div className="flex justify-center pb-2">
          <div className="w-12 h-12 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-black text-slate-500 italic">VS</div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Product B</label>
          <input className="glass-input w-full" value={p2} onChange={e => setP2(e.target.value)} placeholder="Entry Rival Name..." />
        </div>
      </div>

      <button 
        onClick={handleCompare}
        disabled={loading || !p1 || !p2}
        className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-2xl mb-12 shadow-xl shadow-indigo-600/20 transition-all border border-indigo-400/30"
      >
        {loading ? 'Analyzing Market Dynamics...' : 'Execute Comparison Analysis'}
      </button>

      {results && results.product_1 && (
        <div className="grid md:grid-cols-2 gap-8">
          <ComparisonCard data={results.product_1} color="brand" />
          <ComparisonCard data={results.product_2} color="indigo" />
        </div>
      )}
    </motion.div>
  );
}

function ComparisonCard({ data, color }) {
  const accent = color === 'brand' ? 'text-brand-400' : 'text-indigo-400';
  const bg     = color === 'brand' ? 'bg-brand-500/10 border-brand-500/20' : 'bg-indigo-500/10 border-indigo-500/20';

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel p-8 relative overflow-hidden">
      <div className={`absolute -right-12 -top-12 w-48 h-48 rounded-full blur-[100px] opacity-20 ${color === 'brand' ? 'bg-brand-500' : 'bg-indigo-500'}`} />
      
      <h3 className="text-2xl font-black text-white mb-6 truncate">{data.name}</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className={`p-5 rounded-2xl border ${bg}`}>
          <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Avg Rating</p>
          <p className={`text-3xl font-black ${accent}`}>{data.stats.avg_rating}</p>
        </div>
        <div className={`p-5 rounded-2xl border ${bg}`}>
          <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Volume</p>
          <p className={`text-3xl font-black ${accent}`}>{data.stats.review_count}</p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">Sentiment Distribution</p>
        {Object.entries(data.stats.sentiment).map(([key, val]) => (
          <div key={key} className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-300">
              <span className="capitalize">{key}</span>
              <span>{val}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${key === 'Positive' ? 'bg-emerald-500' : key === 'Negative' ? 'bg-rose-500' : 'bg-slate-400'}`}
                style={{ width: `${(val / data.stats.review_count) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
