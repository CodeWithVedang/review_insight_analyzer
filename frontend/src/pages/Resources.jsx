import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HelpCircle, Code2, Zap, ExternalLink,
  ChevronDown, ChevronUp, Terminal, FileText, Cpu,
} from 'lucide-react';

const FAQS = [
  {
    q: 'Why does the Dashboard show "ML Core Unreachable"?',
    a: 'The FastAPI backend is not running. Open a terminal in the project root and run: python -m uvicorn backend.main:app --port 8001 --reload  (or double-click run_backend.bat)',
  },
  {
    q: 'How do I regenerate the training dataset?',
    a: 'Run `python -m ml.setup_data` from the project root. This triggers the professional-grade pipeline that fetches real data from Amazon/Flipkart APIs (if keys are set) or high-fidelity synthesized profiles.',
  },
  {
    q: 'How do I add real API keys for Amazon/Flipkart?',
    a: 'Go to the Settings page and look for "Product Data Sources". You can enter your Rainforest API (for Amazon) or SerpApi (for Flipkart) keys there to enable live product extraction.',
  },
  {
    q: 'Can I add real product images?',
    a: 'The platform now automatically pulls real product images from the API. If an image is missing, it dynamically generates a consistent high-resolution placeholder for that specific product.',
  },
  {
    q: 'How do I add new product categories?',
    a: 'Modify `ml/data_fetcher.py` and update the `CATEGORY_SOURCES` and `CATEGORY_FEATURES` dictionaries. Then re-run `python -m ml.setup_data` to rebuild the corpus.',
  },
];

const API_ENDPOINTS = [
  { method: 'GET',  path: '/reviews/',              desc: 'Fetch first 100 reviews with full ML analysis' },
  { method: 'POST', path: '/reviews/',              desc: 'Submit a new review for analysis' },
  { method: 'POST', path: '/reviews/bulk-analyze',  desc: 'Batch analyze multiple reviews' },
  { method: 'GET',  path: '/insights/overall',      desc: 'Aggregate sentiment & emotion statistics' },
  { method: 'GET',  path: '/insights/summary',      desc: 'AI-generated text summary of the corpus' },
  { method: 'GET',  path: '/health',                desc: 'Quick connectivity ping' },
  { method: 'GET',  path: '/',                      desc: 'Service info & version' },
];

const METHOD_COLORS = {
  GET:    'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  POST:   'text-indigo-400  bg-indigo-400/10  border-indigo-400/20',
  DELETE: 'text-rose-400    bg-rose-400/10    border-rose-400/20',
};

