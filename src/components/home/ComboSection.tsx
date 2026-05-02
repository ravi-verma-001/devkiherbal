'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import ComboCard from '../ui/ComboCard';

const combos = [
  {
    title: 'FIT FLEX AND U-FIT COMBO',
    image: '/banner/combo-skin-hair.jpeg',
    gradient: 'from-pink-100 to-purple-200',
    href: '/shop?category=combo',
  },
  {
    title: 'MASS GAINER & BUILDER COMBO',
    image: '/banner/combo-beauty-sleep.jpeg',
    gradient: 'from-blue-100 to-indigo-200',
    href: '/shop?category=combo',
  },
  {
    title: 'Shilajit and Beauty Gummies Combo',
    image: '/banner/combo-feel-good.jpeg',
    gradient: 'from-gray-100 to-slate-300',
    href: '/shop?category=combo',
  },
  {
    title: 'Periods Pain Relief and Night Relief Gummies',
    image: '/banner/Stress-Free Sleep Combo.jpeg',
    gradient: 'from-indigo-100 to-blue-200',
    href: '/shop?category=combo',
  },
];

export default function ComboSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tighter uppercase">
            Explore combos
          </h2>
          
          <div className="flex justify-center mb-12">
            <Link
              href="/shop?category=combo"
              className="px-8 py-2.5 bg-[#6B2C58] rounded-full text-sm font-black text-white hover:bg-[#5a244a] transition-colors shadow-md uppercase tracking-widest"
            >
              Explore All
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {combos.map((combo, index) => (
            <ComboCard
              key={index}
              title={combo.title}
              image={combo.image}
              gradient={combo.gradient}
              href={combo.href}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
