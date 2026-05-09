'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types/product';
import { formatCurrency } from '@/utils/format';

interface ProductCardProps {
  product: Product;
  index?: number;
  showQuickAdd?: boolean;
}

const placeholderImage = 'https://images.unsplash.com/photo-1550572017-edd951aa81a2?w=400&h=400&fit=crop';

export default function ProductCard({ product, index = 0, showQuickAdd = true }: ProductCardProps) {
  const { addItem } = useCart();
  const image = product.images?.[0] || placeholderImage;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    const currentPrice = product.variantPrices?.['1m'] || product.price;
    addItem({
      _id: product._id,
      name: product.name,
      slug: product.slug,
      price: currentPrice,
      image,
      category: product.category,
      variant: product.variantPrices ? '1 Month' : undefined,
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
        <div className="p-4 md:p-5">
          <span className="text-[10px] md:text-xs font-medium text-emerald-600 uppercase tracking-wider">
            {product.category}
          </span>
          <h3 className="text-sm md:text-base font-bold text-gray-900 mt-1 line-clamp-2 h-10 md:h-12 leading-tight">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 md:gap-2 mt-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 md:h-4 md:w-4 ${
                    i <= Math.floor(product.rating)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs md:text-sm text-gray-500 font-bold">{product.rating}</span>
          </div>
          <div className="flex flex-col mt-4">
            <div className="flex items-center gap-2">
              <span className="text-lg md:text-xl font-black text-emerald-600">
                {formatCurrency(product.variantPrices?.['1m'] || product.price)}
              </span>
              {product.originalPrice && product.originalPrice > (product.variantPrices?.['1m'] || product.price) && (
                <span className="text-xs md:text-sm text-gray-400 line-through font-medium">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            {product.variantPrices && (
              <span className="text-[10px] text-gray-500 font-medium">Starting from 1 Month plan</span>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
