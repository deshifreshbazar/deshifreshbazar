import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prismaClient from '../util';
import { PrismaClient } from '@prisma/client';

// Configure dynamic route handling
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const prisma = new PrismaClient();

// Helper function to verify JWT token
async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded as { id: string };
  } catch (error) {
    return null;
  }
}

// Types for order data
interface OrderItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  totalPrice: number;
  selectedPackage?: string;
}

interface OrderData {
  fullName: string;
  email?: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
}

// Create new order
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

    // Create the order
    const order = await prisma.order.create({
      data: {
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        shippingAddress: address,
        shippingCity: city,
        shippingPostalCode: postalCode,
        shippingCountry: country,
        subtotal: subtotal,
        shippingCost: shipping,
        totalAmount: total,
        paymentMethod: paymentMethod,
        status: 'PENDING',
        items: {
          create: items.map((item: any) => ({
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

// Get orders (for authenticated users)
export async function GET(request: Request) {
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Not authorized' },
        { status: 401 }
      );
    }

    // Verify token and get user ID
    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { message: 'Not authorized' },
        { status: 401 }
      );
    }

    // Get orders using Prisma
    const orders = await prismaClient.order.findMany({
      where: {
        userId: decoded.id,
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