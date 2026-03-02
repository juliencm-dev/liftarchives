import type { Context, MiddlewareHandler } from "hono";

interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

let _kv: KVNamespace | null = null;

/** Called from server middleware to pass the CACHE KV binding */
export function setKV(binding: KVNamespace) {
  _kv = binding;
}

function getKV(): KVNamespace | null {
  return _kv;
}

/**
 * KV-backed sliding-window rate limiter for Cloudflare Workers.
 *
 * Each key stores a JSON `{ count, start }` in KV with a TTL matching the window.
 * Falls back to allow-all if KV is unavailable (dev without KV).
 */
export class RateLimiter {
  constructor(
    public readonly limit: number,
    public readonly windowMs: number,
  ) {}

  async check(key: string): Promise<{
    allowed: boolean;
    remaining: number;
    resetMs: number;
  }> {
    const kv = getKV();
    if (!kv) {
      // No KV available — allow request (graceful degradation in dev)
      return { allowed: true, remaining: this.limit - 1, resetMs: this.windowMs };
    }

    const now = Date.now();
    const raw = await kv.get(`rl:${key}`);
    let count = 0;
    let start = now;

    if (raw) {
      try {
        const entry = JSON.parse(raw);
        if (now - entry.start < this.windowMs) {
          count = entry.count;
          start = entry.start;
        }
        // else: window expired, start fresh
      } catch {
        // Corrupted entry, start fresh
      }
    }

    count++;
    const ttlSeconds = Math.ceil((this.windowMs - (now - start)) / 1000);

    await kv.put(
      `rl:${key}`,
      JSON.stringify({ count, start }),
      { expirationTtl: Math.max(ttlSeconds, 60) },
    );

    if (count > this.limit) {
      return {
        allowed: false,
        remaining: 0,
        resetMs: this.windowMs - (now - start),
      };
    }

    return {
      allowed: true,
      remaining: this.limit - count,
      resetMs: this.windowMs - (now - start),
    };
  }
}

/**
 * Extract client IP — on Cloudflare, CF-Connecting-IP is the real client IP.
 */
export function getClientIp(c: Context): string {
  return (
    c.req.header("cf-connecting-ip") ||
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
    const { allowed, remaining, resetMs } = await limiter.check(key);

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
