import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        packages: true,
        category: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Sort by sequence in memory
    const sortedProducts = [...products].sort((a, b) => {
      // Type assertion since we know sequence exists in the database
      return ((a as unknown as { sequence: number }).sequence || 0) - 
             ((b as unknown as { sequence: number }).sequence || 0);
    });

    return NextResponse.json(sortedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 