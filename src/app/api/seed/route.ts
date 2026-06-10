import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

const sampleProducts = [
  {
    name: 'U-Fit',
    slug: 'u-fit',
    description: 'A powerful formula to help you manage your fitness goals and maintain a healthy weight.',
    price: 849,
    originalPrice: 1299,
    variantPrices: {
      '1m': 849,
      '2m': 1499,
      '3m': 2100
    },
    images: ['/banner/U-F.png'],
    category: 'Weight Management',
    benefits: ['Burn Calories', 'Manage Cravings', 'Boost Metabolism'],
    ingredients: ['Green Tea Extract', 'Garcinia Cambogia', 'L-Carnitine'],
    rating: 4.7,
    reviewCount: 1134,
    inStock: true,
    stockQuantity: 500,
    featured: true,
  },
  {
    name: 'Fit Flex',
    slug: 'fit-flex',
    description: 'Enhance your flexibility and muscle recovery with our specialized Fit Flex formula.',
    price: 849,
    originalPrice: 1299,
    variantPrices: {
      '1m': 849,
      '2m': 1499,
      '3m': 2100
    },
    images: ['/banner/F-F.png'],
    category: 'Weight Management',
    benefits: ['Muscle Recovery', 'Improved Flexibility', 'Joint Support'],
    ingredients: ['Collagen', 'Glucosamine', 'Turmeric'],
    rating: 4.6,
    reviewCount: 856,
    inStock: true,
    stockQuantity: 500,
    featured: true,
  },
  {
    name: 'Period Pain Relief',
    slug: 'period-pain-relief',
    description: 'Relieve menstrual discomfort naturally with our specialized pain relief formula.',
    price: 749,
    originalPrice: 999,
    variantPrices: {
      '1m': 749,
      '2m': 1349,
      '3m': 1899
    },
    images: [
      '/banner/PeriodPainNew.png',
      '/banner/periods3.jpeg',
      '/banner/periods4.jpeg',
      '/banner/periods5.jpeg',
      '/banner/periods6.jpeg',
      '/banner/periods7.jpeg',
      '/banner/periods8.jpeg'
    ],
    category: 'Women Health',
    benefits: ['Relieves Cramps', 'Balances Mood', 'Reduces Inflammation'],
    ingredients: ['Lodhra', 'Ashoka', 'Shatavari'],
    rating: 4.8,
    reviewCount: 945,
    inStock: true,
    stockQuantity: 500,
    featured: true,
  },
  {
    name: 'Shilajit Gold',
    slug: 'shilajit-gold',
    description: 'Enhance your vitality and vigor with our pure Shilajit Gold enriched with herbal extracts.',
    price: 850,
    originalPrice: 1199,
    variantPrices: {
      '1m': 850,
      '2m': 1499,
      '3m': 2249
    },
    images: [
      '/banner/ShilajitNew.png',
      '/banner/shilijit1.jpeg',
      '/banner/shilijit2.jpeg',
      '/banner/shilijit3.jpeg',
      '/banner/shilijit4.jpeg',
      '/banner/shilijit5.jpeg'
    ],
    category: 'Performance',
    benefits: ['Enhances Vitality', 'Improves Performance', 'Boosts Energy'],
    ingredients: ['Shilajit Extract', 'Ashwagandha', 'Gold Bhasma'],
    rating: 4.7,
    reviewCount: 1338,
    inStock: true,
    stockQuantity: 500,
    featured: true,
  },
  {
    name: 'Night Relief Gummies',
    slug: 'night-relief-gummies',
    description: 'Manage stress and get restful sleep with our delicious night-time relief gummies.',
    price: 750,
    originalPrice: 1099,
    variantPrices: {
      '1m': 750,
      '2m': 1249,
      '3m': 1849
    },
    images: [
      '/banner/NightReliefNew.png',
      '/banner/nightrelief1.jpeg',
      '/banner/nightrelief2.jpeg',
      '/banner/nightrelief3.jpeg',
      '/banner/nightrelief4.jpeg',
      '/banner/nightrelief5.jpeg',
      '/banner/nightrelief6.jpeg'
    ],
    category: 'Sleep & Relaxation',
    benefits: ['Restful Sleep', 'Stress Reduction', 'Calm Mind'],
    ingredients: ['Melatonin', 'L-Theanine', 'Chamomile'],
    rating: 4.8,
    reviewCount: 730,
    inStock: true,
    stockQuantity: 500,
    featured: false,
  },
  {
    name: 'Glow Berry Gummies',
    slug: 'glow-berry-gummies',
    description: 'Support your skin glow and hair health with our delicious Glow Berry beauty gummies.',
    price: 899,
    originalPrice: 1399,
    variantPrices: {
      '1m': 899,
      '2m': 1449,
      '3m': 1979
    },
    images: ['/banner/GlowBerry.png'],
    category: 'Beauty',
    benefits: ['Skin Glow', 'Hair Strength', 'Nail Health'],
    ingredients: ['Biotin', 'Vitamin C', 'Vitamin E', 'Zinc'],
    rating: 4.6,
    reviewCount: 10646,
    inStock: true,
    stockQuantity: 500,
    featured: false,
  },
  {
    name: 'Mass Builder Capsule',
    slug: 'mass-builder-capsule',
    description: 'Build lean muscle mass and improve strength with our Mass Builder capsules.',
    price: 749,
    originalPrice: 1199,
    variantPrices: {
      '1m': 749,
      '2m': 1349,
      '3m': 1850
    },
    images: ['/banner/combo-beauty-sleep.jpeg'],
    category: 'Muscle Gain',
    benefits: ['Muscle Growth', 'Increased Strength', 'Better Recovery'],
    ingredients: ['Whey Protein', 'Creatine', 'BCAA'],
    rating: 4.8,
    reviewCount: 320,
    inStock: true,
    stockQuantity: 200,
    featured: false,
  },
  {
    name: 'Mass Gainer Powder',
    slug: 'mass-gainer-powder',
    description: 'Get the calories you need to gain mass with our high-protein Mass Gainer powder.',
    price: 849,
    originalPrice: 1499,
    variantPrices: {
      '1m': 849,
      '2m': 1449,
      '3m': 2150
    },
    images: ['/banner/MassGainer.png'],
    category: 'Muscle Gain',
    benefits: ['Calorie Dense', 'High Protein', 'Fast Mass Gain'],
    ingredients: ['Complex Carbs', 'Protein Blend', 'Vitamins'],
    rating: 4.9,
    reviewCount: 560,
    inStock: true,
    stockQuantity: 150,
    featured: true,
  },
  {
    name: 'GutFix Health Gummies',
    slug: 'gutfix-health-gummies',
    description: 'Optimize your digestive system, ease bloating, and balance your gut microbiome with our premium probiotic-rich GutFix Health Gummies.',
    price: 899,
    originalPrice: 1399,
    variantPrices: {
      '1m': 899,
      '2m': 1599,
      '3m': 2299
    },
    images: ['/banner/GutFix.png'],
    category: 'Digestive',
    benefits: ['Balances Gut Flora', 'Improves Digestion', 'Reduces Bloating'],
    ingredients: ['Bacillus Coagulans (Probiotic)', 'Chicory Root Fiber (Prebiotic)', 'Apple Cider Vinegar'],
    rating: 4.8,
    reviewCount: 394,
    inStock: true,
    stockQuantity: 500,
    featured: true,
  },
];

export async function POST() {
  try {
    await dbConnect();

    // Clear existing products
    await Product.deleteMany({});

    // Insert sample products
    const createdProducts = await Product.insertMany(sampleProducts);

    return NextResponse.json({
      message: `Seeded ${createdProducts.length} products successfully`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Error seeding database', error: error.message },
      { status: 500 }
    );
  }
}
