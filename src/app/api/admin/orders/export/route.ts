import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as XLSX from 'xlsx';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  try {
    // Get query parameters for date filtering
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build where condition for date filtering
    const whereCondition: Prisma.OrderWhereInput = {};
    
    if (startDate || endDate) {
      whereCondition.createdAt = {};
      
      if (startDate) {
        whereCondition.createdAt.gte = new Date(startDate);
      }
      
      if (endDate) {
        // Set time to end of day for the end date
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        whereCondition.createdAt.lte = endDateTime;
      }
    }

    // Fetch orders with date filtering
    const orders = await prisma.order.findMany({
      where: whereCondition,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform orders data for Excel
    const excelData = orders.map(order => ({
      'Order ID': order.id,
      'Customer Name': order.customerName,
      'Customer Email': order.customerEmail,
      'Customer Phone': order.customerPhone,
      'Shipping Address': `${order.shippingAddress}, ${order.shippingCity}, ${order.shippingPostalCode}, ${order.shippingCountry}`,
      'Order Date': order.createdAt.toISOString().split('T')[0],
      'Total Amount': order.totalAmount,
      'Payment Method': order.paymentMethod,
      'Status': order.status,
      'Items Count': order.items.length,
      'Items Details': order.items.map(item => 
        `${item.product.name} (${item.packageType || 'Default'}) x ${item.quantity} @ ৳${item.unitPrice}`
      ).join('; '),
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const columnWidths = [
      { wch: 15 },  // Order ID
      { wch: 20 },  // Customer Name
      { wch: 25 },  // Customer Email
      { wch: 15 },  // Customer Phone
      { wch: 40 },  // Shipping Address
      { wch: 12 },  // Order Date
      { wch: 12 },  // Total Amount
      { wch: 15 },  // Payment Method
      { wch: 12 },  // Status
      { wch: 10 },  // Items Count
      { wch: 60 },  // Items Details
    ];
    worksheet['!cols'] = columnWidths;

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Create response with appropriate headers
    const response = new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="orders.xlsx"',
      },
    });

    return response;
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export orders' },
      { status: 500 }
    );
  }
} 