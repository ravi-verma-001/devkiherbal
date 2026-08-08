import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { isAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const benefit = searchParams.get('benefit');
    const slug = searchParams.get('slug');

    let query: Record<string, unknown> = { inStock: true };

    if (slug) {
      const product = await Product.findOne({ slug });
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json(product);
    }

    if (category && category !== 'all') {
      query.category = new RegExp(category, 'i');
    }
    if (featured === 'true') {
      query.featured = true;
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) (query.price as Record<string, number>).$gte = Number(minPrice);
      if (maxPrice) (query.price as Record<string, number>).$lte = Number(maxPrice);
    }
    if (benefit) {
      query.benefits = new RegExp(benefit, 'i');
    }

    const products = await Product.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    await dbConnect();
    const body = await request.json();
    const product = await Product.create(body);
    return NextResponse.json(product);
  } catch (error) {
    console.error('Products API create error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
