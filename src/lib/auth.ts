import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

export interface DecodedToken {
  userId: string;
  email: string;
  role: 'admin' | 'user';
  name: string;
}

export function getAuthUser(req: NextRequest): DecodedToken | null {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function isAdmin(req: NextRequest): boolean {
  const user = getAuthUser(req);
  return user?.role === 'admin';
}
