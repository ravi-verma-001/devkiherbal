import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import DoctorTestimonials from '@/components/home/DoctorTestimonials';
import ProductBenefits from '@/components/home/ProductBenefits';
import ProductCategories from '@/components/home/ProductCategories';

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
      <FeaturedProducts initialProducts={featuredProducts} />
      <FlexFitHighlight />
      <section id="benefits">
        <ProductBenefits />
      </section>
      <ProductCategories />
      <ComboSection />
      <DoctorTestimonials />
      <PhotoReviews />
    </div>
  );
}
