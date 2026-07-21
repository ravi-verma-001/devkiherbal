import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'INR', customerName, customerEmail, customerPhone } = await request.json();

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }

    const appType = process.env.CASHFREE_ENV === 'production' ? 'production' : 'sandbox';
    const cashfreeHost = appType === 'production' 
      ? 'https://api.cashfree.com/pg' 
      : 'https://sandbox.cashfree.com/pg';

    const orderId = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    let origin = request.nextUrl.origin;
    if (origin.startsWith('http://') && appType === 'production') {
      origin = origin.replace('http://', 'https://');
    }

    const response = await fetch(`${cashfreeHost}/orders`, {
      method: 'POST',
      headers: {
        'x-client-id': process.env.CASHFREE_APP_ID || '',
        'x-client-secret': process.env.CASHFREE_SECRET_KEY || '',
        'x-api-version': '2023-08-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: Number(amount),
        order_currency: currency,
        customer_details: {
          customer_id: `cust_${Date.now()}`,
          customer_name: customerName || 'Guest Customer',
          customer_email: customerEmail || 'guest@example.com',
          customer_phone: customerPhone || '9999999999',
        },
        order_meta: {
          return_url: `${origin}/checkout?order_id={order_id}`,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create order on Cashfree');
    }

    return NextResponse.json({
      order_id: data.order_id,
      payment_session_id: data.payment_session_id,
      order_status: data.order_status,
    });
  } catch (error: any) {
    console.error('Cashfree Order Error:', error);
    return NextResponse.json(
      { error: 'Failed to create Cashfree order', details: error.message },
      { status: 500 }
    );
  }
}
