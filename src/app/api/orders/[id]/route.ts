import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prismaClient from '../../util';

export const dynamic = 'force-dynamic';

async function verifyToken(token: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  try {
    const decoded = jwt.verify(token, secret);
    return decoded as { id: string };
  } catch {
    return null;
  }
}

async function getAuthenticatedUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (token) {
    const decoded = await verifyToken(token);
    if (decoded?.id) return decoded.id;
  }
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json(
        { message: 'Not authorized' },
        { status: 401 }
      );
    }
    const { id } = await params;
    const order = await prismaClient.order.findUnique({
      where: {
        id,
        userId,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { message: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { message: 'Failed to fetch order' },
      { status: 500 }
    );
  }
} 
