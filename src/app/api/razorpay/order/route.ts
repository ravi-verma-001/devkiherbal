import { NextRequest, NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';

export async function POST(request: NextRequest) {
  try {
    if (!razorpay) {
      return NextResponse.json({ error: 'Razorpay is not configured' }, { status: 500 });
    }
    const { amount, currency = 'INR' } = await request.json();

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }

    const options = {
      amount: Math.round(amount * 100), // convert to paise
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    console.error('Razorpay Order Error:', error);
    return NextResponse.json(
      { error: 'Failed to create Razorpay order', details: error.message },
      { status: 500 }
    );
  }
}
