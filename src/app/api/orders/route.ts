import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userIdParam = searchParams.get('userId');
    const status = searchParams.get('status');

    let query: Record<string, unknown> = {};
    if (status) query.status = status;

    // Admin can view any orders. Normal users can only view their own orders.
    if (user.role === 'admin') {
      if (userIdParam) query.userId = userIdParam;
    } else {
      query.userId = user.userId;
    }

    const orders = await Order.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Orders API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();

    // Force order to belong to the authenticated user
    const orderData = {
      ...body,
      userId: user.role === 'admin' ? (body.userId || user.userId) : user.userId,
    };

    const order = await Order.create(orderData);
    return NextResponse.json(order);
  } catch (error) {
    console.error('Orders API create error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
