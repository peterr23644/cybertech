import { verifyToken } from '@clerk/backend';

/**
 * Verifies the Clerk session token on an incoming API route request.
 * Returns the Clerk user id, or null if the token is missing or invalid.
 */
export async function verifyClerkSession(request: Request): Promise<string | null> {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : null;

  if (!token) return null;

  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) return null;

  try {
    const payload = await verifyToken(token, { secretKey });
    return payload.sub;
  } catch {
    return null;
  }
}
