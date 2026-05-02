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
  const { addItem } = useCart();
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
        
        <Image
          src={image}
          alt={product.name}
          fill
          className="object-contain p-8 transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 25vw"
          priority={index < 4}
          unoptimized={true}
        />
      </Link>

      <div className="p-6 flex flex-col flex-1">
        <div className="mb-4">
          <p className="text-[10px] font-black text-[#6B2C58] tracking-widest uppercase mb-1.5 opacity-70">
            {product.category}
          </p>
          <h3 className="text-xl font-extrabold text-gray-900 leading-tight group-hover:text-[#6B2C58] transition-colors">
            {product.name}
          </h3>
        </div>
        
        <div className="flex items-center gap-2 mb-6">
          <div className="flex bg-amber-50 px-2 py-0.5 rounded-full items-center gap-1">
            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
            <span className="text-[11px] font-black text-amber-700">
              {product.rating}
            </span>
          </div>
          <span className="text-[11px] font-bold text-gray-400">
            ({product.reviewCount?.toLocaleString() || '1,000+'} reviews)
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Price</p>
            <p className="text-xl font-black text-gray-900">
              {formatCurrency(product.price)}
            </p>
          </div>
          
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-black text-white py-4 rounded-2xl font-black text-[11px] tracking-widest uppercase hover:bg-[#6B2C58] transition-all duration-300 shadow-sm hover:shadow-lg active:scale-95"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
}
