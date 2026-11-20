interface ClerkErrorLike {
  longMessage?: string;
  errors?: { longMessage?: string }[];
}

/** Clerk API errors nest the user-friendly message inside `errors[0]`, not on the top-level error. */
export function getClerkErrorMessage(error: ClerkErrorLike, fallback: string): string {
  return error.errors?.[0]?.longMessage ?? error.longMessage ?? fallback;
}
