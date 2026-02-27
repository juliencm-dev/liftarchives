import type { Context, MiddlewareHandler } from "hono";

/**
 * Sliding-window counter rate limiter.
 * Constant memory per key -- stores only a counter + window start timestamp.
 */
export class RateLimiter {
  private windows = new Map<string, { count: number; start: number }>();
  private cleanupTimer: ReturnType<typeof setInterval>;

  constructor(
    /** Max requests allowed per window */
    public readonly limit: number,
    /** Window duration in milliseconds */
    public readonly windowMs: number,
  ) {
    // Clean up expired entries every 60s
    this.cleanupTimer = setInterval(() => this.cleanup(), 60_000);
    // Allow the timer to not block process exit
    if (this.cleanupTimer.unref) this.cleanupTimer.unref();
  }

  /**
   * Check and consume one request for the given key.
   * Returns { allowed, remaining, resetMs }.
   */
  check(key: string): {
    allowed: boolean;
    remaining: number;
    resetMs: number;
  } {
    const now = Date.now();
    const entry = this.windows.get(key);

    if (!entry || now - entry.start >= this.windowMs) {
      // New window
      this.windows.set(key, { count: 1, start: now });
      return {
        allowed: true,
        remaining: this.limit - 1,
        resetMs: this.windowMs,
      };
    }

    entry.count++;

    if (entry.count > this.limit) {
      const resetMs = this.windowMs - (now - entry.start);
      return {
        allowed: false,
        remaining: 0,
        resetMs,
      };
    }

    const resetMs = this.windowMs - (now - entry.start);
    return {
      allowed: true,
      remaining: this.limit - entry.count,
      resetMs,
    };
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.windows) {
      if (now - entry.start >= this.windowMs) {
        this.windows.delete(key);
      }
    }
  }

  dispose() {
    clearInterval(this.cleanupTimer);
  }
}

/**
 * Extract client IP from request headers (supports proxies).
 */
export function getClientIp(c: Context): string {
  return (
    c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ||
    c.req.header("x-real-ip") ||
    "unknown"
  );
}

/**
 * Factory: creates a Hono middleware from a RateLimiter + key extractor.
 */
export function createRateLimitMiddleware(
  limiter: RateLimiter,
  keyExtractor: (c: Context) => string,
): MiddlewareHandler {
  return async (c, next) => {
    const key = keyExtractor(c);
    const { allowed, remaining, resetMs } = limiter.check(key);

    c.header("X-RateLimit-Limit", String(limiter.limit));
    c.header("X-RateLimit-Remaining", String(remaining));
    c.header("X-RateLimit-Reset", String(Math.ceil(resetMs / 1000)));

    if (!allowed) {
      c.header("Retry-After", String(Math.ceil(resetMs / 1000)));
      return c.json({ message: "Too many requests" }, 429);
    }

    await next();
  };
}
