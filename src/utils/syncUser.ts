/**
 * Upserts the signed-in learner's User record from a verified Clerk token.
 * Failures are non-critical and never block the app.
 */
export async function syncUser(getToken: () => Promise<string | null>): Promise<void> {
  try {
    const token = await getToken();
    if (!token) return;

    await fetch('/api/users/sync', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error('Failed to sync user', error);
  }
}
