'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    name: 'Immunity',
    description: 'Boost your natural defenses',
    href: '/shop?category=immunity',
    color: 'from-amber-400 to-orange-500',
  },
  {
    name: 'Sleep',
    description: 'Restful, restorative sleep',
    href: '/shop?category=sleep',
    color: 'from-indigo-400 to-purple-600',
  },
  {
    name: 'Energy',
    description: 'Sustained vitality',
    href: '/shop?category=energy',
    color: 'from-emerald-400 to-teal-600',
  },
  {
    name: 'Mood & Stress',
    description: 'Calm mind, balanced mood',
    href: '/shop?category=mood',
    color: 'from-rose-400 to-pink-600',
  },
  {
    name: 'Digestive',
    description: 'Gut health support',
    href: '/shop?category=digestive',
    color: 'from-cyan-400 to-blue-600',
  },
];

export default function ProductCategories() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find the right support for your wellness goals with our curated collections.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={cat.href}
                className="block group h-full p-8 rounded-[32px] bg-[#FDF7FA] border border-[#6B2C58]/5 hover:border-[#6B2C58]/20 hover:bg-white shadow-sm hover:shadow-[0_20px_40px_rgba(107,44,88,0.1)] transition-all duration-500 overflow-hidden relative"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} mb-6 shadow-lg shadow-black/5 group-hover:scale-110 transition-transform duration-500`}
                />
                <h3 className="text-xl font-extrabold text-gray-900 mb-2 group-hover:text-[#6B2C58] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">{cat.description}</p>
                <span className="inline-flex items-center gap-2 text-[#6B2C58] font-black text-xs tracking-widest uppercase">
                  Explore <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>

                {/* Decorative background element */}
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#6B2C58]/5 rounded-full blur-3xl group-hover:bg-[#6B2C58]/10 transition-colors" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
