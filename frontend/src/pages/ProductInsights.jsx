import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, Star, Brain, AlertTriangle, RefreshCw } from 'lucide-react';

const API_BASE = 'http://localhost:8001';

// No more hardcoded images, we use real product images from the data source
function getProductImage(product) {
  if (product.product_image && product.product_image !== '') return product.product_image;
  // fallback — seed from product name string for visual consistency
  const seed = encodeURIComponent(product.product_name.toLowerCase().replace(/\s+/g, ''));
  return `https://picsum.photos/seed/${seed}/160/120`;
}

export default function ProductInsights() {
  const [reviews, setReviews]               = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);
  const [search, setSearch]                 = useState('');
  const [filter, setFilter]                 = useState('All');

  const fetchReviews = () => {
    setLoading(true);
    setError(null);
    axios.get(`${API_BASE}/reviews/`, { timeout: 15000 })
      .then(res => {
        setReviews(res.data);
        setFilteredReviews(res.data);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message || 'Connection failed');
        setLoading(false);
      });
  };

  useEffect(() => { fetchReviews(); }, []);

  useEffect(() => {
    let result = reviews;
    if (search) {
      result = result.filter(r =>
        r.product_name.toLowerCase().includes(search.toLowerCase()) ||
        r.review_text.toLowerCase().includes(search.toLowerCase()) ||
        r.brand.toLowerCase().includes(search.toLowerCase()) ||
        r.category.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filter !== 'All') {
      result = result.filter(r => r.sentiment === filter);
    }
    setFilteredReviews(result);
  }, [search, filter, reviews]);

  if (loading) return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
      <div className="text-brand-500 animate-pulse font-black text-xs tracking-[0.3em] uppercase">
        Scanning Product Intelligence...
      </div>
    </div>
  );

  if (error) return (
    <div className="h-full flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-10 max-w-md w-full text-center space-y-5"
      >
        <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
          <AlertTriangle size={32} className="text-rose-400" />
        </div>
        <h2 className="text-xl font-black text-white">Backend Offline</h2>
        <p className="text-slate-400 text-sm">Start the backend server and try again.</p>
        <button onClick={fetchReviews}
          className="w-full flex items-center justify-center gap-2 py-3 bg-brand-500 hover:bg-brand-400 text-slate-950 font-black rounded-xl transition-all">
          <RefreshCw size={16}/> Retry
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Product Intelligence</h1>
          <p className="text-slate-500 mt-2 font-medium italic">
            Drill down into granular review data and neural extractions from Amazon, Flipkart, and more.
          </p>
        </div>

        <div className="flex bg-slate-900/50 p-2 rounded-2xl border border-white/5 shadow-inner gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search products or brands..."
              className="bg-transparent pl-12 pr-4 py-2 text-sm text-white focus:outline-none w-64"
            />
          </div>
          <div className="h-8 w-[1px] bg-white/10" />
          <select
            value={filter} onChange={e => setFilter(e.target.value)}
            className="bg-transparent text-sm text-brand-400 font-bold focus:outline-none pr-4"
          >
            <option value="All">All Sentiments</option>
            <option value="Positive">Positive Only</option>
            <option value="Negative">Negative Only</option>
            <option value="Neutral">Neutral Only</option>
          </select>
        </div>
      </header>

      {/* Stats bar */}
      <div className="flex flex-wrap gap-4 mb-4">
        <span className="px-4 py-1.5 rounded-full glass-panel text-[10px] font-black uppercase text-slate-400 border border-white/5">
          Reviews Scanned: <span className="text-white ml-1">{filteredReviews.length}</span>
        </span>
        <span className="px-4 py-1.5 rounded-full glass-panel text-[10px] font-black uppercase text-slate-400 border border-white/5">
          Data Freshness: <span className="text-emerald-400 ml-1">Real-time</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredReviews.map((review, i) => (
            <ReviewListItem key={review.id} review={review} index={i} />
          ))}
        </AnimatePresence>

        {filteredReviews.length === 0 && (
          <div className="p-20 text-center glass-panel border-dashed border-2 border-white/10">
            <Package size={48} className="text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 font-bold">No intelligence matches the current filter profile.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewListItem({ review, index }) {
  const sentimentColors = {
    Positive: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    Negative: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
    Neutral:  'text-slate-400 bg-slate-400/10 border-slate-400/20',
  };

  const imgSrc = getProductImage(review);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.04 }}
      className="glass-panel p-6 flex flex-col md:flex-row gap-6 items-start hover:border-brand-500/30 transition-all group overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Product Image */}
      <div className="flex-shrink-0 w-full md:w-40">
        <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-lg group-hover:border-white/20 transition-colors">
          <img
            src={imgSrc}
            alt={review.product_name}
            className="w-full h-24 md:h-[110px] object-cover transition-transform duration-700 group-hover:scale-110"
            onError={e => {
              e.target.onerror = null;
              e.target.src = `https://picsum.photos/seed/${review.id}/160/120`;
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
          {/* Rating badge */}
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-slate-900/90 backdrop-blur-sm px-2 py-0.5 rounded-lg border border-white/10">
            <Star size={10} fill="#eab308" stroke="#eab308" />
            <span className="text-[10px] font-black text-yellow-500">{review.rating}.0</span>
          </div>
          {/* Category mini-badge */}
          <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-brand-500/20 backdrop-blur-sm border border-brand-500/30 text-[8px] font-black text-brand-400 uppercase">
            {review.category}
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="w-full md:w-56 flex-shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{review.brand || 'Unbranded'}</span>
        </div>
        <h3 className="font-black text-white leading-tight text-base group-hover:text-brand-400 transition-colors">{review.product_name}</h3>
        
        <div className="flex items-center gap-1 mt-1.5 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={11}
              fill={i < review.rating ? '#eab308' : 'none'}
              stroke={i < review.rating ? '#eab308' : '#475569'}
            />
          ))}
        </div>

        {/* Source Attribution Badge */}
        <div className="mt-auto mb-3">
          <span className="px-2 py-1 rounded bg-slate-800 border border-white/5 text-[10px] font-bold text-slate-400 flex items-center gap-2 w-fit">
            <div className={`w-1.5 h-1.5 rounded-full ${review.source?.includes('Amazon') ? 'bg-orange-500' : review.source?.includes('Flipkart') ? 'bg-blue-500' : 'bg-brand-500'}`} />
            via {review.source || 'Aggregator'}
          </span>
        </div>

        {/* Aspect tags */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(review.aspects || {}).slice(0, 3).map(([aspect, sent]) => (
            <span key={aspect}
              className="text-[9px] uppercase font-black px-2 py-0.5 rounded bg-slate-800/80 border border-white/5 flex items-center gap-1.5">
              <div className={`w-1 h-1 rounded-full flex-shrink-0 ${sent === 'Positive' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'}`} />
              <span className="text-slate-300">{aspect}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Review Text */}
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-[10px] font-black text-brand-400">
            {review.reviewer_name?.charAt(0)}
          </div>
          <span className="text-xs font-bold text-slate-400">{review.reviewer_name}</span>
        </div>
        <p className="text-slate-200 leading-relaxed font-medium text-sm italic">
          "{review.review_text}"
        </p>
      </div>

      {/* ML Extraction Panel */}
      <div className="w-full md:w-52 flex-shrink-0 space-y-4 md:border-l md:border-white/5 md:pl-6">
        <div className={`px-4 py-2 rounded-xl border text-xs font-black text-center ${sentimentColors[review.sentiment] || sentimentColors.Neutral} shadow-lg`}>
          {review.sentiment?.toUpperCase()} CORE
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-[10px] font-bold">
            <span className="text-slate-500 uppercase tracking-widest">Confidence</span>
            <span className="text-brand-400 font-mono">{(review.confidence * 100).toFixed(1)}%</span>
          </div>
          <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${review.confidence * 100}%` }}
               transition={{ duration: 1 }}
               className="h-full bg-brand-400" 
            />
          </div>

          <div className="flex justify-between items-center text-[10px] font-bold">
            <span className="text-slate-500 uppercase tracking-widest">Authenticity</span>
            <span className={`${review.is_fake_score > 0.6 ? 'text-rose-500' : 'text-emerald-500'} font-mono`}>
              {((1 - review.is_fake_score) * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="pt-1">
          <div className="flex items-center gap-2 text-indigo-400">
            <Brain size={13} />
            <span className="text-[10px] font-black uppercase tracking-tighter capitalize">
              {review.emotion} detected
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

