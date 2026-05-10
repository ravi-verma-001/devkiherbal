'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const blogPosts = [
  {
    id: 1,
    title: 'The Benefits of Shilajit for Energy and Stamina',
    excerpt: 'Discover why this ancient Ayurvedic superfood is gaining popularity in the modern world.',
    date: 'May 10, 2026',
    image: '/banner/product8.png',
  },
  {
    id: 2,
    title: '5 Tips for Better Sleep Naturally',
    excerpt: 'Simple lifestyle changes and natural supplements that can help you drift off faster.',
    date: 'May 05, 2026',
    image: '/banner/product5.jpeg',
  },
  {
    id: 3,
    title: 'Understanding Gut Health: Why it Matters',
    excerpt: 'Your gut is your second brain. Learn how to keep it happy and healthy.',
    date: 'April 28, 2026',
    image: '/banner/product7.jpeg',
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 uppercase tracking-tighter">Wellness Blog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Insights, tips, and guides to help you live your best healthy life.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 group"
            >
              <div className="aspect-video bg-slate-200 overflow-hidden relative">
                {/* Fallback color/pattern if image missing */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-blue-100" />
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 relative z-10 opacity-80"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              </div>
              <div className="p-8">
                <span className="text-sm font-bold text-emerald-600 uppercase tracking-widest">{post.date}</span>
                <h2 className="text-2xl font-black text-gray-900 mt-2 mb-4 leading-tight group-hover:text-[#6B2C58] transition-colors">{post.title}</h2>
                <p className="text-gray-600 mb-6 line-clamp-2">{post.excerpt}</p>
                <Link href="#" className="font-black text-sm uppercase tracking-widest text-gray-900 hover:text-[#6B2C58] transition-colors inline-flex items-center gap-2">
                  Read More <span className="text-lg">→</span>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
