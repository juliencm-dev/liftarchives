import { Hono } from "hono";
import { auth } from "@/auth";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { bodyLimit } from "hono/body-limit";

import { setD1 } from "@liftarchives/database";
import { setKV } from "@/middleware/rate-limit";
import { authRateLimit, unauthRateLimit, apiRateLimit, aiRateLimit } from "@/middleware/rate-limit-config";
import { profileRoutes } from "@/routes/profile";
import { liftsRoutes } from "@/routes/lifts";
import { programRoutes } from "@/routes/programs";
import { sessionRoutes } from "@/routes/sessions";
import { agentRoutes } from "@/routes/agent";
import { avatarRoutes } from "@/routes/avatar";
import { coachRoutes, inviteRoutes } from "@/routes/coach";
import { clubRoutes } from "@/routes/clubs";

const app = new Hono();

// Bridge CF Workers env vars + D1 binding
// Must run before any middleware that accesses env
let envBridged = false;
app.use("*", async (c, next) => {
  if (!envBridged && c.env) {
    for (const [key, val] of Object.entries(c.env)) {
      if (typeof val === "string") process.env[key] = val;
    }
    envBridged = true;
  }
  if ((c.env as any)?.DB) {
    setD1((c.env as any).DB);
  }
  if ((c.env as any)?.CACHE) {
    setKV((c.env as any).CACHE);
  }
  await next();
});

app.use(
  "*",
  cors({
    origin: (origin) => {
      if (!origin) return null;

      const allowed = [
        process.env.FRONTEND_URL,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
      ].filter(Boolean);

      if (allowed.includes(origin)) return origin;

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
app.use("*", secureHeaders());

// Prevent browsers from caching API responses
app.use("/api/*", async (c, next) => {
  await next();
  c.header("Cache-Control", "no-store");
});
app.use("*", async (c, next) => {
  const limit = c.req.path.startsWith("/api/agent")
    ? 10 * 1024 * 1024
    : 1_000_000;
  return bodyLimit({ maxSize: limit })(c, next);
});

app.use("/api/auth/*", authRateLimit);
app.on(["POST", "GET"], "/api/auth/*", async (c) => {
  return auth.handler(c.req.raw);
});

app.use("/api/profile/*", apiRateLimit);
app.use("/api/lifts/*", apiRateLimit);
app.use("/api/programs/*", apiRateLimit);
app.use("/api/sessions/*", apiRateLimit);
app.use("/api/avatar/*", apiRateLimit);
app.use("/api/clubs/*", apiRateLimit);
app.use("/api/coach/*", apiRateLimit);
app.use("/api/invites/*", apiRateLimit);
app.use("/api/agent/*", aiRateLimit);

const routes = app
  .get("/api/health", unauthRateLimit, (c) => {
    return c.json({ status: "ok" });
  })
  .route("/api/profile", profileRoutes)
  .route("/api/lifts", liftsRoutes)
  .route("/api/programs", programRoutes)
  .route("/api/sessions", sessionRoutes)
  .route("/api/agent", agentRoutes)
  .route("/api/avatar", avatarRoutes)
  .route("/api/clubs", clubRoutes)
  .route("/api/coach", coachRoutes)
  .route("/api/invites", inviteRoutes);

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
