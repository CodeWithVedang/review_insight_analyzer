import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, User, Bell, Shield, Palette, Database,
  Globe, Key, ToggleLeft, ToggleRight, Save, Check,
} from 'lucide-react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [prefs, setPrefs] = useState({
    notifications: true,
    darkMode: true,
    autoRefresh: false,
    analyticsSharing: true,
    apiPort: '8001',
    apiHost: 'localhost',
    modelBackend: 'textblob',
    language: 'en',
    amazonKey: '',
    serpApiKey: '',
    crawlDepth: '10',
    limit: '500',
  });

  const toggle = key => setPrefs(p => ({ ...p, [key]: !p[key] }));
  const set = (key, val) => setPrefs(p => ({ ...p, [key]: val }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const sections = [
    {
      icon: <User size={18} className="text-brand-400" />,
      title: 'Account',
      items: [
        { label: 'Full Name',   type: 'input',  value: 'Administrator',   note: 'Display name across the platform' },
        { label: 'Email',       type: 'input',  value: 'admin@insightai.io', note: 'Used for system alerts' },
        { label: 'Role',        type: 'badge',  value: 'Enterprise Admin' },
      ],
    },
    {
      icon: <Database size={18} className="text-indigo-400" />,
      title: 'Backend Connection',
      items: [
        { label: 'API Host',  type: 'input', value: prefs.apiHost, onChange: v => set('apiHost', v), note: 'Hostname of the FastAPI server' },
        { label: 'API Port',  type: 'input', value: prefs.apiPort, onChange: v => set('apiPort', v), note: 'Default: 8001' },
        { label: 'ML Engine', type: 'select', value: prefs.modelBackend,
          options: [{ v: 'textblob', l: 'TextBlob + Heuristics' }, { v: 'sklearn', l: 'Scikit-Learn Pipeline' }],
          onChange: v => set('modelBackend', v) },
      ],
    },
    {
      icon: <Bell size={18} className="text-amber-400" />,
      title: 'Notifications',
      items: [
        { label: 'System Alerts',    type: 'toggle', key: 'notifications',    note: 'Email alerts for critical events' },
        { label: 'Auto Refresh',     type: 'toggle', key: 'autoRefresh',      note: 'Automatically refresh dashboard data' },
        { label: 'Usage Analytics',  type: 'toggle', key: 'analyticsSharing', note: 'Share anonymised usage data' },
      ],
    },
    {
      icon: <Palette size={18} className="text-purple-400" />,
      title: 'Appearance',
      items: [
        { label: 'Dark Mode', type: 'toggle', key: 'darkMode', note: 'Recommended for extended sessions' },
        { label: 'Language',  type: 'select', value: prefs.language,
          options: [{ v: 'en', l: 'English' }, { v: 'hi', l: 'Hindi' }, { v: 'es', l: 'Spanish' }],
          onChange: v => set('language', v) },
      ],
    },
    {
      icon: <Globe size={18} className="text-emerald-400" />,
      title: 'Product Data Sources',
      items: [
        { label: 'Amazon (Rainforest API Key)', type: 'password', value: prefs.amazonKey, onChange: v => set('amazonKey', v), note: 'Required for real-time Amazon product extraction' },
        { label: 'Flipkart/Search (SerpApi Key)', type: 'password', value: prefs.serpApiKey, onChange: v => set('serpApiKey', v), note: 'Used for Flipkart and Google Shopping results' },
        { label: 'Deep Crawl Depth', type: 'select', value: prefs.crawlDepth,
          options: [{ v: '10', l: 'Standard (10 reviews/prod)' }, { v: '50', l: 'Deep (50 reviews/prod)' }, { v: '100', l: 'Full Coverage' }],
          onChange: v => set('crawlDepth', v) },
        { label: 'Data Limit', type: 'input', value: prefs.limit, onChange: v => set('limit', v), note: 'Max products to analyze per crawl' },
      ],
    },
    {
      icon: <Shield size={18} className="text-rose-400" />,
      title: 'Security & Auth',
      items: [
        { label: 'System Access Key', type: 'password', value: 'super-secret-key-for-jwt-replace-in-prod', note: 'Backend authentication token' },
        { label: 'Token Expiry',   type: 'input',    value: '60 min', note: 'JWT session lifetime' },
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto pb-20 space-y-8"
    >
      {/* Header */}
      <header>
        <h1 className="text-4xl font-black text-white tracking-tight">Settings</h1>
        <p className="text-slate-500 mt-2 font-medium">
          Configure your platform preferences and backend connection.
        </p>
      </header>

      {/* Sections */}
      {sections.map((sec, si) => (
        <motion.div
          key={sec.title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: si * 0.06 }}
          className="glass-panel overflow-hidden"
        >
          {/* Section Header */}
          <div className="flex items-center gap-3 px-7 py-5 border-b border-white/5">
            <div className="p-2 bg-slate-800 rounded-xl">{sec.icon}</div>
            <h2 className="font-black text-white">{sec.title}</h2>
          </div>

          {/* Items */}
          <div className="divide-y divide-white/5">
            {sec.items.map((item, ii) => (
              <div key={ii} className="flex items-center justify-between gap-6 px-7 py-5">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-200">{item.label}</p>
                  {item.note && <p className="text-[11px] text-slate-500 mt-0.5">{item.note}</p>}
                </div>

                {item.type === 'toggle' && (
                  <button
                    onClick={() => toggle(item.key)}
                    className={`flex items-center gap-2 text-xs font-black transition-colors ${prefs[item.key] ? 'text-brand-400' : 'text-slate-500'}`}
                  >
                    {prefs[item.key]
                      ? <ToggleRight size={28} className="text-brand-400" />
                      : <ToggleLeft  size={28} className="text-slate-600" />}
                  </button>
                )}

                {item.type === 'input' && (
                  <input
                    defaultValue={item.value}
                    onChange={e => item.onChange?.(e.target.value)}
                    className="w-56 bg-slate-800 border border-white/10 focus:border-brand-500 focus:outline-none rounded-xl px-4 py-2 text-sm text-white font-mono transition-colors"
                  />
                )}

                {item.type === 'password' && (
                  <input
                    defaultValue={item.value}
                    type="password"
                    className="w-56 bg-slate-800 border border-white/10 focus:border-brand-500 focus:outline-none rounded-xl px-4 py-2 text-sm text-white font-mono transition-colors"
                  />
                )}

                {item.type === 'select' && (
                  <select
                    value={item.value}
                    onChange={e => item.onChange?.(e.target.value)}
                    className="bg-slate-800 border border-white/10 text-sm text-white font-bold focus:outline-none rounded-xl px-4 py-2 transition-colors"
                  >
                    {item.options.map(o => (
                      <option key={o.v} value={o.v}>{o.l}</option>
                    ))}
                  </select>
                )}

                {item.type === 'badge' && (
                  <span className="px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-black">
                    {item.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className={`flex items-center gap-3 px-8 py-3.5 rounded-xl font-black text-sm transition-all shadow-lg ${
            saved
              ? 'bg-emerald-500 text-white shadow-emerald-500/20'
              : 'bg-brand-500 hover:bg-brand-400 text-slate-950 shadow-brand-500/20 active:scale-95'
          }`}
        >
          {saved ? <><Check size={18}/> Saved!</> : <><Save size={18}/> Save Changes</>}
        </button>
      </div>
    </motion.div>
  );
}
