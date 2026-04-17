import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Search, Globe, ChevronRight, CheckCircle2, AlertCircle, Loader2, Star, Database } from 'lucide-react';

const API_BASE = '/api_internal';

const CATEGORIES = [
  { label: "Smartphones", value: "smartphones", icon: "📱" },
  { label: "Accessories", value: "accessories", icon: "🎧" },
  { label: "Laptops", value: "laptops", icon: "💻" },
  { label: "General", value: "general", icon: "📦" },
];

export default function Scraper() {
  const navigate = useNavigate();
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('general');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [progress, setProgress] = useState('');

  const handleScrape = async () => {
    if (!productName.trim()) {
      setStatus({
        type: 'error',
        message: 'Please enter a product name.'
      });
      return;
    }

    setLoading(true);
    setStatus(null);
    setProgress('Initializing scraper...');

    try {
      setProgress('Connecting to data sources...');

      const response = await axios.post(
        `${API_BASE}/advanced/scrape`,
        {
          product_name: productName.trim(),
          category: category,
          url: null
        },
        { timeout: 120000 }
      );

      setProgress('Processing reviews...');

      if (response.data.status === 'success') {
        const reviewsBatch = response.data.reviews || [];
        setStatus({
          type: 'success',
          message: `✓ Successfully acquired ${response.data.reviews_added} real reviews from: ${(response.data.sources || []).join(', ')}`,
          reviews: reviewsBatch,
          stats: {
            total: response.data.reviews_added,
            sources: response.data.sources
          }
        });
        setProgress('');
      } else {
        setStatus({
          type: 'error',
          message: response.data.message || 'Scraping failed. Please try a different product.'
        });
      }
    } catch (error) {
      console.error("Scraping Error:", error);
      setStatus({
        type: 'error',
        message: `Connection error: ${error.message}. Ensure backend is running at http://localhost:8001`
      });
    } finally {
      setLoading(false);
      setProgress('');
    }
  };

  const handleQuickScrape = (product, cat) => {
    setProductName(product);
    setCategory(cat);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto"
    >
      {/* Header */}
      <header className="mb-10 text-center">
        <div className="inline-block p-4 rounded-3xl bg-brand-500/10 border border-brand-500/30 mb-6 text-brand-400">
          <Globe size={40} />
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight">Market Data Harvester</h1>
        <p className="text-slate-400 mt-3 text-lg">
          Extract real-world reviews from verified data sources instantly.
        </p>
      </header>

      {/* Main Panel */}
      <div className="glass-panel p-8 space-y-8">
        {/* Product Input Section */}
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                Product Name
              </label>
              <input
                type="text"
                value={productName}
                onChange={e => setProductName(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleScrape()}
                placeholder="e.g., iPhone 15 Pro, Sony Headphones..."
                className="w-full glass-input"
              />
              <p className="text-xs text-slate-500 mt-1">Enter any product to scrape real reviews</p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full glass-input"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-1">Helps filter real-world data</p>
            </div>
          </div>

          {/* Execute Button */}
          <button
            onClick={handleScrape}
            disabled={loading || !productName.trim()}
            className="w-full h-14 bg-brand-500 hover:bg-brand-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-brand-500/20 transition-all active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Harvesting Data</span>
              </>
            ) : (
              <>
                <Search size={20} />
                <span>Execute Live Scrape</span>
              </>
            )}
          </button>

          {progress && (
            <div className="text-center text-sm text-brand-400 animate-pulse">
              {progress}
            </div>
          )}
        </div>

        {/* Quick Examples */}
        <div className="border-t border-white/10 pt-8">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">
            Quick Examples
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: "iPhone 15", cat: "smartphones" },
              { name: "Sony Headphones", cat: "accessories" },
              { name: "MacBook Pro", cat: "laptops" },
              { name: "Samsung TV", cat: "general" }
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickScrape(item.name, item.cat)}
                disabled={loading}
                className="p-3 bg-slate-900/50 hover:bg-slate-800/80 border border-white/10 hover:border-brand-500/30 rounded-xl text-xs font-semibold text-white transition-all disabled:opacity-50"
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* Status and Results */}
        {status && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 border-t border-white/10 pt-8"
          >
            {/* Status Alert */}
            <div className={`p-6 rounded-2xl border flex gap-4 ${
              status.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            }`}>
              {status.type === 'success' ? (
                <CheckCircle2 className="flex-shrink-0 mt-1" size={20} />
              ) : (
                <AlertCircle className="flex-shrink-0 mt-1" size={20} />
              )}
              <div className="flex-1">
                <p className="font-bold">
                  {status.type === 'success' ? '✓ Harvest Complete' : '✗ Harvest Failed'}
                </p>
                <p className="text-sm opacity-90 mt-1">{status.message}</p>
              </div>
            </div>

            {/* Review Preview */}
            {status.type === 'success' && status.reviews && (
              <div className="glass-panel p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database size={16} className="text-brand-400" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">
                      Real Data Preview ({status.stats.total} total)
                    </h3>
                  </div>
                  <button
                    onClick={() => navigate('/insights')}
                    className="text-[10px] font-black uppercase tracking-tighter text-brand-400 hover:text-brand-300 transition-colors"
                  >
                    View Full Analysis →
                  </button>
                </div>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {status.reviews.map((review, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-4 bg-slate-900/50 rounded-xl border border-white/5 hover:border-brand-500/30 transition-all space-y-2 group"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <p className="text-xs font-black text-white">{review.reviewer_name}</p>
                          <p className="text-[10px] text-slate-500 mt-1">{review.source}</p>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              fill={i < review.rating ? "#eab308" : "none"}
                              stroke={i < review.rating ? "#eab308" : "#475569"}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 italic leading-relaxed">
                        "{review.review_text}"
                      </p>
                      <div className="flex gap-2 pt-2">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                          review.sentiment === 'Positive' ? 'bg-emerald-500/20 text-emerald-400' :
                          review.sentiment === 'Negative' ? 'bg-rose-500/20 text-rose-400' :
                          'bg-slate-500/20 text-slate-400'
                        }`}>
                          {review.sentiment}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Confidence: {(review.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Data Sources Info */}
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">
            Real Data Sources
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm text-slate-300">
              <ChevronRight size={14} className="text-brand-500 flex-shrink-0 mt-0.5" />
              <span><strong>Verified Public Datasets</strong> - Curated from real product reviews across multiple verified sources</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-300">
              <ChevronRight size={14} className="text-brand-500 flex-shrink-0 mt-0.5" />
              <span><strong>GitHub Issues & Discussions</strong> - Real user feedback and bug reports from actual projects</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-300">
              <ChevronRight size={14} className="text-brand-500 flex-shrink-0 mt-0.5" />
              <span><strong>HackerNews Communities</strong> - Genuine tech reviews and community discussions</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-300">
              <ChevronRight size={14} className="text-brand-500 flex-shrink-0 mt-0.5" />
              <span><strong>Public RSS Feeds</strong> - Real-time news and product reviews from trusted publications</span>
            </li>
          </ul>
          <div className="mt-4 p-3 bg-brand-500/10 border border-brand-500/20 rounded-lg">
            <p className="text-xs text-brand-300">
              ⚡ All data is 100% real and verified. No synthetic or dummy data used.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
