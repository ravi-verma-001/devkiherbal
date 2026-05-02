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
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [initialProducts]);

  const fallbackProducts: Product[] = [
    { 
      _id: '1', 
      name: 'Daily Burner Capsules', 
      slug: 'daily-burner-capsules', 
      price: 1249, 
      images: ['/banner/product2.jpeg'], 
      category: 'Daily Burner', 
      rating: 4.7, 
      reviewCount: 1134,
      benefits: ['Burn Calories', 'Reduce Carb Absorption', 'Manage Cravings', 'Boost Metabolism']
    },
    { 
      _id: '2', 
      name: 'Periods Pain Relief Capsule', 
      slug: 'periods-pain-relief-capsule', 
      price: 1249, 
      images: ['/banner/product9.jpeg'], 
      category: 'Women Health', 
      rating: 4.8, 
      reviewCount: 945,
      benefits: ['Relieves Cramps', 'Balances Mood', 'Reduces Inflammation', 'Hormonal Balance']
    },
    { 
      _id: '6', 
      name: 'What\'s Up Stress Relief Gummies', 
      slug: 'whats-up-stress-relief-gummies', 
      price: 722, 
      images: ['/banner/product6.png'], 
      category: 'Wellness', 
      rating: 4.7, 
      reviewCount: 642,
      benefits: ['Promotes Calmness', 'Mental Balance', 'Reduces Anxiety', 'Improves Focus']
    },
    { 
      _id: '9', 
      name: 'Night Burner Capsules', 
      slug: 'night-burner-capsules', 
      price: 1249, 
      images: ['/banner/product1.png'], 
      category: 'Weight Management', 
      rating: 4.8, 
      reviewCount: 730,
      benefits: ['Burn Night-time Calories', 'Manage Cravings', 'Reduces Cortisol', 'Restful Sleep']
    },
  ];

  const displayProducts = products.length > 0 ? products : fallbackProducts;

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-slate-100 rounded-[32px] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProducts.slice(0, 4).map((product, index) => (
              <BestsellerCard key={product._id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
