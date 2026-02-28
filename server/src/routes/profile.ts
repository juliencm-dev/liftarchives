import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware, type SessionUser } from "@/middleware/auth";
import {
  LifterProfileSchema,
  UpdateCoachProfileSchema,
} from "@liftarchives/shared";
import {
  db,
  getLifterProfile,
  createLifterProfile,
  updateLifterProfile,
  getCoachProfile,
  updateCoachProfile,
  getCompetitionProfile,
} from "@liftarchives/database";

type Env = {
  Variables: {
    user: SessionUser;
  };
};

const profileRoutes = new Hono<Env>()
  .use("*", authMiddleware)
  .get("/lifter", async (c) => {
    const user = c.get("user");
    const profile = await getLifterProfile(db, user.id);
    return c.json({ profile: profile ?? null });
  })
  .post("/lifter", zValidator("json", LifterProfileSchema), async (c) => {
    const user = c.get("user");
    const data = c.req.valid("json");

    const existing = await getLifterProfile(db, user.id);
    if (existing) {
      return c.json({ message: "Lifter profile already exists" }, 409);
    }

    const profile = await createLifterProfile(db, user.id, data);
    return c.json({ profile }, 201);
  })
  .put("/lifter", zValidator("json", LifterProfileSchema), async (c) => {
    const user = c.get("user");
    const data = c.req.valid("json");

    const existing = await getLifterProfile(db, user.id);
    if (!existing) {
      return c.json({ message: "Lifter profile not found" }, 404);
    }

    const profile = await updateLifterProfile(db, user.id, data);
    return c.json({ profile });
  })
  .get("/competition", async (c) => {
    const user = c.get("user");
    const profile = await getCompetitionProfile(db, user.id);
    return c.json({ profile: profile ?? null });
  })
  .get("/coach", async (c) => {
    const user = c.get("user");
    const profile = await getCoachProfile(db, user.id);
    return c.json({ profile: profile ?? null });
  })
  .put("/coach", zValidator("json", UpdateCoachProfileSchema), async (c) => {
    const user = c.get("user");
    const data = c.req.valid("json");

    const existing = await getCoachProfile(db, user.id);
    if (!existing) {
      return c.json({ message: "Coach profile not found" }, 404);
    }

    const profile = await updateCoachProfile(db, user.id, data);
    return c.json({ profile });
  });

export { profileRoutes };
