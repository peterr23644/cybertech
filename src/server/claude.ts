const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
const MODEL = 'claude-sonnet-5-5';
const MAX_TOKENS = 512;

export const SYSTEM_PROMPT = `You support a young learner through a short, friendly self-check to help
them understand whether something that happened to them may be bullying.

How to talk:
- Use simple, warm, supportive language suited to a young learner.
- Ask only one self-check question at a time, and wait for their answer
  before asking the next one. Cover these in order, in your own gentle
  words: Was it repeated? Did it hurt or make you feel unsafe? Was it public
  or witnessed by others?
- Never minimize, judge, or blame the learner for what happened.
- Never claim to give a diagnosis, a legal judgment, or a guarantee. Make
  clear this is just a supportive check-in, not an official decision.

When you have answers to all three questions, do not keep chatting. Reply
with exactly these three lines and nothing else:
DONE
SUMMARY: <one or two warm, plain-language sentences summarizing what they shared>
NEXT_STEP: <one suggested next step, such as talking to a trusted adult, teacher, parent, or school counselor>

Safety override (always applies, even mid-question): if the learner mentions
self-harm, suicide, abuse, or being in immediate danger, stop the self-check
right away. Respond with warmth (not the DONE format above), encourage them
to talk to a trusted adult right now, and share: Childline Kenya, call 116
(free, 24/7).`;

export type ClaudeMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export class ClaudeRequestError extends Error {}

/**
 * Calls the Claude Messages API and returns the assistant's reply text.
 * Throws ClaudeRequestError on any failure; callers must not surface the
 * underlying error to the client.
 */
export async function requestClaudeReply(messages: ClaudeMessage[]): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new ClaudeRequestError('Missing ANTHROPIC_API_KEY');
  }

  let response: Response;
  try {
    response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': ANTHROPIC_VERSION,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: SYSTEM_PROMPT,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });
  } catch {
    throw new ClaudeRequestError('Network error contacting Claude API');
  }

  if (!response.ok) {
    throw new ClaudeRequestError(`Claude API returned status ${response.status}`);
  }

  const data = await response.json();
  const text = data?.content?.find?.((block: { type: string }) => block.type === 'text')?.text;

  if (typeof text !== 'string' || text.length === 0) {
    throw new ClaudeRequestError('Claude API returned no text content');
  }

  return text;
}

export type ParsedReply =
  | { done: false; reply: string }
  | { done: true; summary: string; nextStep: string };

/**
 * Parses the assistant's raw reply for the DONE/SUMMARY/NEXT_STEP format
 * requested in the system prompt. Falls back to a plain reply whenever the
 * format isn't present, e.g. mid-quiz questions or the safety override.
 */
export function parseAssistantReply(text: string): ParsedReply {
  const lines = text
    .trim()
    .split('\n')
    .map((line) => line.trim());

  if (lines[0]?.toUpperCase() === 'DONE') {
    const summaryLine = lines.find((line) => /^SUMMARY:/i.test(line));
    const nextStepLine = lines.find((line) => /^NEXT_STEP:/i.test(line));
    const summary = summaryLine?.slice(summaryLine.indexOf(':') + 1).trim();
    const nextStep = nextStepLine?.slice(nextStepLine.indexOf(':') + 1).trim();

    if (summary && nextStep) {
      return { done: true, summary, nextStep };
    }
  }

  return { done: false, reply: text.trim() };
}
