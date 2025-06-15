import { PrismaClient } from '@prisma/client';
const prismaClient = new PrismaClient({
    datasources: {
      db: {
        url: process.env.SUPABASE_DATABASE,
      },
    },
  });

export default prismaClient