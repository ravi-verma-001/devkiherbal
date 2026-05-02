'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
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
      <Link href={href} className="block group">
        <div className={`aspect-square rounded-[1.5rem] md:rounded-[2.5rem] bg-gradient-to-br ${gradient} p-4 md:p-8 overflow-hidden relative shadow-lg group-hover:shadow-2xl transition-all duration-500`}>
          {/* Card Title */}
          <h3 className="text-lg md:text-3xl font-black text-white leading-tight drop-shadow-md z-10 relative max-w-[90%] md:max-w-[80%]">
            {title}
          </h3>

          {/* Product Image */}
          <div className="absolute bottom-0 left-0 right-0 h-3/5 w-full transition-transform duration-500 group-hover:scale-110">
            <div className="relative w-full h-full">
              <Image
                src={image}
                alt={title}
                fill
                className="object-contain object-bottom mix-blend-multiply"
              />
            </div>
          </div>
          
          {/* Subtle Glow Effect on Hover */}
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </Link>
    </motion.div>
  );
}
