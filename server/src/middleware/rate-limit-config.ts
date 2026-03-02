import {
  RateLimiter,
  createRateLimitMiddleware,
  getClientIp,
} from "@/middleware/rate-limit";

const ONE_MINUTE = 60_000;

// 10 requests/min per IP -- auth endpoints (login, signup, password reset)
const authLimiter = new RateLimiter(10, ONE_MINUTE);
export const authRateLimit = createRateLimitMiddleware(
  authLimiter,
  (c) => `auth:${getClientIp(c)}`,
);

// 30 requests/min per IP -- unauthenticated endpoints (health, public)
const unauthLimiter = new RateLimiter(30, ONE_MINUTE);
export const unauthRateLimit = createRateLimitMiddleware(
  unauthLimiter,
  (c) => `unauth:${getClientIp(c)}`,
);

// 120 requests/min per IP -- authenticated API endpoints
const apiLimiter = new RateLimiter(120, ONE_MINUTE);
export const apiRateLimit = createRateLimitMiddleware(
  apiLimiter,
  (c) => `api:${getClientIp(c)}`,
);

// 10 requests/min per IP -- AI/agent endpoints (program generation, image extraction)
// These call external LLM APIs and are expensive — keep tight.
const aiLimiter = new RateLimiter(10, ONE_MINUTE);
export const aiRateLimit = createRateLimitMiddleware(
  aiLimiter,
  (c) => `ai:${getClientIp(c)}`,
);
