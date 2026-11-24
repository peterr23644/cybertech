const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 10;

const requestLog = new Map<string, number[]>();

/**
 * Basic per-user sliding-window rate limit, kept in memory for this server
 * process. Good enough for a single small deployment; swap for a shared
 * store (e.g. Redis) if the app ever runs on multiple instances.
 */
export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    requestLog.set(key, timestamps);
    return true;
  }

  timestamps.push(now);
  requestLog.set(key, timestamps);
  return false;
}
