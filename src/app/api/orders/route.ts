import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prismaClient from '../util';

// Configure dynamic route handling
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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

interface OrderItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  totalPrice: number;
  selectedPackage?: string;
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

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { 
      fullName, 
      email, 
      phone, 
      address, 
      city, 
      postalCode, 
      country,
      items,
      subtotal,
      shipping,
      total,
      paymentMethod 
    } = data;

    const userId = await getAuthenticatedUserId();

    const order = await prismaClient.order.create({
      data: {
        ...(userId ? { userId } : {}),
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        shippingAddress: address,
        shippingCity: city,
        shippingPostalCode: postalCode,
        shippingCountry: country,
        subtotal: subtotal,
        shippingCost: shipping || 0,
        totalAmount: total,
        paymentMethod: paymentMethod,
        status: 'PENDING',
        items: {
          create: items.map((item: OrderItem) => ({
            productId: item.id,
            productName: item.name,
            productImage: item.image,
            quantity: item.quantity,
            unitPrice: item.price,
            totalPrice: item.totalPrice,
            packageType: item.selectedPackage
          }))
        }
      },
      include: {
        items: true
      }
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json(
        { message: 'Not authorized' },
        { status: 401 }
      );
    }

    // Get orders using Prisma
    const orders = await prismaClient.order.findMany({
      where: {
        userId,
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch orders';
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
} 
