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

// Type for JWT payload
interface JWTPayload {
  id: string;
  role: Role;
}

export async function GET(request: Request) {
  try {
    // Get token from cookies
    const cookieStore = cookies();
    const token = (await cookieStore).get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Not authorized' },
        { status: 401 }
      );
    }

    // Verify token and check admin role
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    if (!decoded.role || decoded.role !== Role.ADMIN) {
      return NextResponse.json(
        { message: 'Not authorized' },
        { status: 401 }
      );
    }

    // Get orders for the last 12 months
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setMonth(startDate.getMonth() - 11); // Go back 11 months to get 12 months total

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        createdAt: true,
        status: true,
      },
    });

    // Create a map to store monthly counts
    const monthlyData = new Array(12).fill(null).map(() => ({
      totalOrders: 0,
      deliveredOrders: 0
    }));
    
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    // Count orders by month
    orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      const monthIndex = orderDate.getMonth();
      const yearDiff = orderDate.getFullYear() - startDate.getFullYear();
      const monthDiff = monthIndex - startDate.getMonth() + (yearDiff * 12);
      
      if (monthDiff >= 0 && monthDiff < 12) {
        monthlyData[monthDiff].totalOrders++;
        if (order.status === 'DELIVERED') {
          monthlyData[monthDiff].deliveredOrders++;
        }
      }
    });

    // Format the response data
    const formattedData = monthlyData.map((data, index) => {
      const date = new Date(startDate);
      date.setMonth(startDate.getMonth() + index);
      return {
        month: monthNames[date.getMonth()],
        year: date.getFullYear(),
        totalOrders: data.totalOrders,
        deliveredOrders: data.deliveredOrders,
        pendingOrders: data.totalOrders - data.deliveredOrders
      };
    });

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error fetching monthly order stats:', error);
    return NextResponse.json(
      { message: 'Error fetching statistics' },
      { status: 500 }
    );
  }
} 