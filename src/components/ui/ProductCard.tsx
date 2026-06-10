'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
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
  const { addItem, setIsCartOpen } = useCart();
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
    setIsCartOpen(true);
  };

  const displayPrice = product.variantPrices?.['1m'] || product.price;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col h-full bg-[#f3f3f3] rounded-[24px] p-3"
    >
      <Link href={`/product/${product.slug}`} className="flex flex-col flex-1">
        {/* Image Container */}
        <div className="relative aspect-square w-full bg-white rounded-[20px] overflow-hidden">
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            loading="lazy"
            unoptimized={true}
          />
        </div>
        
        {/* Details */}
        <div className="pt-4 pb-3 flex-1 flex flex-col px-1">
          <h3 className="text-[17px] md:text-[19px] font-extrabold text-black leading-snug line-clamp-2 min-h-[50px] mb-2">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between mt-auto">
            <span className="text-[14px] md:text-[15px] text-gray-800 font-medium">
              Rs. {displayPrice}
            </span>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-[#fbbc04] fill-[#fbbc04]" />
              <span className="text-[13px] md:text-[14px] text-gray-700 font-medium mt-0.5">
                {product.rating}/5({product.reviewCount || 1142})
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Add To Cart Button */}
      {showQuickAdd && (
        <button
          onClick={handleQuickAdd}
          className="w-full mt-2 bg-black hover:bg-gray-800 text-white font-extrabold py-3.5 rounded-[14px] text-[14px] md:text-[15px] uppercase transition-all active:scale-95"
        >
          ADD TO CART
        </button>
      )}
    </motion.article>
  );
}
