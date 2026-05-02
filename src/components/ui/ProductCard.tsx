'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/utils/format';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    slug: string;
    price: number;
    originalPrice?: number;
    images: string[];
    category: string;
    rating: number;
    benefits?: string[];
  };
  index?: number;
  showQuickAdd?: boolean;
}

const placeholderImage = 'https://images.unsplash.com/photo-1550572017-edd951aa81a2?w=400&h=400&fit=crop';

export default function ProductCard({ product, index = 0, showQuickAdd = true }: ProductCardProps) {
  const { addItem } = useCart();
  const image = product.images?.[0] || placeholderImage;

  const handleQuickAdd = (e: React.MouseEvent) => {
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
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative h-56 bg-gradient-to-br from-emerald-50 to-teal-50 overflow-hidden">
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            loading="lazy"
            unoptimized={true}
          />
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              Sale
            </span>
          )}
          {showQuickAdd && (
            <motion.button
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleQuickAdd}
            >
              <span className="flex items-center justify-center gap-2 bg-emerald-600 text-white py-2.5 rounded-full font-semibold text-sm hover:bg-emerald-700 transition-colors">
                <ShoppingBag className="h-4 w-4" />
                Quick Add
              </span>
            </motion.button>
          )}
        </div>
        <div className="p-5">
          <span className="text-xs font-medium text-emerald-600 uppercase tracking-wider">
            {product.category}
          </span>
          <h3 className="font-semibold text-gray-900 mt-1 line-clamp-2">{product.name}</h3>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i <= Math.floor(product.rating)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">{product.rating}</span>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <span className="text-xl font-bold text-emerald-600">{formatCurrency(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-400 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
