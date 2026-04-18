import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        details: true,
        price: true,
        image: true,
        stock: true,
        sequence: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        packages: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
      orderBy: {
        sequence: 'asc'
      }
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 
