import { createMiddleware } from "hono/factory";
import { auth } from "@/auth";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  plan: string;
};

type AuthEnv = {
  Variables: {
    user: SessionUser;
  };
};

export const authMiddleware = createMiddleware<AuthEnv>(async (c, next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  c.set("user", session.user as SessionUser);
  await next();
});

export const requirePro = createMiddleware<AuthEnv>(async (c, next) => {
  const user = c.get("user");
  if (user.plan !== "pro") {
    return c.json({ message: "Pro plan required" }, 403);
  }
  await next();
});
