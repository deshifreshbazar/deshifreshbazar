import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Retrieve a list of products
 *     description: Retrieve a list of products from the database, including their categories and packages.
 *     responses:
 *       200:
 *         description: A list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   details:
 *                     type: string
 *                   price:
 *                     type: number
 *                   image:
 *                     type: string
 *                   stock:
 *                     type: number
 *                   sequence:
 *                     type: number
 *       500:
 *         description: Internal Server Error
 */
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
