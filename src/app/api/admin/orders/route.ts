import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prismaClient from '../../util';
import jwt from 'jsonwebtoken';

const ITEMS_PER_PAGE = 10;

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

    // Verify admin role
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string };
    if (decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Not authorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || '';
    const sort = url.searchParams.get('sort') || 'desc';

    // Calculate skip value for pagination
    const skip = (page - 1) * ITEMS_PER_PAGE;

    // Build the where clause for search and status filter
    let where: any = {};
    if (search) {
      where.OR = [
        { customerName: { contains: search, mode: 'insensitive' } },
        { customerEmail: { contains: search, mode: 'insensitive' } },
        { customerPhone: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status) {
      where.status = status;
    }

    // Get total count for pagination
    const totalOrders = await prismaClient.order.count({ where });

    // Get orders for current page
    const orders = await prismaClient.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: sort === 'asc' ? 'asc' : 'desc',
      },
      skip,
      take: ITEMS_PER_PAGE,
    });

    // Map orders to include productName, productImage, and packageType in each item
    const mappedOrders = (orders as any[]).map(order => ({
      ...order,
      items: (order.items as any[]).map((item: any) => ({
        id: item.id,
        productName: item.product?.name || item.productName,
        productImage: item.product?.image || item.productImage,
        packageType: item.packageType,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      })),
    }));

    return NextResponse.json({
      orders: mappedOrders,
      totalPages: Math.ceil(totalOrders / ITEMS_PER_PAGE),
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { message: 'Error fetching orders' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string };
    if (decoded.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }
    const { orderId, status } = await request.json();
    if (!orderId || !status) {
      return NextResponse.json({ message: 'Order ID and status are required' }, { status: 400 });
    }
    const updatedOrder = await prismaClient.order.update({
      where: { id: orderId },
      data: { status },
    });
    return NextResponse.json({ order: updatedOrder });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ message: 'Error updating order status' }, { status: 500 });
  }
}