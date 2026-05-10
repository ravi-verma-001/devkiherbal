'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/utils/format';

interface BestsellerCardProps {
  product: {
    _id: string;
    name: string;
    slug: string;
    price: number;
    originalPrice?: number;
    images: string[];
    category: string;
    rating: number;
    reviewCount?: number;
    benefits?: string[];
  };
  index?: number;
}

const placeholderImage = 'https://images.unsplash.com/photo-1550572017-edd951aa81a2?w=500&h=500&fit=crop';

export default function BestsellerCard({ product, index = 0 }: BestsellerCardProps) {
  const { addItem, setIsCartOpen } = useCart();
  const image = product.images?.[0] || placeholderImage;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      _id: product._id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image,
      category: product.category,
    }, 1);
    setIsCartOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative flex flex-col h-full bg-white rounded-[40px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100"
    >
      {/* Bestseller Badge */}
      <div className="absolute top-5 left-5 z-10">
        <div className="px-3 py-1 bg-black/80 backdrop-blur-md rounded-full">
          <p className="text-[10px] font-black text-white tracking-widest uppercase">
            Bestseller
          </p>
        </div>
      </div>

      <Link href={`/product/${product.slug}`} className="block relative aspect-[4/5] overflow-hidden bg-[#F8F9FA]">
        {/* Subtle background gradient splash */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#F1E4EE]/30 opacity-60" />
        
        <img
          src={image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-110"
          loading="eager"
        />
      </Link>

      <div className="p-4 md:p-6 flex flex-col flex-1">
        <div className="mb-2 md:mb-4">
          <p className="text-[9px] md:text-[10px] font-black text-[#6B2C58] tracking-widest uppercase mb-1 opacity-70">
            {product.category}
          </p>
          <h3 className="text-base md:text-xl font-extrabold text-gray-900 leading-tight group-hover:text-[#6B2C58] transition-colors line-clamp-2">
            {product.name}
          </h3>
        </div>
        
        <div className="flex items-center gap-1 md:gap-2 mb-4 md:mb-6">
          <div className="flex bg-amber-50 px-1.5 py-0.5 rounded-full items-center gap-1">
            <Star className="h-2.5 w-2.5 text-amber-500 fill-amber-500" />
            <span className="text-[10px] md:text-[11px] font-black text-amber-700">
              {product.rating}
            </span>
          </div>
          <span className="text-[10px] md:text-[11px] font-bold text-gray-400">
            ({product.reviewCount || '1k+'})
          </span>
        </div>

        <div className="mt-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4">
          <div className="flex flex-col">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Price</p>
            <p className="text-lg md:text-xl font-black text-gray-900">
              {formatCurrency(product.price)}
            </p>
          </div>
          
          <button
            onClick={handleAddToCart}
            className="w-full sm:flex-1 bg-black text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-[11px] tracking-widest uppercase hover:bg-[#6B2C58] transition-all duration-300 shadow-sm hover:shadow-lg active:scale-95"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
}
