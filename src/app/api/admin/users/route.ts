import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.SUPABASE_DATABASE,
    },
  },
});

export async function GET(request: Request) {
  try {
    // Auth: only admin
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string };
    if (decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }
    // Get all users with order count and total spent
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        orders: {
          select: {
            id: true,
            totalAmount: true,
            status: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    const result = users.map(u => {
      const orders = u.orders || [];
      const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt,
        ordersCount: orders.length,
        totalSpent,
        lastOrder: orders[0] || null,
        deliveredCount: orders.filter(o => o.status === 'DELIVERED').length,
        pendingCount: orders.filter(o => o.status === 'PENDING').length,
      };
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching users for admin:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 