import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.SUPABASE_DATABASE,
    },
  },
});

// Register user
export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'All fields required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '30d' });

    return NextResponse.json({ id: user.id, name: user.name, email: user.email, token });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// Login user
export async function PUT(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ 
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true
      }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Create token with role from Prisma enum
    const token = jwt.sign(
      { 
        id: user.id, 
        role: user.role // This will be the Role enum value from Prisma
      },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' }
    );

    // Return user data with role from Prisma
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role, // This will be the Role enum value
      token
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
