import Hero from '@/components/Hero';
import CategoryGoals from '@/components/home/CategoryGoals';
import FeaturedProducts from '@/components/FeaturedProducts';
import DoctorTestimonials from '@/components/home/DoctorTestimonials';
import ProductCategories from '@/components/home/ProductCategories';
import BestSellerCombos from '@/components/home/BestSellerCombos';
import Image from 'next/image';

import FlexFitHighlight from '@/components/home/FlexFitHighlight';
import ComboSection from '@/components/home/ComboSection';
import PhotoReviews from '@/components/home/PhotoReviews';

import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export const revalidate = 3600;

export default async function Home() {
  let featuredProducts = [];
  try {
    await dbConnect();
    const products = await Product.find({ inStock: true, featured: true }).sort({ createdAt: -1 }).limit(4).lean();
    featuredProducts = JSON.parse(JSON.stringify(products));
  } catch (err) {
    console.error('Error fetching featured products:', err);
  }

  return (
    <div>
      <Hero />
      <CategoryGoals />
      <FeaturedProducts initialProducts={featuredProducts} />
      
      {/* Responsive Make Healthy Banner Section */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative w-full rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <Image
              src="/banner/Make_Healthy.webp"
              alt="Make Healthy Habits Easy"
              width={1200}
              height={400}
              className="w-full h-auto object-contain"
              unoptimized={true}
              priority
            />
          </div>
        </div>
      </section>

      <BestSellerCombos />
      <FlexFitHighlight />
      <ProductCategories />
      <ComboSection />
      <DoctorTestimonials />
      <PhotoReviews />
    </div>
  );
}
