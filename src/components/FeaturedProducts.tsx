'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import BestsellerCard from '@/components/ui/BestsellerCard';

interface Product {
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
}

import { fallbackProducts } from '@/lib/fallbackProducts';

export default function FeaturedProducts({ initialProducts = [] }: { initialProducts?: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(initialProducts.length === 0);

  useEffect(() => {
    if (initialProducts.length > 0) {
      setLoading(false);
      return;
    }
    fetch('/api/products?featured=true')
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) && data.length > 0 ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [initialProducts]);

  const displayProducts = products.length > 0 ? products : (fallbackProducts as Product[]);

  return (
    <section id="featured" className="py-20 bg-[#F9F9F9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
            Our Bestsellers
          </h2>
          
          <div className="flex justify-center mb-12">
            <Link
              href="/shop"
              className="px-8 py-2.5 bg-[#6B2C58] rounded-full text-sm font-black text-white hover:bg-[#5a244a] transition-colors shadow-md uppercase tracking-widest"
            >
              Explore All
            </Link>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-slate-100 rounded-2xl md:rounded-[32px] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {displayProducts.slice(0, 4).map((product, index) => (
              <BestsellerCard key={product._id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
