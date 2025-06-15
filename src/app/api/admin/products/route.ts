import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

// GET /api/admin/products
export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string };
    if (decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        include: { 
          category: true,
          packages: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.product.count(),
    ]);
    const totalPages = Math.ceil(total / pageSize);
    return NextResponse.json({ products, totalPages });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/products
export async function POST(request: Request) {
  try {
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
    const { name, description, details, price, image, categoryId, stock, slug, packages } = body;

    // Validate required fields
    if (!name || !description || !price || !image || !categoryId || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate price is a number
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      return NextResponse.json(
        { error: 'Invalid price' },
        { status: 400 }
      );
    }

    // Validate stock is a number
    const stockNum = parseInt(stock) || 0;
    if (isNaN(stockNum) || stockNum < 0) {
      return NextResponse.json(
        { error: 'Invalid stock quantity' },
        { status: 400 }
      );
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 400 }
      );
    }

    // Check if slug is unique
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product with this slug already exists' },
        { status: 400 }
      );
    }

    // Create product and packages in a transaction
    const product = await prisma.$transaction(async (tx) => {
      // 1. Create the product
      const newProduct = await tx.product.create({
        data: {
          name,
          description,
          details,
          price: priceNum,
          image,
          categoryId,
          stock: stockNum,
          slug,
        },
      });

      // 2. Create packages if they exist
      if (packages && packages.length > 0) {
        const validPackages = packages.filter((pkg: any) => pkg.name && pkg.price);
        if (validPackages.length > 0) {
          await tx.package.createMany({
            data: validPackages.map((pkg: any) => ({
              name: pkg.name,
              price: parseFloat(pkg.price),
              productId: newProduct.id
            }))
          });
        }
      }

      // 3. Return the product with packages
      return tx.product.findUnique({
        where: { id: newProduct.id },
        include: {
          category: {
            select: {
              name: true,
            },
          },
          packages: true
        },
      });
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 