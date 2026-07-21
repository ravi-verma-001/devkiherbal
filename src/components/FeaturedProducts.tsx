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

  const desiredOrder = ['u-fit', 'fit-flex', 'shilajit-gold', 'mass-builder'];
  
  const orderedProducts: Product[] = [];
  desiredOrder.forEach(slug => {
    let found = products.find(p => p.slug === slug);
    if (!found) {
      found = fallbackProducts.find(p => p.slug === slug) as Product;
    }
    if (found) {
      orderedProducts.push(found);
    }
  });

  let displayProducts = orderedProducts.length > 0 ? orderedProducts : (products.length > 0 ? products : fallbackProducts as Product[]);

  // Ensure we have at least 4 products by filling from fallback products if needed
  if (displayProducts.length < 4) {
    fallbackProducts.forEach((fbProd) => {
      if (displayProducts.length < 4 && !displayProducts.some(p => p.slug === fbProd.slug)) {
        displayProducts.push(fbProd as Product);
      }
    });
  }

  return (
    <section id="featured" className="pt-14 pb-20 bg-[#F9F9F9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 flex flex-col items-center"
        >
          <h2 className="text-[28px] md:text-[40px] font-black text-black mb-2 tracking-tight leading-tight">
            Our Bestsellers
          </h2>
          
          <Link
            href="/shop"
            className="px-6 py-1 border border-[#6B2C58] text-[#6B2C58] rounded-[24px] text-[15px] md:text-[16px] font-medium hover:bg-[#6B2C58] hover:text-white transition-colors"
          >
            Explore All
          </Link>
        </motion.div>

        {loading ? (
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 md:grid md:grid-cols-4 md:gap-6 [&>div]:min-w-[280px] md:[&>div]:min-w-0 [&>div]:snap-center">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-slate-100 rounded-2xl md:rounded-[32px] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 md:grid md:grid-cols-4 md:gap-6 [&>div]:min-w-[280px] md:[&>div]:min-w-0 [&>div]:snap-center">
            {displayProducts.slice(0, 4).map((product, index) => (
              <BestsellerCard key={product._id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
