'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Plus, Minus, Heart, Share2, ChevronDown, ChevronUp } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ui/ProductCard';
import ProductSchema from '@/components/ProductSchema';
import { formatCurrency } from '@/utils/format';

const placeholderImage = 'https://images.unsplash.com/photo-1550572017-edd951aa81a2?w=800&h=800&fit=crop';

const defaultProduct = {
  _id: '1',
  name: 'Immune Boost Gummies',
  slug: 'immune-boost-gummies',
  price: 29.99,
  originalPrice: 39.99,
  rating: 4.8,
  reviewCount: 124,
  images: [placeholderImage],
  description: 'Our premium Immune Boost Gummies are packed with natural ingredients to support your immune system. Made with vitamin C, zinc, and elderberry extract.',
  benefits: ['Supports immune function', 'Natural ingredients', 'Great taste', 'Easy to take'],
  ingredients: ['Vitamin C', 'Zinc', 'Elderberry Extract', 'Natural Flavors'],
  inStock: true,
  stockQuantity: 50,
  category: 'Immunity',
};

const faqs = [
  { q: 'How many gummies should I take daily?', a: 'Take 2 gummies daily with food, or as directed by your healthcare provider.' },
  { q: 'Are these suitable for vegans?', a: 'Yes, our gummies are plant-based and free from gelatin.' },
  { q: 'Do you ship internationally?', a: 'Yes, we ship to most countries. Shipping times vary by location.' },
  { q: 'What is the shelf life?', a: 'Unopened, our gummies have a 24-month shelf life. Once opened, use within 6 months.' },
];

export default function ProductPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { addItem } = useCart();

  const [product, setProduct] = useState<typeof defaultProduct | null>(null);
  interface RelatedProduct {
  _id: string;
  slug: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  rating: number;
}
const [related, setRelated] = useState<RelatedProduct[]>([]);
  const [reviews, setReviews] = useState<{ userName: string; rating: number; comment: string; createdAt: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<'1m' | '2m' | '3m'>('1m');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    Promise.all([
      fetch(`/api/products?slug=${slug}`).then((r) => r.json()),
      fetch('/api/products').then((r) => r.json()),
    ])
      .then(([prod, all]) => {
        setProduct(prod?.slug ? prod : { ...defaultProduct, slug, name: slug.replace(/-/g, ' ') });
        const others = Array.isArray(all) ? all.filter((p: { slug: string }) => p.slug !== slug) : [];
        setRelated((others.slice(0, 4) as RelatedProduct[]));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (product?._id) {
      fetch(`/api/reviews?productId=${product._id}`)
        .then((r) => r.json())
        .then((data) => setReviews(Array.isArray(data) ? data : []));
    }
  }, [product?._id]);

  const p = product || defaultProduct;
  const images = p.images?.length ? p.images : [placeholderImage];

  const handleAddToCart = () => {
    const currentPrice = p.variantPrices?.[selectedVariant] || p.price;
    addItem({
      _id: p._id,
      name: p.name,
      slug: p.slug,
      price: currentPrice,
      image: images[0],
      category: p.category,
      variant: selectedVariant === '1m' ? '1 Month' : selectedVariant === '2m' ? '2 Months' : '3 Months',
    }, quantity);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <ProductSchema
        product={{
          name: p.name,
          description: p.description,
          price: p.price,
          images,
          rating: p.rating,
          reviewCount: p.reviewCount || reviews.length,
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery Slider */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={images[selectedImage]}
                    alt={p.name}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                    selectedImage === i ? 'border-emerald-500' : 'border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <span className="text-sm font-medium text-emerald-600 uppercase tracking-wider">{p.category}</span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{p.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i <= Math.floor(p.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">{p.rating} ({p.reviewCount || reviews.length} reviews)</span>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-emerald-600">
                  {formatCurrency((p.variantPrices?.[selectedVariant] || p.price))}
                </span>
                {p.originalPrice && p.originalPrice > (p.variantPrices?.[selectedVariant] || p.price) && (
                  <>
                    <span className="text-xl text-gray-400 line-through">{formatCurrency(p.originalPrice)}</span>
                    <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-sm font-semibold">
                      Save {formatCurrency(p.originalPrice - (p.variantPrices?.[selectedVariant] || p.price))}
                    </span>
                  </>
                )}
              </div>

              {p.variantPrices && (
                <div className="space-y-3">
                  <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Select Duration</span>
                  <div className="grid grid-cols-3 gap-3">
                    {(['1m', '2m', '3m'] as const).map((v) => (
                      <button
                        key={v}
                        onClick={() => setSelectedVariant(v)}
                        className={`py-3 px-2 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                          selectedVariant === v
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                            : 'border-slate-200 hover:border-emerald-200 text-gray-600'
                        }`}
                      >
                        <span className="font-bold text-sm">{v === '1m' ? '1 Month' : v === '2m' ? '2 Months' : '3 Months'}</span>
                        <span className="text-xs opacity-80">{formatCurrency(p.variantPrices![v] || 0)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <p className="text-gray-700 text-lg leading-relaxed">{p.description}</p>

            {p.benefits?.length ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h3>
                <ul className="space-y-2">
                  {p.benefits.map((b, i) => (
                    <li key={i} className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-900">Quantity</span>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-3 hover:bg-slate-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-3 hover:bg-slate-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-emerald-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                >
                  Add to Cart — {formatCurrency((p.variantPrices?.[selectedVariant] || p.price) * quantity)}
                </button>
                <button className="p-4 border border-slate-200 rounded-xl hover:bg-slate-50">
                  <Heart className="h-5 w-5" />
                </button>
                <button
                  onClick={() => navigator.share?.({ title: p.name, url: window.location.href })}
                  className="p-4 border border-slate-200 rounded-xl hover:bg-slate-50"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>

              {p.inStock ? (
                <p className="text-emerald-600 font-medium">✓ In Stock{p.stockQuantity ? ` (${p.stockQuantity} available)` : ''}</p>
              ) : (
                <p className="text-red-600 font-medium">Out of Stock</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Ingredients */}
        {p.ingredients?.length ? (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Ingredients</h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {p.ingredients.map((ing, i) => (
                  <li key={i} className="text-gray-700">{ing}</li>
                ))}
              </ul>
            </div>
          </motion.section>
        ) : null}

        {/* FAQ Accordion */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-xl overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left font-medium text-gray-900 hover:bg-slate-50"
                >
                  {faq.q}
                  {openFaq === i ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-gray-600">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Reviews */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
          <div className="space-y-6">
            {reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((r, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                        <span className="text-emerald-600 font-semibold">{r.userName.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{r.userName}</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((j) => (
                            <Star
                              key={j}
                              className={`h-4 w-4 ${j <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-slate-500 text-sm">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}</span>
                  </div>
                  <p className="text-gray-700">{r.comment}</p>
                </div>
              ))
            )}
          </div>
        </motion.section>

        {/* Related Products */}
        {related.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((item, i) => (
                <ProductCard key={item._id} product={item} index={i} showQuickAdd />
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
