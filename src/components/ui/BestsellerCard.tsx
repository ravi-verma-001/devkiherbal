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
      className="group relative flex flex-col h-full bg-[#f3f3f3] rounded-[24px] p-3"
    >
      <Link href={`/product/${product.slug}`} className="flex flex-col flex-1">
        {/* Image Container */}
        <div className={`relative aspect-square w-full bg-white rounded-[20px] overflow-hidden ${product.slug === 'shilajit-gold' ? 'p-0' : ''}`}>
          <img
            src={image}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${product.slug === 'shilajit-gold' ? 'object-contain scale-[1.25] group-hover:scale-[1.3]' : ''}`}
            loading="eager"
          />
        </div>
        
        {/* Details */}
        <div className="pt-4 pb-2 flex-1 flex flex-col px-1">
          {/* Title */}
          <h3 className="text-[24px] font-black text-black leading-[1.15] mb-2 line-clamp-2">
            {product.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2.5">
            <Star className="h-4 w-4 text-[#fbbc04] fill-[#fbbc04] stroke-none" />
            <span className="text-[14px] text-gray-500 font-bold">
              {product.rating}/5({product.reviewCount || 1142})
            </span>
          </div>

          {/* Price */}
          <div className="text-[19px] font-black text-black mb-3">
            Rs. {product.price}
          </div>
        </div>
      </Link>

      <button
        onClick={handleAddToCart}
        className="w-full mt-1 bg-black hover:bg-gray-800 text-white font-extrabold py-4 rounded-[16px] text-[13px] md:text-[14px] uppercase tracking-wider transition-all active:scale-95"
      >
        ADD TO CART
      </button>
    </motion.div>
  );
}
