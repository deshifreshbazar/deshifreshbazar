import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

interface ProductSequence {
  id: string;
  sequence: number;
}

export async function POST(request: Request) {
  try {
    // Check authentication using JWT token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string };
    if (decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const body = await request.json();
    const { products } = body as { products: ProductSequence[] };

    if (!Array.isArray(products)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    // Update sequences in transaction using raw SQL
    await prisma.$transaction(async (tx) => {
      for (const { id, sequence } of products) {
        await tx.$executeRaw`UPDATE "Product" SET sequence = ${sequence} WHERE id = ${id}`;
      }
    });

    return NextResponse.json({ message: 'Products reordered successfully' });
  } catch (error) {
    console.error('Error reordering products:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 