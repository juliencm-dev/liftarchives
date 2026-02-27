const WINDOW_MS = 60_000; // 1-minute sliding window
const MAX_FAILURES = 10;

/** In-memory map: email -> array of failure timestamps within the window */
const failures = new Map<string, number[]>();

/** In-memory fast-path lock set (avoids DB round-trip on every request) */
const lockedEmails = new Set<string>();

/**
 * Record a failed sign-in attempt.
 * Returns the number of failures in the current window.
 */
export function recordFailure(email: string): number {
  const now = Date.now();
  const cutoff = now - WINDOW_MS;

  let timestamps = failures.get(email);
  if (!timestamps) {
    timestamps = [];
    failures.set(email, timestamps);
  }

  // Prune old entries
  const filtered = timestamps.filter((t) => t > cutoff);
  filtered.push(now);
  failures.set(email, filtered);

  return filtered.length;
}

/**
 * Clear failure history for an email (called on successful login or password reset).
 */
export function clearFailures(email: string): void {
  failures.delete(email);
  lockedEmails.delete(email);
}

/**
 * Mark an email as locked in the in-memory fast-path set.
 */
export function markLocked(email: string): void {
  lockedEmails.add(email);
}

/**
 * Check if an email is locked via the in-memory fast-path.
 * If this returns false, the caller should still check the DB `locked` column.
 */
export function isLockedInMemory(email: string): boolean {
  return lockedEmails.has(email);
}

export { MAX_FAILURES };
