'use client';

import { Search, Package } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[32px] p-8 md:p-16 shadow-xl border border-slate-100 text-center"
        >
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Package className="h-10 w-10" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Track Your Order</h1>
          <p className="text-gray-600 mb-12">Enter your Order ID and Phone Number to get real-time updates.</p>

          <div className="space-y-6 text-left">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Order ID</label>
              <input
                type="text"
                placeholder="e.g. #ORD123456"
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number / Email</label>
              <input
                type="text"
                placeholder="Enter registered detail"
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
              />
            </div>
            <button className="w-full py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg flex items-center justify-center gap-2">
              Track Order <Search className="h-4 w-4" />
            </button>
          </div>
          
          <p className="mt-8 text-sm text-gray-500">
            Having trouble? <a href="/contact" className="text-emerald-600 font-bold hover:underline">Contact Support</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
