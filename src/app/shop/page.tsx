'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Filter, Search, X } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';

import { Product } from '@/types/product';
import { fallbackProducts } from '@/lib/fallbackProducts';

const CATEGORIES = ['all', 'immunity', 'sleep', 'energy', 'mood', 'digestive', 'combo'];
const BENEFITS = ['immune', 'sleep', 'energy', 'mood', 'digestive', 'vitamins'];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(categoryParam || 'all');
  const [benefit, setBenefit] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (categoryParam) setCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category && category !== 'all') params.set('category', category);
    if (benefit) params.set('benefit', benefit);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);

    fetch(`${API_BASE}/api/products?${params}`)
      .then((res) => {
        if (!res.ok) throw new Error('API Error');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        } else {
          throw new Error('Empty DB');
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback local filtering if DB is not connected
        let filteredFallback = fallbackProducts as Product[];
        if (category && category !== 'all') {
          filteredFallback = filteredFallback.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
        }
        if (benefit) {
          filteredFallback = filteredFallback.filter(p => p.benefits?.some(b => b.toLowerCase().includes(benefit.toLowerCase())));
        }
        if (minPrice) {
          filteredFallback = filteredFallback.filter(p => p.price >= Number(minPrice));
        }
        if (maxPrice) {
          filteredFallback = filteredFallback.filter(p => p.price <= Number(maxPrice));
        }
        setProducts(filteredFallback);
        setLoading(false);
      });
  }, [category, benefit, minPrice, maxPrice]);

  const allowedSlugs = [
    // 4 Our Bestsellers
    'u-fit',
    'fit-flex',
    'shilajit-gold',
    'mass-builder',
    // 4 Best Seller Combos
    'pro-hair-skin-combo',
    'the-confidence-combo',
    'just-lose-it-combo',
    'great-looks-energy-bundle',
    // 4 Explore Combos
    'look-good-feel-good-combo',
    'stress-free-sleep-combo',
    'period-pain-relief',
    'night-relief-gummies',
    'glow-berry-gummies'
  ];

  const filtered = products.filter((p) => {
    // Keep only allowed slugs
    const slugKey = p.slug.replace('-static', '');
    const isAllowed = allowedSlugs.includes(slugKey);
      
    if (!isAllowed) return false;

    return search
      ? p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.toLowerCase().includes(search.toLowerCase())
      : true;
  });

  const clearFilters = () => {
    setCategory('all');
    setBenefit('');
    setMinPrice('');
    setMaxPrice('');
    setSearch('');
  };

  const hasFilters = category !== 'all' || benefit || minPrice || maxPrice || search;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Shop Wellness Products
          </h1>
          <p className="text-gray-600">
            Premium gummies and supplements for your everyday wellness.
          </p>
        </motion.header>

        {/* Search & Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-4 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors sm:hidden"
            >
              <Filter className="h-5 w-5" />
              Filters
            </button>
          </div>

          <motion.div
            initial={false}
            animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-white rounded-xl border border-slate-100">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Benefit</label>
                <select
                  value={benefit}
                  onChange={(e) => setBenefit(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">All</option>
                  {BENEFITS.map((b) => (
                    <option key={b} value={b}>
                      {b.charAt(0).toUpperCase() + b.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Price (₹)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (₹)</label>
                <input
                  type="number"
                  placeholder="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </motion.div>

          <div className="hidden lg:flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Category:</span>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === c
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                <X className="h-4 w-4" />
                Clear filters
              </button>
            )}
          </div>
        </motion.div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <div key={i} className="aspect-[3/4] bg-slate-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-600 text-lg">No products found. Try adjusting your filters.</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-emerald-600 font-medium hover:text-emerald-700"
            >
              Clear all filters
            </button>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4"
          >
            {filtered.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} showQuickAdd />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="h-10 w-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
