'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShieldCheck, Moon, Zap, Sparkles, Activity, ArrowRight } from 'lucide-react';

const categories = [
  {
    name: 'Immunity',
    description: 'Boost your natural defenses',
    href: '/shop?category=immunity',
    color: 'from-amber-400 to-orange-500',
    icon: ShieldCheck,
  },
  {
    name: 'Sleep',
    description: 'Restful, restorative sleep',
    href: '/shop?category=sleep',
    color: 'from-indigo-400 to-purple-600',
    icon: Moon,
  },
  {
    name: 'Energy',
    description: 'Sustained vitality',
    href: '/shop?category=energy',
    color: 'from-emerald-400 to-teal-600',
    icon: Zap,
  },
  {
    name: 'Mood & Stress',
    description: 'Calm mind, balanced mood',
    href: '/shop?category=mood',
    color: 'from-rose-400 to-pink-600',
    icon: Sparkles,
  },
  {
    name: 'Digestive',
    description: 'Gut health support',
    href: '/shop?category=digestive',
    color: 'from-cyan-400 to-blue-600',
    icon: Activity,
  },
];

export default function ProductCategories() {
  return (
    <section className="pt-14 pb-20 bg-gradient-to-b from-white via-white to-[#FDFBFD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-3 tracking-tight">
            Shop by Category
          </h2>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-medium">
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
                className="block group h-full p-8 rounded-[28px] bg-white border border-slate-100 hover:border-transparent hover:shadow-[0_24px_50px_-12px_rgba(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
              >
                {/* Floating blur glow spot on card top hover */}
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-12 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-15 blur-xl transition-all duration-300`} />
                
                {/* Custom Gradient Icon Container */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} mb-6 flex items-center justify-center text-white shadow-[0_8px_20px_-6px_rgba(0,0,0,0.15)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <cat.icon className="w-6.5 h-6.5" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-black transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[14px] text-gray-500 mb-6 leading-relaxed font-medium">
                  {cat.description}
                </p>
                <span className="inline-flex items-center gap-2 text-gray-900 font-bold text-[13px] tracking-wider uppercase group-hover:underline decoration-1 decoration-gray-900 underline-offset-4">
                  Explore <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                </span>

                {/* Subtle bottom gradient slide-indicator */}
                <div className={`absolute bottom-0 left-8 right-8 h-[3px] rounded-t-full bg-gradient-to-r ${cat.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
