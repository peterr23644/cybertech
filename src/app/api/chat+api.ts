import { parseAssistantReply, requestClaudeReply } from '@/server/claude';
import { verifyClerkSession } from '@/server/clerk';
import { isRateLimited } from '@/server/rateLimit';

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 2000;
const GENERIC_ERROR_MESSAGE =
  "I couldn't reply just now. Please try again in a moment.";

type IncomingMessage = { role: 'user' | 'assistant'; text: string };

function parseMessages(body: unknown): IncomingMessage[] | null {
  if (!body || typeof body !== 'object' || !Array.isArray((body as any).messages)) {
    return null;
  }

  const messages = (body as { messages: unknown[] }).messages;
  if (messages.length === 0 || messages.length > MAX_MESSAGES) return null;

  const parsed: IncomingMessage[] = [];
  for (const entry of messages) {
    if (
      !entry ||
      typeof entry !== 'object' ||
      ((entry as any).role !== 'user' && (entry as any).role !== 'assistant') ||
      typeof (entry as any).text !== 'string' ||
      (entry as any).text.length === 0 ||
      (entry as any).text.length > MAX_MESSAGE_LENGTH
    ) {
      return null;
    }
    parsed.push({ role: (entry as any).role, text: (entry as any).text });
  }

  return parsed;
}

export async function POST(request: Request) {
  const clerkId = await verifyClerkSession(request);
  if (!clerkId) {
    return new Response('Unauthorized', { status: 401 });
  }

  if (isRateLimited(clerkId)) {
    return Response.json(
      { error: "You're sending messages a little too fast. Please wait a moment and try again." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const messages = parseMessages(body);
  if (!messages) {
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  }

  try {
    const reply = await requestClaudeReply(
      messages.map((m) => ({ role: m.role, content: m.text })),
    );
    return Response.json(parseAssistantReply(reply));
  } catch {
    return Response.json({ error: GENERIC_ERROR_MESSAGE }, { status: 503 });
  }
}
