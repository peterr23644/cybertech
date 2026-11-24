/**
 * Client-side safety net: catches self-harm, suicide, abuse, or immediate
 * danger wording so the quiz still stops safely even if the AI service is
 * unavailable. Mirrors the server system prompt's safety override.
 */
const SAFETY_KEYWORDS = [
  'suicide',
  'suicidal',
  'kill myself',
  'end my life',
  'end it all',
  'want to die',
  "don't want to live",
  'self harm',
  'self-harm',
  'hurt myself',
  'cutting myself',
  'abuse',
  'abused',
  'being abused',
  'in danger',
  'not safe right now',
];

export function hasSafetyConcern(text: string): boolean {
  const normalized = text.toLowerCase();
  return SAFETY_KEYWORDS.some((keyword) => normalized.includes(keyword));
}

export function getSafetyResponse(): string {
  return "Thank you for telling me. What you're feeling matters, and you deserve support right now. Please talk to a trusted adult immediately. You can also call Childline Kenya at 116 - it's free, any time.";
}
