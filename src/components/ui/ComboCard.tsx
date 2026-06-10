'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface ComboCardProps {
  title: string;
  image: string;
  gradient: string;
  href: string;
  index: number;
}

export default function ComboCard({ title, image, gradient, href, index }: ComboCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative group"
    >
      <Link href={href} className="block">
        <div className={`aspect-[1.18/1] rounded-[2.5rem] bg-gradient-to-b ${gradient} overflow-hidden relative shadow-[0_15px_30px_rgba(0,0,0,0.08)] group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] transition-all duration-500 transform group-hover:-translate-y-1`}>
          {/* Card Title */}
          <h3 className="absolute top-6 left-6 right-6 text-white text-lg md:text-xl font-extrabold tracking-tight whitespace-pre-line leading-[1.25] z-10">
            {title}
          </h3>

          {/* Product Image - Bottom Centered */}
          <div className="absolute bottom-0 left-4 right-4 top-16 flex items-end justify-center overflow-hidden">
            <div className={`relative w-[90%] h-[95%] transition-transform duration-500 group-hover:scale-105 ${
              image.includes('combo3') ? 'translate-y-[-7%]' : 'translate-y-[8%]'
            }`}>
              <img
                src={image}
                alt={title.replace('\n', ' ')}
                className="absolute inset-0 w-full h-full object-contain object-bottom"
              />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

