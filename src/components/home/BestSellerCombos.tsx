'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface ComboItem {
  _id: string;
  name: string;
  slug: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
}

const initialCombos: ComboItem[] = [
  {
    _id: 'pro-hair-skin-combo-static',
    name: 'Pro Hair & Skin Combo',
    slug: 'pro-hair-skin-combo',
    price: 1649,
    rating: 4.6,
    reviewCount: 10648,
    image: '/banner/combo1.png',
  },
  {
    _id: 'the-confidence-combo-static',
    name: 'The Confidence Combo',
    slug: 'the-confidence-combo',
    price: 1799,
    rating: 4.6,
    reviewCount: 10648,
    image: '/banner/combo2.png',
  },
  {
    _id: 'just-lose-it-combo-static',
    name: 'Just Lose It Combo',
    slug: 'just-lose-it-combo',
    price: 1999,
    rating: 4.6,
    reviewCount: 2320,
    image: '/banner/combo3.png',
  },
  {
    _id: 'great-looks-energy-bundle-static',
    name: 'Great Looks & Energy Bundle',
    slug: 'great-looks-energy-bundle',
    price: 1199,
    rating: 4.7,
    reviewCount: 1338,
    image: '/banner/Gemini_Generated_Image_kn9yelkn9yelkn9y.png',
  }
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export default function BestSellerCombos() {
  const { addItem, setIsCartOpen } = useCart();
  const [combos, setCombos] = useState<ComboItem[]>(initialCombos);

  useEffect(() => {
    fetch(`${API_BASE}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const updated = initialCombos.map((c) => {
            const dbProd = data.find((p) => p.slug === c.slug);
            if (dbProd) {
              return {
                ...c,
                _id: dbProd._id,
                price: dbProd.price,
                rating: dbProd.rating,
                reviewCount: dbProd.reviewCount,
              };
            }
            return c;
          });
          setCombos(updated);
        }
      })
      .catch((err) => console.error('Error fetching combos in client:', err));
  }, []);

  const handleAddToCart = (e: React.MouseEvent, combo: ComboItem) => {
    e.preventDefault();
    addItem({
      _id: combo._id,
      name: combo.name,
      slug: combo.slug,
      price: combo.price,
      image: combo.image,
      category: 'Combo',
      variant: '1 Month',
    }, 1);
    setIsCartOpen(true);
  };

  return (
    <section className="pt-12 pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
            Best Seller Combos
          </h2>
        </motion.div>

        {/* Swipeable container on mobile, grid on desktop */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 md:grid md:grid-cols-4 md:gap-6 [&>div]:min-w-[280px] md:[&>div]:min-w-0 [&>div]:snap-center scrollbar-hide">
          {combos.map((combo, index) => (
            <motion.div
              key={combo.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="flex flex-col h-full bg-white"
            >
              {/* Product Image Container */}
              <Link href={`/product/${combo.slug}`} className="group flex flex-col flex-1">
                <div className="relative aspect-square w-full rounded-[24px] overflow-hidden border border-slate-100 bg-white">
                  <Image
                    src={combo.image}
                    alt={combo.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    priority={index === 0}
                    unoptimized={true}
                  />
                </div>

                {/* Details Section */}
                <div className="pt-4 pb-2 flex-1 flex flex-col">
                  {/* Underlined Title */}
                  <h3 className="text-[17px] md:text-[19px] font-black text-black leading-snug underline underline-offset-4 decoration-1 hover:text-gray-700 transition-colors">
                    {combo.name}
                  </h3>

                  {/* Rating Section */}
                  <div className="flex items-center gap-1 mt-2.5">
                    <Star className="h-4 w-4 text-[#fbbc04] fill-[#fbbc04]" />
                    <span className="text-[13px] md:text-[14px] text-gray-700 font-bold mt-0.5">
                      {combo.rating}/5({combo.reviewCount})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mt-2 text-[15px] md:text-[16px] text-black font-extrabold">
                    Rs. {combo.price.toLocaleString('en-IN')}
                  </div>
                </div>
              </Link>

              {/* Add To Cart Button */}
              <button
                onClick={(e) => handleAddToCart(e, combo)}
                className="w-full mt-3 bg-black hover:bg-gray-800 text-white font-extrabold py-3.5 rounded-[12px] text-[14px] md:text-[15px] uppercase transition-all active:scale-95 shadow-sm"
              >
                Add To Cart
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
