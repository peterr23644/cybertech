import type { ChatMessage } from '@/components/chat/types';

export type ChatApiResult =
  | { ok: true; done: false; reply: string }
  | { ok: true; done: true; summary: string; nextStep: string }
  | { ok: false };

/**
 * Sends the conversation so far to the server chat route and returns either
 * the next assistant reply, or the final summary + next step once the
 * self-check is complete. Never throws; failures come back as { ok: false }
 * so the caller can show a friendly retry instead of a raw error.
 */
export async function sendChatMessage(
  history: ChatMessage[],
  token: string | null,
): Promise<ChatApiResult> {
  if (!token) return { ok: false };

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        messages: history.map((message) => ({ role: message.role, text: message.text })),
      }),
    });

    if (!response.ok) return { ok: false };

    const data = await response.json();

    if (data.done === true && typeof data.summary === 'string' && typeof data.nextStep === 'string') {
      return { ok: true, done: true, summary: data.summary, nextStep: data.nextStep };
    }

    if (typeof data.reply === 'string') {
      return { ok: true, done: false, reply: data.reply };
    }

    return { ok: false };
  } catch {
    return { ok: false };
  }
}
