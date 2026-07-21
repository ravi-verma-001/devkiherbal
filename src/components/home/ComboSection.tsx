'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import ComboCard from '../ui/ComboCard';

const combos = [
  {
    title: 'Pro Skin and Hair\nCombo',
    image: '/banner/combo1.png',
    gradient: 'from-[#655b70] via-[#857991] to-[#dedce2]',
    href: '/shop?category=combo',
  },
  {
    title: 'Beauty Sleep\nCombo',
    image: '/banner/combo2.png?v=2',
    gradient: 'from-[#545e77] via-[#75809b] to-[#dfecf8]',
    href: '/shop?category=combo',
  },
  {
    title: 'Look Good Feel Good\nCombo',
    image: '/banner/combo-feel-good.jpeg',
    gradient: 'from-[#6b5372] via-[#8c7493] to-[#ebdff0]',
    href: '/shop?category=combo',
  },
  {
    title: 'Stress-Free Sleep\nCombo',
    image: '/banner/combo3.png',
    gradient: 'from-[#4e5b66] via-[#758491] to-[#e3ecf5]',
    href: '/shop?category=combo',
  },
];

export default function ComboSection() {
  return (
    <section className="pt-12 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Explore combos
          </h2>
          
          <div className="flex justify-center mb-12">
            <Link
              href="/shop?category=combo"
              className="px-6 py-2 border border-[#8C3A6C] rounded-full text-[14px] font-bold text-[#8C3A6C] hover:bg-[#8C3A6C]/5 transition-all"
            >
              Explore All
            </Link>
          </div>
        </motion.div>

        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 md:grid md:grid-cols-4 md:gap-4 [&>div]:min-w-[280px] md:[&>div]:min-w-0 [&>div]:snap-center scrollbar-hide">
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

