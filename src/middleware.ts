import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const allowedOrigins = [
  'https://devkiherbal.in',
  'https://www.devkiherbal.in',
  'http://localhost:3000',
];

// Simple in-memory rate limiting store
// Note: As warned in the implementation plan, this store will reset on new serverless instances.
// For production scale, replace this store with Upstash Redis.
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10; // Max 10 requests per window for sensitive paths

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return (request as any).ip || request.headers.get('x-real-ip') || '127.0.0.1';
}

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin');
  const path = request.nextUrl.pathname;

  // 1. Rate Limiting for sensitive endpoints
  const sensitivePaths = [
    '/api/auth/login',
    '/api/auth/signup',
    '/api/cashfree/order',
    '/api/razorpay/order',
  ];

  if (sensitivePaths.some(p => path.startsWith(p))) {
    const ip = getClientIp(request);
    const key = `${ip}:${path}`;
    const now = Date.now();
    const limitInfo = rateLimitStore.get(key);

    if (!limitInfo || now > limitInfo.resetTime) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + RATE_LIMIT_WINDOW_MS,
      });
    } else {
      limitInfo.count++;
      if (limitInfo.count > MAX_REQUESTS) {
        return new NextResponse(
          JSON.stringify({ error: 'Too many requests. Please try again later.' }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': Math.ceil((limitInfo.resetTime - now) / 1000).toString(),
            },
          }
        );
      }
    }
  }

  // 2. Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 200 });
    
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    }
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-client-id, x-client-secret, x-api-version');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    
    return response;
  }

  const response = NextResponse.next();

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-client-id, x-client-secret, x-api-version');
  }

  return response;
}

export const config = {
  matcher: '/api/:path*',
};

