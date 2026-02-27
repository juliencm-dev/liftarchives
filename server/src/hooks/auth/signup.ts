import { createAuthMiddleware } from "better-auth/api";
import { db, user } from "@liftarchives/database";
import { eq } from "drizzle-orm";

export const finalizeSignUp = createAuthMiddleware(async (ctx) => {
  if (ctx.path !== "/sign-up/email") return;

  const email = ctx.body?.email;
  const name = ctx.body?.name;
  const image = `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(name || email)}`;

  const existingUser = await db.query.user.findFirst({
    where: eq(user.email, email),
  });

  if (existingUser) {
    await db
      .update(user)
      .set({ image })
      .where(eq(user.id, existingUser.id));
  }
});
