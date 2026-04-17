import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Bot, User, Send, Sparkles, Loader2, Info } from 'lucide-react';

const API_BASE = '/api_internal';

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hello! I am your Market Intelligence Agent. Ask me anything about the customer reviews in your dataset.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/advanced/chat`, { query: userMsg });
      setMessages(prev => [...prev, { role: 'bot', content: res.data.response }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', content: 'Engine Connection Error: Ensure Gemin API key is configured and backend is active.' }]);
    }
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex flex-col">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-brand-500 rounded-2xl shadow-lg shadow-brand-500/20">
            <MessageSquare size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Agentic Intelligence</h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Ask Your Data Playground</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-full border border-white/5 text-[10px] font-bold text-slate-400">
           <Sparkles size={12} className="text-brand-400"/>
           POWERED BY GEMINI 1.5 FLASH
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 glass-panel mb-6 overflow-hidden flex flex-col p-2">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-indigo-500' : 'bg-brand-500'}`}>
                    {msg.role === 'user' ? <User size={16} className="text-white"/> : <Bot size={16} className="text-white"/>}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-900 border border-white/5 text-slate-300 rounded-tl-none'}`}>
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-3 items-center text-slate-500 text-xs font-bold bg-slate-900/50 px-4 py-2 rounded-full border border-white/5">
                <Loader2 size={14} className="animate-spin text-brand-400"/>
                Agent is thinking...
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
      </div>

      {/* Input */}
      <div className="relative group">
        <input 
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask something (e.g., 'Compare the battery life of top products')"
          className="w-full h-16 pl-6 pr-20 glass-input text-lg focus:border-brand-500/50 transition-all rounded-3xl"
        />
        <button 
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="absolute right-3 top-3 bottom-3 px-6 bg-brand-500 hover:bg-brand-400 disabled:opacity-40 text-white rounded-2xl font-bold flex items-center gap-2 transition-all active:scale-90"
        >
          <Send size={18}/>
          <span className="hidden sm:inline">Ask Agent</span>
        </button>
      </div>
      
      <p className="mt-4 text-[10px] text-center text-slate-600 font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2">
        <Info size={12}/>
        Agent analysis is based on current synthesized datasets and live scraped telemetry.
      </p>
    </motion.div>
  );
}
