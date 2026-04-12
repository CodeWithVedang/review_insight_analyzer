import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, BrainCircuit, BarChart3, ShieldCheck, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center px-4 pt-20">
       <motion.div 
         initial={{ scale: 0.5, opacity: 0 }} 
         animate={{ scale: 1, opacity: 1 }} 
         transition={{ type: "spring", stiffness: 100 }}
         className="w-24 h-24 mb-10 rounded-3xl bg-gradient-to-br from-brand-400 via-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_80px_rgba(99,102,241,0.6)]"
       >
         <Sparkles size={48} className="text-white" />
       </motion.div>
       
       <motion.h1 
         initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
         className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500 tracking-tight leading-tight max-w-4xl"
       >
         Decipher Every Review with <br/><span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-indigo-400">Deep AI Intelligence.</span>
       </motion.h1>

       <motion.p 
         initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
         className="mt-8 text-xl text-slate-400 max-w-2xl"
       >
         Analyze and benchmark thousands of real product reviews across <b>Amazon, Flipkart, and Myntra</b>. 
         Uncover precise emotional heatmaps, detect fake reviews, and extract granular feature intelligence instantly.
       </motion.p>

       <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="mt-12 flex flex-col sm:flex-row gap-6">
         <Link to="/dashboard" className="px-10 py-5 rounded-full bg-brand-500 text-slate-950 font-black text-lg shadow-[0_0_40px_-5px_rgba(20,184,166,0.5)] hover:scale-105 transition-all flex items-center gap-3">
           Launch Enterprise Platform <ArrowRight size={20} />
         </Link>
       </motion.div>

       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
          <FeatureCard icon={<BrainCircuit className="text-brand-400" size={32}/>} title="Transformer ML Engines" desc="Advanced Neural NLP extracting emotions beyond basic positive/negative scores." />
          <FeatureCard icon={<BarChart3 className="text-indigo-400" size={32}/>} title="Aspect Mining" desc="Automatically identifies product features being discussed (battery, screen, price)." />
          <FeatureCard icon={<ShieldCheck className="text-rose-400" size={32}/>} title="Fraud Detection" desc="Proprietary heuristics and ML models sniffing out fake bot reviews." />
       </motion.div>
    </div>
  )
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="glass-panel p-8 text-left space-y-4 hover:-translate-y-2 transition-transform duration-300 group">
       <div className="p-3 inline-block rounded-xl bg-slate-800 border border-slate-700 shadow-inner group-hover:scale-110 transition-transform">
         {icon}
       </div>
       <h3 className="text-xl font-bold text-white">{title}</h3>
       <p className="text-slate-400">{desc}</p>
    </div>
  )
}
