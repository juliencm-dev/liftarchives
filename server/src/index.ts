import "dotenv/config";
import "@/env";

import { Hono } from "hono";
import { auth } from "@/auth";
import { logger } from "hono/logger";
import { cors } from "hono/cors";

import { authRateLimit, unauthRateLimit } from "@/middleware/rate-limit-config";
import { profileRoutes } from "@/routes/profile";
import { liftsRoutes } from "@/routes/lifts";
import { programRoutes } from "@/routes/programs";
import { sessionRoutes } from "@/routes/sessions";
import { db, isAccountLocked, lockAccountByEmail } from "@liftarchives/database";
import {
  recordFailure,
  clearFailures,
  markLocked,
  isLockedInMemory,
  MAX_FAILURES,
} from "@/hooks/auth/signin";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: (origin) => {
      if (!origin) return null;

      const frontendUrl =
        process.env.NODE_ENV === "production"
          ? process.env.FRONTEND_URL!
          : "http://localhost:3000";
      if (origin === frontendUrl) return origin;

      return null;
    },
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS", "PUT", "DELETE"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);
app.use("*", logger());

// Reject request bodies larger than 1 MB
app.use("*", async (c, next) => {
  const contentLength = c.req.header("content-length");
  if (contentLength && parseInt(contentLength, 10) > 1_000_000) {
    return c.json({ message: "Payload too large" }, 413);
  }
  await next();
});

app.use("/api/auth/*", authRateLimit);
app.on(["POST", "GET"], "/api/auth/*", async (c) => {
  const url = new URL(c.req.url);
  const isSignIn =
    c.req.method === "POST" && url.pathname === "/api/auth/sign-in/email";

  if (!isSignIn) {
    return auth.handler(c.req.raw);
  }

  // Clone the request so we can read the body without consuming it
  const cloned = c.req.raw.clone();
  let email: string | undefined;
  try {
    const body = (await cloned.json()) as { email?: string };
    email = body?.email?.toLowerCase();
  } catch {
    // If body parsing fails, let better-auth handle it
    return auth.handler(c.req.raw);
  }

  if (!email) {
    return auth.handler(c.req.raw);
  }

  // Fast-path: check in-memory lock
  if (isLockedInMemory(email)) {
    return c.json({ message: "Account is locked. Please reset your password." }, 403);
  }

  // Check DB lock status
  if (await isAccountLocked(db, email)) {
    markLocked(email);
    return c.json({ message: "Account is locked. Please reset your password." }, 403);
  }

  // Forward to better-auth
  const response = await auth.handler(c.req.raw);
  const status = response.status;

  if (status >= 200 && status < 300) {
    clearFailures(email);
  } else {
    const count = recordFailure(email);
    if (count >= MAX_FAILURES) {
      await lockAccountByEmail(db, email);
      markLocked(email);
      console.log(`[Auth] Account locked for ${email} after ${count} failed attempts.`);
    }
  }

  return response;
});

const routes = app
  .get("/api/health", unauthRateLimit, (c) => {
    return c.json({ status: "ok" });
  })
  .route("/api/profile", profileRoutes)
  .route("/api/lifts", liftsRoutes)
  .route("/api/programs", programRoutes)
  .route("/api/sessions", sessionRoutes);

// Global error handler
app.onError((err, c) => {
  console.error("[Server] Unhandled error:", err);
  return c.json({ message: "Internal server error" }, 500);
});

export default {
  fetch: app.fetch,
  port: 4000,
};

export type AppType = typeof routes;