export default function Resources() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto pb-20 space-y-10"
    >
      {/* Header */}
      <header>
        <h1 className="text-4xl font-black text-white tracking-tight">Resources & Help</h1>
        <p className="text-slate-500 mt-2 font-medium">
          Documentation, API reference, and troubleshooting for InsightAI.
        </p>
      </header>

      {/* Quick Start */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="glass-panel overflow-hidden"
      >
        <div className="flex items-center gap-3 px-7 py-5 border-b border-white/5">
          <div className="p-2 bg-slate-800 rounded-xl"><Zap size={18} className="text-amber-400" /></div>
          <h2 className="font-black text-white">Quick Start</h2>
        </div>
        <div className="px-7 py-6 space-y-5">
          {[
            { step: 1, title: 'Install dependencies', cmd: 'pip install -r requirements.txt', sub: 'From the project root with your venv activated' },
            { step: 2, title: 'Download NLTK data (first run only)', cmd: 'python -c "import nltk; nltk.download(\'punkt\'); nltk.download(\'stopwords\')"', sub: '' },
            { step: 3, title: 'Start the backend', cmd: 'python -m uvicorn backend.main:app --port 8001 --reload', sub: 'Or double-click run_backend.bat' },
            { step: 4, title: 'Start the frontend', cmd: 'cd frontend && npm install && npm run dev', sub: 'Visit http://localhost:5173' },
          ].map(({ step, title, cmd, sub }) => (
            <div key={step} className="flex gap-5">
              <div className="min-w-[32px] h-8 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-400 text-xs font-black flex items-center justify-center flex-shrink-0">
                {step}
              </div>
              <div className="space-y-1.5 flex-1">
                <p className="text-sm font-bold text-slate-200">{title}</p>
                {sub && <p className="text-[11px] text-slate-500">{sub}</p>}
                <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-white/5 group relative">
                  <Terminal size={13} className="text-slate-500 flex-shrink-0" />
                  <code className="text-xs text-emerald-400 font-mono break-all">{cmd}</code>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* API Reference */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-panel overflow-hidden"
      >
        <div className="flex items-center gap-3 px-7 py-5 border-b border-white/5">
          <div className="p-2 bg-slate-800 rounded-xl"><Code2 size={18} className="text-indigo-400" /></div>
          <h2 className="font-black text-white">API Reference</h2>
          <span className="ml-auto text-[10px] font-mono text-slate-500 border border-slate-700 px-2 py-0.5 rounded">
            127.0.0.1:8001
          </span>
        </div>
        <div className="divide-y divide-white/5">
          {API_ENDPOINTS.map((ep, i) => (
            <div key={i} className="flex items-center gap-5 px-7 py-4 hover:bg-white/[0.02] transition-colors">
              <span className={`text-[10px] font-black px-2.5 py-1 rounded border w-[52px] text-center flex-shrink-0 ${METHOD_COLORS[ep.method] || METHOD_COLORS.GET}`}>
                {ep.method}
              </span>
              <code className="text-sm font-mono text-slate-300 w-60 flex-shrink-0">{ep.path}</code>
              <p className="text-sm text-slate-500">{ep.desc}</p>
            </div>
          ))}
        </div>
        <div className="px-7 py-5 border-t border-white/5">
          <a
            href="/api_internal/docs"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-400 hover:text-brand-300 transition-colors"
          >
            <FileText size={15} />
            Open Interactive Swagger Docs
            <ExternalLink size={13} />
          </a>
        </div>
      </motion.div>

      {/* Architecture */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="glass-panel overflow-hidden"
      >
        <div className="flex items-center gap-3 px-7 py-5 border-b border-white/5">
          <div className="p-2 bg-slate-800 rounded-xl"><Cpu size={18} className="text-purple-400" /></div>
          <h2 className="font-black text-white">Architecture</h2>
        </div>
        <div className="px-7 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'ML Layer',       color: 'border-purple-500/40 bg-purple-500/5',  icon: '🧠', items: ['TextBlob sentiment', 'Heuristic emotions', 'Aspect extraction', 'Fake-review scoring'] },
              { label: 'Backend',        color: 'border-indigo-500/40 bg-indigo-500/5',  icon: '⚡', items: ['FastAPI 2.0', 'Pandas CSV store', 'CORS middleware', 'Pydantic schemas'] },
              { label: 'Frontend',       color: 'border-brand-500/40  bg-brand-500/5',   icon: '🎨', items: ['React + Vite', 'Recharts analytics', 'Framer Motion', 'TailwindCSS'] },
            ].map(({ label, color, icon, items }) => (
              <div key={label} className={`rounded-2xl border p-5 space-y-3 ${color}`}>
                <div className="text-2xl">{icon}</div>
                <h3 className="font-black text-white text-sm">{label}</h3>
                <ul className="space-y-1.5">
                  {items.map(it => (
                    <li key={it} className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span className="w-1 h-1 bg-slate-500 rounded-full flex-shrink-0" />{it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* FAQ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass-panel overflow-hidden"
      >
        <div className="flex items-center gap-3 px-7 py-5 border-b border-white/5">
          <div className="p-2 bg-slate-800 rounded-xl"><HelpCircle size={18} className="text-brand-400" /></div>
          <h2 className="font-black text-white">Frequently Asked Questions</h2>
        </div>
        <div className="divide-y divide-white/5">
          {FAQS.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-7 py-5 text-left hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-sm font-bold text-slate-200">{faq.q}</span>
                {openFaq === i
                  ? <ChevronUp size={16} className="text-brand-400 flex-shrink-0" />
                  : <ChevronDown size={16} className="text-slate-500 flex-shrink-0" />}
              </button>
              {openFaq === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-7 pb-5"
                >
                  <p className="text-sm text-slate-400 leading-relaxed border-l-2 border-brand-500/40 pl-4">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
