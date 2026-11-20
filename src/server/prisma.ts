import { PrismaNeon } from '@prisma/adapter-neon';

import { PrismaClient } from '@/generated/prisma/client';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('Missing DATABASE_URL in the server environment');
}

const adapter = new PrismaNeon({ connectionString });

export const prisma = new PrismaClient({ adapter });
