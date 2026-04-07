import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import { LayoutDashboard, PackageSearch, MessageSquare, Sparkles, Search, TrendingUp, TrendingDown, Star, Beaker } from 'lucide-react';

const API_BASE = 'http://localhost:8001';

const COLORS = ['#10b981', '#f43f5e', '#64748b']; // Emrald, Rose, Slate
const RADIAN = Math.PI / 180;

// Custom Pie Label to make it look premium
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null; // Don't show tiny labels
  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-bold font-mono shadow-black drop-shadow-md">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [summary, setSummary] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [categories, setCategories] = useState({});
  const [activeCategory, setActiveCategory] = useState('All');
  const [productInsights, setProductInsights] = useState(null);

  useEffect(() => {
    fetchSummary();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      fetchProductInsights(selectedProduct);
    }
  }, [selectedProduct]);

  const fetchSummary = async () => {
    try {
      const res = await axios.get(`${API_BASE}/insights/overall/summary`);
      setSummary(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/products`);
      setProducts(res.data.products);
      setCategories(res.data.categories || {});
      
      const cats = Object.keys(res.data.categories || {});
      if (cats.length > 0) {
        const firstCat = cats[0];
        setActiveCategory(firstCat);
        setSelectedProduct(res.data.categories[firstCat]?.[0] || '');
      } else if (res.data.products.length > 0) {
        setSelectedProduct(res.data.products[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProductInsights = async (prod) => {
    if (!prod) return;
    try {
      setProductInsights(null); // Clear for loading state
      const res = await axios.get(`${API_BASE}/insights/${prod}`);
      setProductInsights(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  if (!summary) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-brand-500 font-bold">
       <Sparkles className="animate-spin mb-4" size={32} />
       <div className="text-xl animate-pulse tracking-widest text-slate-300">Initializing AI Models...</div>
    </div>
  );

  const pieData = Object.entries(summary.overall_sentiment).map(([key, value]) => ({ name: key, value }));

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-transparent">
      {/* Premium Sidebar */}
      <motion.aside 
        initial={{ x: -250, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-72 glass-sidebar p-8 flex flex-col gap-8 shadow-2xl shadow-black z-20"
      >
        <div className="flex items-center gap-4 group">
          <div className="p-3 bg-gradient-to-br from-brand-400 to-brand-600 text-white rounded-xl shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform">
            <Beaker size={24} />
          </div>
          <div>
             <h1 className="text-2xl font-black tracking-tight text-white m-0 leading-none">Review AI</h1>
             <p className="text-xs text-brand-400 font-medium tracking-widest uppercase mt-1">Intelligence</p>
          </div>
        </div>

        <nav className="flex flex-col gap-3 mt-4">
          <NavItem id="overview" current={activeTab} icon={<LayoutDashboard size={20} />} text="Dashboard" onClick={setActiveTab} />
          <NavItem id="products" current={activeTab} icon={<PackageSearch size={20} />} text="Product Insights" onClick={setActiveTab} />
          <NavItem id="demo" current={activeTab} icon={<Sparkles size={20} />} text="Live Predictor" onClick={setActiveTab} />
        </nav>

        <div className="mt-auto">
           <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 mt-auto items-center flex gap-4">
               <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300">
                  AI
               </div>
               <div>
                  <p className="text-sm font-bold text-slate-200">System Ready</p>
                  <p className="text-xs text-emerald-400 font-mono">Status: Online</p>
               </div>
           </div>
        </div>
      </motion.aside>

      {/* Main Area */}
      <main className="flex-1 p-10 overflow-y-auto relative container mx-auto">
        <header className="mb-12">
          <motion.h2 
             initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}}
             className="text-4xl font-extrabold mb-3 text-white tracking-tight"
          >
            {activeTab === 'overview' && 'Executive Overview'}
            {activeTab === 'products' && 'Product Intelligence'}
            {activeTab === 'demo' && 'Real-time AI Sandbox'}
          </motion.h2>
          <motion.p initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 0.1}} className="text-slate-400 text-lg max-w-2xl">
            {activeTab === 'overview' && 'High-level metrics and sentiment breakdowns extracted organically from your dataset.'}
            {activeTab === 'products' && 'Deep dive into specific products. Uncover what users love and what needs immediate attention.'}
            {activeTab === 'demo' && 'Test the NLP Model. Type any review and see if our AI grades it as Positive, Negative, or Neutral.'}
          </motion.p>
        </header>

        <AnimatePresence mode="wait">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -20 }}
           transition={{ duration: 0.3, ease: 'easeOut' }}
           key={activeTab}
           className="w-full pb-20"
        >
          {activeTab === 'overview' && (
            <div className="space-y-8 w-full max-w-7xl mx-auto">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 
                 <StatCard 
                    title="Total Reviews Analyzed" 
                    value={summary.total_reviews.toLocaleString()} 
                    icon={<search className="text-slate-400" />}
                    accent="bg-slate-800"
                    textColor="text-slate-100"
                 />
                 
                 <StatCard 
                    title="Most Loved Product" 
                    value={summary.most_positively_reviewed} 
                    icon={<TrendingUp size={24} className="text-emerald-400" />}
                    accent="bg-emerald-500/10 border-emerald-500/20"
                    textColor="text-emerald-400"
                 />

                 <StatCard 
                    title="Action Required" 
                    value={summary.most_negatively_reviewed} 
                    icon={<TrendingDown size={24} className="text-rose-400" />}
                    accent="bg-rose-500/10 border-rose-500/20"
                    textColor="text-rose-400"
                 />
                 
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                  <div className="glass-card p-8 h-[500px] flex flex-col">
                     <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-3"><PieChart size={24} className="text-brand-500" /> Sentiment Distribution</h3>
                     <div className="flex-1 min-h-0 relative">
                       <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                           <Pie 
                              data={pieData} 
                              cx="50%" cy="50%" 
                              innerRadius={110} 
                              outerRadius={150} 
                              paddingAngle={4} 
                              dataKey="value" 
                              labelLine={false}
                              label={renderCustomizedLabel}
                              stroke="none"
                           >
                             {pieData.map((entry, index) => (
                               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                             ))}
                           </Pie>
                           <Tooltip 
                              contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(51, 65, 85, 0.5)', borderRadius: '12px', backdropFilter: 'blur(8px)', color: 'white', fontWeight: 'bold' }} 
                              itemStyle={{ color: '#fff' }}
                           />
                         </PieChart>
                       </ResponsiveContainer>
                       {/* Center Label */}
                       <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                         <div className="text-center">
                            <h4 className="text-4xl font-black text-white">{summary.total_reviews}</h4>
                            <p className="text-sm text-slate-400 font-medium">Data Points</p>
                         </div>
                       </div>
                     </div>
                  </div>
                  <div className="glass-card p-8 h-[500px] flex flex-col">
                     <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-3"><BarChart size={24} className="text-brand-500" /> Average Rating per Product</h3>
                     <div className="flex-1 min-h-0 pt-4">
                       <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={Object.entries(summary.product_averages).map(([name, avg]) => ({name: name.split(' ')[0], rating: avg.toFixed(1)}))} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.5} />
                            <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#94a3b8', fontSize: 13, fontWeight: 500}} axisLine={{stroke: '#334155'}} tickLine={false} dy={10} />
                            <YAxis domain={[0, 5]} stroke="#64748b" tick={{fill: '#94a3b8', fontSize: 13}} axisLine={{stroke: '#334155'}} tickLine={false} dx={-10} />
                            <Tooltip 
                               cursor={{fill: 'rgba(51, 65, 85, 0.3)'}} 
                               contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(20, 184, 166, 0.5)', borderRadius: '12px', color: '#fff', borderTopWidth: '4px' }} 
                            />
                            <Bar dataKey="rating" fill="url(#colorUv)" radius={[6, 6, 0, 0]} maxBarSize={60} />
                            <defs>
                              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2dd4bf" stopOpacity={1}/>
                                <stop offset="95%" stopColor="#0d9488" stopOpacity={0.6}/>
                              </linearGradient>
                            </defs>
                          </BarChart>
                       </ResponsiveContainer>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-8 w-full max-w-7xl mx-auto">
               <div className="flex bg-slate-900/60 p-2 rounded-xl mb-6 shadow-inner border border-slate-800 backdrop-blur-sm self-start">
                  {Object.keys(categories).map(cat => (
                     <button
                        key={cat}
                        onClick={() => {
                           setActiveCategory(cat);
                           setSelectedProduct(categories[cat]?.[0] || '');
                        }}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeCategory === cat ? 'bg-brand-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
                     >
                        {cat}
                     </button>
                  ))}
               </div>

               <div className="flex flex-wrap gap-3 mb-4">
                 {(categories[activeCategory] || products).map((p, i) => (
                   <motion.button 
                     initial={{opacity:0, scale: 0.9}} animate={{opacity: 1, scale: 1}} transition={{delay: i * 0.05}}
                     key={p} 
                     onClick={() => setSelectedProduct(p)}
                     className={`px-5 py-3 rounded-xl text-sm font-bold transition-all border ${selectedProduct === p ? 'bg-brand-500 border-brand-400 text-white shadow-xl shadow-brand-500/30' : 'bg-slate-900/60 border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                   >
                     {p}
                   </motion.button>
                 ))}
               </div>
               
               {productInsights ? (
               <motion.div initial={{opacity:0}} animate={{opacity:1}} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 {/* Product Header Card */}
                 <div className="col-span-1 glass-card p-8 bg-gradient-to-br from-slate-900 to-slate-900 border-t-4 border-t-brand-500">
                    <h3 className="text-3xl font-extrabold text-white leading-tight">{productInsights.product_name}</h3>
                    <div className="mt-10 space-y-8">
                      <div className="p-5 rounded-2xl bg-slate-950/50 border border-slate-800/50 flex items-center justify-between">
                        <div>
                           <p className="text-sm text-slate-400 font-medium mb-1">Data Volume</p>
                           <p className="text-4xl font-black text-brand-400">{productInsights.total_reviews}</p>
                        </div>
                        <Search size={32} className="text-slate-700" />
                      </div>
                      <div className="p-5 rounded-2xl bg-slate-950/50 border border-slate-800/50 flex items-center justify-between">
                        <div>
                           <p className="text-sm text-slate-400 font-medium mb-1">Average Star Rating</p>
                           <div className="flex items-baseline gap-1">
                              <p className="text-4xl font-black text-amber-400">{productInsights.average_rating}</p>
                              <span className="text-xl text-slate-500 font-bold">/ 5.0</span>
                           </div>
                        </div>
                        <Star size={32} className="text-amber-500/50 fill-amber-500/20" />
                      </div>
                    </div>
                 </div>

                 {/* Top Features / Complaints */}
                 <div className="col-span-1 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="glass-card p-8 bg-gradient-to-b from-emerald-950/20 to-transparent">
                      <h4 className="text-emerald-400 font-bold mb-8 flex items-center gap-3 text-xl bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20"><Star className="fill-emerald-400 text-emerald-400" size={20} /> Loved by Users</h4>
                      <div className="space-y-5">
                         {Object.entries(productInsights.top_features).map(([word, count], i) => (
                           <div key={word} className="flex justify-between items-center text-sm group">
                              <div className="flex gap-4 items-center">
                                 <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-mono text-xs font-bold border border-emerald-500/20">{i+1}</span>
                                 <span className="text-slate-200 capitalize font-bold text-base">{word}</span>
                              </div>
                              <span className="text-emerald-300 font-mono text-sm group-hover:scale-110 transition-transform origin-right">
                                {count} 
                                <span className="text-xs text-slate-500 ml-1 font-sans">mentions</span>
                              </span>
                           </div>
                         ))}
                      </div>
                    </div>

                    <div className="glass-card p-8 bg-gradient-to-b from-rose-950/20 to-transparent">
                      <h4 className="text-rose-400 font-bold mb-8 flex items-center gap-3 text-xl bg-rose-500/10 p-4 rounded-xl border border-rose-500/20">⚠️ Core Complaints</h4>
                      <div className="space-y-5">
                         {Object.entries(productInsights.top_complaints).map(([word, count], i) => (
                           <div key={word} className="flex justify-between items-center text-sm group">
                              <div className="flex gap-4 items-center">
                                 <span className="w-6 h-6 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center font-mono text-xs font-bold border border-rose-500/20">{i+1}</span>
                                 <span className="text-slate-200 capitalize font-bold text-base">{word}</span>
                              </div>
                              <span className="text-rose-300 font-mono text-sm group-hover:scale-110 transition-transform origin-right">
                                {count} 
                                <span className="text-xs text-slate-500 ml-1 font-sans">mentions</span>
                              </span>
                           </div>
                         ))}
                      </div>
                    </div>
                 </div>
               </motion.div>
               ) : (
                  <div className="h-64 flex items-center justify-center text-slate-400">Loading Product Data...</div>
               )}
            </div>
          )}

          {activeTab === 'demo' && (
             <LiveDemo />
          )}

        </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// Subcomponents

