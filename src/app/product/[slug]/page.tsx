'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Plus, Minus, Heart, Share2, ChevronDown, ChevronUp, Copy, Tag, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types/product';
import ProductCard from '@/components/ui/ProductCard';
import ProductSchema from '@/components/ProductSchema';
import { formatCurrency } from '@/utils/format';
import ShilajitCompetitorSections from '@/components/product/ShilajitCompetitorSections';

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
  variantPrices: {
    '1m': 29.99,
    '2m': 54.99,
    '3m': 79.99,
  },
} as Product;

const faqs = [
  { q: 'How many gummies should I take daily?', a: 'Take 2 gummies daily with food, or as directed by your healthcare provider.' },
  { q: 'Are these suitable for vegans?', a: 'Yes, our gummies are plant-based and free from gelatin.' },
  { q: 'Do you ship internationally?', a: 'Yes, we ship to most countries. Shipping times vary by location.' },
  { q: 'What is the shelf life?', a: 'Unopened, our gummies have a 24-month shelf life. Once opened, use within 6 months.' },
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export default function ProductPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<{ userName: string; rating: number; comment: string; createdAt: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<'1m' | '2m' | '3m'>('1m');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setSelectedImage(0); // Reset image index on product change
    Promise.all([
      fetch(`${API_BASE}/api/products?slug=${slug}`).then((r) => r.json()),
      fetch(`${API_BASE}/api/products`).then((r) => r.json()),
    ])
      .then(([prod, all]) => {
        setProduct(prod?.slug ? prod : { ...defaultProduct, slug, name: slug.replace(/-/g, ' ') });
        const others = Array.isArray(all) ? all.filter((p: { slug: string }) => p.slug !== slug) : [];
        setRelated((others.slice(0, 4) as Product[]));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (product?._id) {
      fetch(`${API_BASE}/api/reviews?productId=${product._id}`)
        .then((r) => r.json())
        .then((data) => setReviews(Array.isArray(data) ? data : []));
    }
  }, [product?._id]);

  const p = product || defaultProduct;
  const productImages = p.images?.length ? p.images : [placeholderImage];

  // Set images for product. If slug is period-pain-relief, use the 6 custom images from /banner/
  const images = slug === 'period-pain-relief'
    ? [
        '/banner/PeriodPainNew.png',
        '/banner/periods3.jpeg',
        '/banner/periods4.jpeg',
        '/banner/periods5.jpeg',
        '/banner/periods6.jpeg',
        '/banner/periods7.jpeg',
        '/banner/periods8.jpeg',
      ]
    : slug === 'shilajit-gold'
    ? [
        '/banner/ShilajitNew.png', // Keeping the current card image at first position
        '/banner/shilijit1.jpeg',
        '/banner/shilijit2.jpeg',
        '/banner/shilijit3.jpeg',
        '/banner/shilijit4.jpeg',
        '/banner/shilijit5.jpeg',
      ]
    : slug === 'night-relief-gummies'
    ? [
        '/banner/NightReliefNew.png', // Keeping the current card image at first position
        '/banner/nightrelief1.jpeg',
        '/banner/nightrelief2.jpeg',
        '/banner/nightrelief3.jpeg',
        '/banner/nightrelief4.jpeg',
        '/banner/nightrelief5.jpeg',
        '/banner/nightrelief6.jpeg',
      ]
    : slug === 'skin-hair-combo' || slug === 'pro-hair-skin-combo'
    ? [
        '/banner/combo1.png'
      ]
    : slug === 'beauty-sleep-combo' || slug === 'the-confidence-combo'
    ? [
        '/banner/combo2.png'
      ]
    : slug === 'stress-free-sleep-combo' || slug === 'just-lose-it-combo'
    ? [
        '/banner/combo3.png'
      ]
    : slug === 'great-looks-energy-bundle'
    ? [
        '/banner/Gemini_Generated_Image_kn9yelkn9yelkn9y.png'
      ]
    : (() => {
        const dummyImages = [
          'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=800&auto=format&fit=crop',
        ];
        const imgs = [...productImages];
        for (let i = 0; imgs.length < 4 && i < dummyImages.length; i++) {
          imgs.push(dummyImages[i]);
        }
        return imgs;
      })();

  // Auto-play timer for image slider
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setTimeout(() => {
      setSelectedImage((prev) => (prev + 1) % images.length);
    }, 3000); // Change image every 3 seconds
    return () => clearTimeout(timer);
  }, [selectedImage, images.length]);

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
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-[#0a3161] border-t-transparent animate-spin" />
      </div>
    );
  }

  const currentPrice = p.variantPrices?.[selectedVariant] || p.price;
  const originalPrice = p.originalPrice || currentPrice * 1.25;

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-20 font-sans">
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
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* Main Product Card */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col lg:flex-row">
          
          {/* Left Column - Images */}
          <div className="w-full lg:w-1/2 p-4 lg:p-8 relative">
             <div className="relative w-full aspect-square rounded-2xl bg-white flex items-center justify-center overflow-hidden group border border-slate-100 shadow-sm">
                 <AnimatePresence mode="wait">
                   <motion.img
                     key={selectedImage}
                     src={images[selectedImage]}
                     alt={p.name}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     transition={{ duration: 0.3 }}
                     className="w-full h-full object-cover absolute"
                   />
                 </AnimatePresence>
                 
                 {/* Badges */}
                 <div className="absolute top-4 right-4 bg-black text-white text-xs font-bold px-3 py-1.5 rounded-lg text-center leading-tight shadow-lg border border-gray-800 z-10">
                    As Seen On<br/><span className="text-lg">SHARK TANK</span>
                 </div>
                 <div className="absolute bottom-4 left-4 bg-[#0a3161] text-white text-sm font-bold px-4 py-2 rounded-lg shadow-md z-10">
                    At Just ₹20 Per Day!
                 </div>

                 {/* Navigation Arrows */}
                 <button
                   onClick={(e) => {
                     e.stopPropagation();
                     setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
                   }}
                   className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-md hover:scale-110 active:scale-95 transition-all z-10 border border-slate-100 opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 max-md:opacity-100"
                   aria-label="Previous image"
                 >
                   <ChevronLeft className="h-5 w-5" />
                 </button>
                 <button
                   onClick={(e) => {
                     e.stopPropagation();
                     setSelectedImage((prev) => (prev + 1) % images.length);
                   }}
                   className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-md hover:scale-110 active:scale-95 transition-all z-10 border border-slate-100 opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 max-md:opacity-100"
                   aria-label="Next image"
                 >
                   <ChevronRight className="h-5 w-5" />
                 </button>
             </div>

             <div className="bg-black text-white text-center py-2.5 text-xs font-medium rounded-lg mt-2 mb-4 shadow-sm tracking-wide">
               4,12,865+ units sold recently
             </div>

             {/* Thumbnails */}
             <div className="flex gap-3 overflow-x-auto pb-2 px-1 scrollbar-hide">
               {images.map((img, i) => (
                 <button
                   key={i}
                   onClick={() => setSelectedImage(i)}
                   className={`relative flex-shrink-0 w-[72px] h-[72px] rounded-xl overflow-hidden border-2 transition-all ${
                     selectedImage === i ? 'border-[#0a3161] shadow-md scale-105' : 'border-slate-100 hover:border-slate-300'
                   }`}
                 >
                   <img src={img} alt="" className="w-full h-full object-cover" />
                 </button>
               ))}
             </div>
          </div>

          {/* Right Column - Details */}
          <div className="w-full lg:w-1/2 p-6 lg:p-10 bg-[#fafcff] lg:border-l border-slate-100 flex flex-col">
             <h1 className="text-[32px] font-extrabold text-[#111827] mb-2 leading-tight tracking-tight">{p.name}</h1>
             <p className="text-gray-600 mb-1.5 font-medium leading-relaxed">{p.description.substring(0, 75)}...</p>
             <p className="text-[15px] font-bold text-gray-800 mb-5 tracking-wide">Boosts Results Naturally</p>

             {/* Price and Rating */}
             <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-end gap-2.5">
                   <span className="text-[28px] font-extrabold text-gray-900 leading-none">Rs. {currentPrice}</span>
                   <span className="text-lg font-bold text-gray-400 line-through mb-0.5">Rs. {originalPrice}</span>
                </div>
                <div className="flex items-center bg-[#fff8e1] px-2.5 py-1 rounded-md shadow-sm border border-[#ffe082]">
                   <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 mr-1.5" />
                   <span className="text-xs font-extrabold text-amber-900">{p.rating}/5({p.reviewCount || reviews.length})</span>
                </div>
             </div>
             <p className="text-[11px] text-gray-500 mb-6 font-bold tracking-wide">MRP Inclusive of all taxes</p>

             {/* Coupon */}
             <div className="bg-[#f0f4ff] border-[1.5px] border-dashed border-[#849bf3] rounded-xl p-4 mb-7 relative shadow-sm">
                 <div className="flex justify-between items-center mb-2.5">
                    <div className="flex items-center text-[#2d3282] font-semibold text-[15px]">
                       <Tag className="w-4 h-4 mr-2" /> Get it for ₹ {Math.max(0, currentPrice - 100)}
                    </div>
                    <div className="text-[#2d3282] text-[13px]">Use Code: <span className="font-extrabold text-[15px]">WHATSUP</span></div>
                 </div>
                 <div className="flex justify-between items-center text-[#4a55a2] text-[13px] font-bold">
                    <span>+ Extra 5% discount on UPI payments</span>
                    <button className="bg-[#2d3282] text-white px-3 py-1.5 rounded-md text-[11px] font-bold flex items-center shadow-sm hover:bg-[#1e225c] transition-colors">
                      <Copy className="w-3.5 h-3.5 mr-1" /> COPY
                    </button>
                 </div>
             </div>

             {/* Pick Your Pack */}
             <div className="mb-8 flex-1">
               <p className="text-[15px] font-bold mb-4 text-gray-800">Pick Your Pack:</p>
               <div className="grid grid-cols-3 gap-3">
                  {(['1m', '2m', '3m'] as const).map((v, idx) => {
                     const isSelected = selectedVariant === v;
                     const vPrice = p.variantPrices?.[v] || (currentPrice * (idx + 1));
                     const vMrp = p.originalPrice ? (p.originalPrice * (idx + 1)) : (originalPrice * (idx + 1));
                     const saveAmt = Math.round(vMrp - vPrice);
                     
                     return (
                      <div 
                         key={v} 
                         onClick={() => setSelectedVariant(v)}
                         className={`border-2 rounded-[18px] relative cursor-pointer overflow-hidden transition-all duration-200 ${isSelected ? 'border-[#2d3282] shadow-lg bg-white scale-[1.03] z-10' : 'border-transparent bg-gray-50 hover:bg-gray-100'} shadow-sm flex flex-col justify-between`}
                      >
                         {/* Badges */}
                         {v === '2m' && <div className="bg-[#1e1e1e] text-white text-[10px] py-1.5 text-center font-bold tracking-widest uppercase">Most Popular 🔥</div>}
                         {v === '3m' && <div className="bg-[#2d3282] text-white text-[10px] py-1.5 text-center font-bold tracking-widest uppercase">Recommended 🔥</div>}
                         {v === '1m' && <div className="bg-transparent text-transparent text-[10px] py-1.5 text-center font-bold">&nbsp;</div>}

                         <div className="p-2.5 flex flex-col items-center flex-1">
                            <div className="w-full aspect-square rounded-xl mb-3 relative overflow-hidden flex items-center justify-center bg-white border border-slate-100">
                               <img src={images[0]} className="w-full h-full object-cover" />
                            </div>
                            
                            <div className="text-center mt-auto w-full">
                              <p className="font-extrabold text-[14px] text-gray-900 leading-tight">
                                {v === '1m' ? 'Starter Pack' : v === '2m' ? 'Progress Pack' : 'Result Pack'}
                              </p>
                              <p className="text-[11px] text-gray-500 mt-0.5 mb-2.5 font-bold">
                                {v === '1m' ? '1 Month Supply' : v === '2m' ? '2 Months Supply' : '3 Months Supply'}
                              </p>
                              <div className="flex flex-col items-center justify-center gap-0.5 mt-1">
                                <span className="text-[12px] text-gray-400 line-through font-bold">MRP: ₹{vMrp}</span>
                                <span className="font-extrabold text-[15px] text-gray-900">Now: ₹{vPrice}</span>
                              </div>
                            </div>
                         </div>
                         
                         <div className={`w-full text-center py-2.5 text-[12px] font-extrabold text-white transition-colors ${isSelected ? 'bg-[#1e1e1e]' : 'bg-[#2d3282]'}`}>
                           Save ₹{saveAmt} Today!
                         </div>
                      </div>
                     );
                  })}
               </div>
             </div>

             {/* Add to Cart */}
             <button onClick={handleAddToCart} className="w-full mt-auto bg-black text-white text-[19px] font-extrabold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-800 transition-colors shadow-xl active:scale-[0.98] h-16 shrink-0">
               <ShoppingBag className="w-6 h-6" /> Add to cart
             </button>
          </div>
        </div>

        {/* Conditional Custom Competitor Sections or Default Timelines */}
        {slug === 'shilajit-gold' ? (
          <ShilajitCompetitorSections />
        ) : (
          <>
            {/* Burn Your Extra Fat While You Sleep Section */}
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="mt-12 bg-white rounded-[32px] p-8 md:p-12 shadow-sm text-center"
            >
               <h2 className="text-[28px] md:text-[36px] font-extrabold text-gray-900 mb-10 max-w-2xl mx-auto leading-tight tracking-tight">
                  Burn Your Extra Fat <br/> While You Sleep!
               </h2>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-4 lg:gap-6 border-x-0 md:border-x-[24px] border-white bg-[#0a3161] rounded-[24px] md:bg-transparent md:rounded-none overflow-hidden md:overflow-visible shadow-lg md:shadow-none">
                  {[
                    { day: 'DAY 15', desc: '- Reduced late-night cravings\n- Bloating under control\n- You sleep better', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=800&fit=crop' },
                    { day: 'DAY 30', desc: '- Boosted calorie burn while sleeping\n- Better appetite control\n- Improved energy levels', img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&h=800&fit=crop' },
                    { day: 'DAY 90', desc: '- Noticeable fat loss around belly, waist, arms & face\n- Peak energy levels\n- Healthier eating habits', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=800&fit=crop' }
                  ].map((step, i) => (
                     <div key={i} className={`flex flex-col text-left ${i !== 2 ? 'border-b md:border-b-0 border-[#1e40af]' : ''} md:bg-white md:rounded-[24px] md:overflow-hidden md:shadow-md`}>
                        <div className="bg-[#0a3161] text-white text-center py-4 font-extrabold text-[19px] relative">
                           {step.day}
                           {i < 2 && <span className="absolute right-[-12px] top-1/2 -translate-y-1/2 text-white font-light text-[32px] z-10 hidden md:block drop-shadow-md">›</span>}
                        </div>
                        <div className="aspect-[4/5] relative w-full bg-slate-100">
                           <img src={step.img} className="w-full h-full object-cover" />
                        </div>
                        <div className="pt-6 pb-8 px-5 bg-white h-full">
                           {step.desc.split('\n').map((line, j) => (
                              <p key={j} className="text-[15px] text-gray-800 font-bold mb-2 leading-snug">{line}</p>
                           ))}
                        </div>
                     </div>
                  ))}
               </div>
            </motion.div>

            {/* Timeline Section */}
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="mt-12 bg-white rounded-[32px] p-8 md:p-12 shadow-sm text-center"
            >
               <div className="mb-12 rounded-[24px] overflow-hidden relative aspect-[21/9] md:aspect-[3/1] max-w-5xl mx-auto shadow-inner">
                 <img src="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=1200&h=400&fit=crop" className="w-full h-full object-cover" />
               </div>
               
               <h2 className="text-[26px] md:text-[34px] font-extrabold text-gray-900 mb-16 tracking-tight">
                  What Happens After You Take Our Capsules?
               </h2>
               
               <div className="max-w-4xl mx-auto relative px-4">
                  {/* Timeline Line */}
                  <div className="absolute top-[24px] left-[10%] right-[10%] border-t-2 border-dashed border-gray-400 z-0 hidden md:block">
                     <div className="absolute right-[-10px] top-[-8px] text-gray-600">☀️</div>
                     <div className="absolute left-[-15px] top-[-10px] text-gray-600 text-xl">🌙</div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6 relative z-10">
                     {[
                       { time: '11 : 00 PM', desc: 'Fall asleep faster and deeper' },
                       { time: '02 : 00 AM', desc: 'Body reaches peak fat burn mode' },
                       { time: '04 : 00 AM', desc: 'Metabolism boosts significantly' },
                       { time: '07 : 00 AM', desc: 'Wake up refreshed and lighter' }
                     ].map((t, i) => (
                        <div key={i} className="flex flex-col items-center">
                           <div className="bg-[#1e40af] text-white font-mono font-bold text-[18px] py-2 px-5 rounded-lg shadow-[inset_0_1px_4px_rgba(255,255,255,0.4),0_4px_10px_rgba(30,64,175,0.3)] mb-5 border border-[#0f172a] relative">
                             {t.time}
                             {/* Mobile connector line */}
                             {i < 3 && <div className="absolute bottom-[-40px] left-1/2 w-0.5 h-10 bg-gray-300 md:hidden"></div>}
                           </div>
                           <p className="text-[15px] font-bold text-gray-800 leading-tight max-w-[150px]">{t.desc}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </motion.div>
          </>
        )}
        
        {/* FAQ Accordion */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center tracking-tight">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left font-bold text-gray-900 hover:bg-slate-50 transition-colors"
                >
                  <span className="text-[17px]">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="h-6 w-6 text-gray-400 shrink-0" /> : <ChevronDown className="h-6 w-6 text-gray-400 shrink-0" />}
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-gray-600 font-medium leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.section>

      </div>
    </div>
  );
}
