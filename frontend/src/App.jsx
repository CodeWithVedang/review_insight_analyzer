import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Sparkles, LayoutDashboard, PackageSearch, Rocket,
  UserCircle, Menu, Settings, HelpCircle, LogOut,
  Globe, MessageSquare, BarChart3
} from 'lucide-react';
import Dashboard      from './pages/Dashboard';
import AILab          from './pages/AILab';
import LandingPage    from './pages/LandingPage';
import ProductInsights from './pages/ProductInsights';
import SettingsPage   from './pages/Settings';
import Resources      from './pages/Resources';
import Scraper        from './pages/Scraper';
import Chat           from './pages/Chat';
import Compare        from './pages/Compare';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location   = useLocation();
  const isLanding  = location.pathname === '/';
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (isLanding) {
    return (
      <main className="w-full">
        <PageTransitions />
      </main>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(o => !o)} />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'pl-72' : 'pl-20'}`}>
        {/* Top bar */}
        <header className="h-20 border-b border-white/5 backdrop-blur-md bg-slate-950/50 sticky top-0 z-40 flex items-center justify-between px-8 text-white">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(o => !o)}
              className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              Enterprise Intelligence
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-xs font-bold text-white">Administrator</span>
              <span className="text-[10px] text-brand-400 font-mono">ID: 882-VX-ML</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-indigo-500 p-[1px]">
              <div className="w-full h-full rounded-[11px] bg-slate-900 flex items-center justify-center overflow-hidden">
                <UserCircle className="text-slate-400" size={24} />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <PageTransitions />
        </main>
      </div>
    </div>
  );
}

function Sidebar({ isOpen, toggle }) {
  const location = useLocation();
  const active   = location.pathname;

  return (
    <aside className={`fixed top-0 left-0 h-full z-50 bg-slate-900 border-r border-white/5 transition-all duration-300 flex flex-col ${isOpen ? 'w-72' : 'w-20'}`}>
      {/* Logo */}
      <div className="h-20 flex items-center px-6 gap-4 border-b border-white/5">
        <div className="min-w-[40px] h-10 bg-brand-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20">
          <Sparkles className="text-white" size={20} />
        </div>
        {isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
            <span className="text-lg font-black text-white leading-none tracking-tight">InsightAI</span>
            <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mt-1">Core Engine</span>
          </motion.div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
        {/* Main */}
        {isOpen && <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-3 ml-4">Main</p>}
        <SidebarLink to="/dashboard" icon={<LayoutDashboard size={20}/>} text="Dashboard"    active={active === '/dashboard'} collapsed={!isOpen} />
        <SidebarLink to="/insights"  icon={<PackageSearch  size={20}/>} text="Product Intel" active={active === '/insights'}  collapsed={!isOpen} />
        <SidebarLink to="/compare"   icon={<BarChart3      size={20}/>} text="Benchmark"     active={active === '/compare'}   collapsed={!isOpen} />

        {/* Intelligence */}
        <div className="pt-6 pb-2">
          {isOpen && (
            <>
              <div className="h-[1px] bg-white/5 mx-2 mb-4" />
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-4">Intelligence</p>
            </>
          )}
        </div>
        <SidebarLink to="/scraper"   icon={<Globe          size={20}/>} text="Live Scraper"  active={active === '/scraper'}  collapsed={!isOpen} />
        <SidebarLink to="/chat"      icon={<MessageSquare size={20}/>} text="AI Agent"      active={active === '/chat'}     collapsed={!isOpen} />
        <SidebarLink to="/ai-lab"    icon={<Rocket         size={20}/>} text="AI Sandbox"    active={active === '/ai-lab'}    collapsed={!isOpen} />

        {/* Management */}
        <div className="pt-6 pb-2">
          {isOpen && (
            <>
              <div className="h-[1px] bg-white/5 mx-2 mb-4" />
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-4">Management</p>
            </>
          )}
        </div>
        <SidebarLink to="/settings" icon={<Settings   size={20}/>} text="Settings"  active={active === '/settings'} collapsed={!isOpen} />
        <SidebarLink to="/help"     icon={<HelpCircle size={20}/>} text="Resources" active={active === '/help'}     collapsed={!isOpen} />
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t border-white/5">
        <SidebarLink to="/" icon={<LogOut size={20}/>} text="Sign Out" active={false} collapsed={!isOpen} flavor="danger" />
      </div>
    </aside>
  );
}

function SidebarLink({ to, icon, text, active, collapsed, flavor = 'default' }) {
  const styles = {
    default: active
      ? 'bg-brand-500/10 text-brand-400 border-brand-500/50'
      : 'text-slate-400 hover:bg-white/5 border-transparent',
    danger: 'text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 border-transparent',
  };

  return (
    <Link
      to={to}
      className={`relative h-12 rounded-xl flex items-center transition-all border ${styles[flavor]} ${collapsed ? 'justify-center w-12 mx-auto' : 'px-4 gap-4 w-full'}`}
    >
      <span className={active && flavor === 'default' ? 'text-brand-400' : ''}>{icon}</span>
      {!collapsed && (
        <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-sm font-bold">
          {text}
        </motion.span>
      )}
      {active && !collapsed && flavor === 'default' && (
        <motion.div
          layoutId="active-pill"
          className="absolute right-2 w-1.5 h-1.5 rounded-full bg-brand-400 shadow-[0_0_8px_rgba(20,184,166,0.8)]"
        />
      )}
    </Link>
  );
}

function PageTransitions() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"          element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/insights"  element={<ProductInsights />} />
        <Route path="/ai-lab"    element={<AILab />} />
        <Route path="/settings"  element={<SettingsPage />} />
        <Route path="/help"      element={<Resources />} />
        <Route path="/scraper"   element={<Scraper />} />
        <Route path="/chat"      element={<Chat />} />
        <Route path="/compare"   element={<Compare />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