function NavItem({ id, current, icon, text, onClick }) {
   const active = current === id;
   return (
      <button 
         onClick={() => onClick(id)} 
         className={`relative flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-300 overflow-hidden font-medium text-[15px] ${active ? 'text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
      >
         {active && <motion.div layoutId="navBg" className="absolute inset-0 bg-brand-500/20 border border-brand-500/50 rounded-xl" />}
         <span className="relative z-10">{icon}</span>
         <span className={`relative z-10 ${active ? 'font-bold' : ''}`}>{text}</span>
      </button>
   )
}

function StatCard({ title, value, icon, accent, textColor }) {
   return (
      <motion.div whileHover={{ y: -4 }} className={`glass-card p-8 flex flex-col justify-between ${accent}`}>
         <div className="flex justify-between items-start mb-6">
            <p className="text-slate-400 font-medium">{title}</p>
            <div className={`p-2 rounded-lg bg-slate-950/50 border border-slate-700/50`}>
               {icon}
            </div>
         </div>
         <p className={`text-4xl font-extrabold truncate ${textColor}`}>{value}</p>
      </motion.div>
   )
}


function LiveDemo() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testReview = async () => {
    if (!text) return;
    setLoading(true);
    setResult(null); // Clear previous
    setTimeout(async () => {
       try {
         const res = await axios.post(`${API_BASE}/analyze`, { review_text: text });
         setResult(res.data.sentiment_prediction);
       } catch (e) {
         console.error(e);
       }
       setLoading(false);
    }, 600); // Artificial delay to show loading animation
  }

  return (
    <div className="max-w-3xl mx-auto mt-10">
       <div className="glass-card p-10 bg-slate-900/40 border border-slate-700/50">
          <div className="text-center mb-10">
            <div className="inline-flex p-4 rounded-full bg-brand-500/10 mb-4 border border-brand-500/20">
               <Beaker size={32} className="text-brand-400" />
            </div>
            <h3 className="text-3xl font-extrabold text-white">Sentiment AI Lab</h3>
            <p className="text-slate-400 mt-2">Evaluate sentences using the Logistic Regression classifier immediately.</p>
          </div>
          
          <div className="relative">
             <textarea 
               rows={4}
               className="w-full bg-slate-950/80 border border-slate-700/80 rounded-2xl p-6 text-slate-100 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/50 transition-all resize-none placeholder:text-slate-600 text-lg shadow-inner"
               placeholder="Write a product review here... (e.g., 'The charging port broke after 2 days.')"
               value={text}
               onChange={(e) => setText(e.target.value)}
             />
             <div className="absolute right-4 bottom-4 text-xs text-slate-500 font-mono font-medium">
               {text.length} chars
             </div>
          </div>

          <div className="mt-8 text-center">
             <button 
                onClick={testReview}
                disabled={loading || !text.trim()}
                className="bg-brand-500 hover:bg-brand-400 text-slate-950 px-10 py-4 rounded-xl font-black text-lg transition-all active:scale-95 shadow-[0_0_40px_-5px_rgba(20,184,166,0.3)] disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none flex items-center justify-center gap-3 mx-auto"
             >
                {loading ? <Sparkles className="animate-spin" /> : <Sparkles />}
                {loading ? 'Processing NLP...' : 'Run Analysis'}
             </button>
          </div>

          <AnimatePresence>
          {result && (
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               transition={{ type: "spring", bounce: 0.5 }}
               className={`mt-10 p-8 rounded-2xl border-2 flex items-center gap-6 justify-center text-center relative overflow-hidden
                  ${result === 'Positive' ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400 shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)]' : 
                  result === 'Negative' ? 'bg-rose-950/40 border-rose-500/50 text-rose-400 shadow-[0_0_50px_-12px_rgba(244,63,94,0.3)]' : 
                  'bg-slate-900 border-slate-600 text-slate-300'}`}
             >
                <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full opacity-20 pointer-events-none
                   ${result === 'Positive' ? 'bg-emerald-500' : result === 'Negative' ? 'bg-rose-500' : 'bg-slate-500'}
                `} />

                <div className="flex items-center gap-6">
                   <div className={`text-6xl`}>
                      {result === 'Positive' ? '✨' : result === 'Negative' ? '🚩' : '⚖️'}
                   </div>
                   <div className="text-left">
                     <span className="block text-sm uppercase tracking-widest font-bold opacity-70 mb-1">AI Verdict</span>
                     <span className="font-black text-4xl tracking-tight">{result}</span>
                   </div>
                </div>
             </motion.div>
          )}
          </AnimatePresence>
       </div>
    </div>
  )
}

export default App;
