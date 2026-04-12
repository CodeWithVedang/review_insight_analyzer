import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, Send, Bot, Cpu, AlertTriangle, RefreshCw } from 'lucide-react';

const API_BASE = 'http://localhost:8001';

const SAMPLES = [
  "The camera takes beautiful pictures during the day, but the battery drains incredibly fast causing major frustration.",
  "Amazing build quality and super fast delivery. The screen is crystal clear. Absolutely love it!",
  "Terrible customer service. The product stopped working after 2 days. Complete waste of money.",
  "It's decent for the price. Nothing special, but gets the job done. Quality is average.",
];

export default function AILab() {
  const [input, setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState(null);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await axios.post(
        `${API_BASE}/reviews/bulk-analyze`,
        [{ product_name: 'Lab Test', review_text: input, rating: 3 }],
        { timeout: 10000 }
      );
      setResult(res.data.results[0]);
    } catch (e) {
      setError(e.message || 'Backend unreachable');
    }
    setLoading(false);
  };

  const loadSample = (s) => { setInput(s); setResult(null); setError(null); };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <header className="mb-10 text-center">
        <div className="inline-block p-4 rounded-3xl bg-indigo-500/10 border border-indigo-500/30 mb-6">
          <FlaskConical size={40} className="text-indigo-400" />
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight">Transformer Lab Playground</h1>
        <p className="text-slate-400 mt-3 text-lg">
          Test the NLP engine live. Paste any review and see full ML extraction in real-time.
        </p>
      </header>

      {/* Sample chips */}
      <div className="mb-6 flex flex-wrap gap-2 justify-center">
        <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest self-center mr-2">Try a sample:</span>
        {SAMPLES.map((s, i) => (
          <button
            key={i}
            onClick={() => loadSample(s)}
            className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-slate-800 border border-white/10 text-slate-400 hover:text-brand-400 hover:border-brand-500/40 transition-all truncate max-w-[200px]"
          >
            Sample {i + 1}
          </button>
        ))}
      </div>

      <div className="glass-panel p-8 space-y-6">
        {/* Input */}
        <div className="relative">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            className="w-full h-44 glass-input resize-none pr-16"
            placeholder="e.g., 'The camera takes beautiful pictures during the day, but the battery drains incredibly fast causing major frustration.'"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !input.trim()}
            className="absolute bottom-4 right-4 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed text-white p-3 rounded-xl shadow-lg transition-all active:scale-90"
          >
            {loading ? <Cpu className="animate-spin" size={20}/> : <Send size={20}/>}
          </button>
          <div className="absolute bottom-4 left-4 text-[10px] text-slate-600 font-mono">{input.length} chars</div>
        </div>

        {/* Error */}
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
            <AlertTriangle size={16} className="flex-shrink-0"/>
            <span>Backend unreachable — start the server first.</span>
            <button onClick={handleAnalyze} className="ml-auto p-1 hover:text-white transition-colors"><RefreshCw size={14}/></button>
          </motion.div>
        )}

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <h3 className="text-lg font-bold text-slate-300 mb-5 flex items-center gap-2">
                <Bot size={20} className="text-indigo-400"/> Engine Feedback
              </h3>

              {/* Main 4-card grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <ExtractionCard
                  title="Sentiment"
                  value={result.sentiment}
                  color={result.sentiment === 'Positive' ? 'text-emerald-400' : result.sentiment === 'Negative' ? 'text-rose-400' : 'text-slate-400'}
                  icon="🎯"
                />
                <ExtractionCard title="Emotion"         value={result.emotion}                                 color="text-indigo-400 capitalize" icon="💡" />
                <ExtractionCard title="Confidence"      value={`${(result.confidence * 100).toFixed(1)}%`}    color="text-brand-400"             icon="📊" />
                <ExtractionCard title="Authenticity"    value={`${((1 - result.is_fake_score) * 100).toFixed(1)}%`} color={result.is_fake_score > 0.6 ? 'text-rose-400' : 'text-emerald-400'} icon="🛡️" />
              </div>

              {/* Aspects */}
              {result.aspects && Object.keys(result.aspects).length > 0 && (
                <div className="p-5 bg-slate-950/40 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-3">Detected Aspects</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(result.aspects).map(([aspect, sent]) => (
                      <span key={aspect}
                        className={`text-xs font-bold px-3 py-1 rounded-lg border flex items-center gap-2 ${
                          sent === 'Positive'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${sent === 'Positive' ? 'bg-emerald-500' : 'bg-rose-500'}`}/>
                        {aspect}
                        <span className="text-[9px] opacity-70 ml-0.5">{sent}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.aspects && Object.keys(result.aspects).length === 0 && (
                <p className="text-xs text-slate-600 text-center italic">No specific product aspects detected in this text.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function ExtractionCard({ title, value, color, icon }) {
  return (
    <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl text-center shadow-inner hover:border-brand-500/30 transition-all group">
      <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{icon}</div>
      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-2">{title}</span>
      <span className={`text-lg font-black ${color}`}>{value}</span>
    </div>
  );
}
