import { verifyClerkSession } from '@/server/clerk';
import { prisma } from '@/server/prisma';

export async function POST(request: Request) {
  const clerkId = await verifyClerkSession(request);

  if (!clerkId) {
    return new Response('Unauthorized', { status: 401 });
  }

  await prisma.user.upsert({
    where: { clerkId },
    update: {},
    create: { clerkId },
  });

  return Response.json({ ok: true });
}
