import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware, type SessionUser } from "@/middleware/auth";
import {
  InviteLifterSchema,
  RegisterCoachSchema,
  AssignProgramToLifterSchema,
} from "@liftarchives/shared";
import {
  db,
  getCoachProfile,
  createCoachProfile,
  getLifterProfile,
  getCoachLifters,
  inviteLifter,
  getPendingInvitesForCoach,
  getPendingInvitesForLifter,
  acceptInvite,
  declineInvite,
  removeLifter,
  getCoachVisibleSessions,
  getUserBestRecords,
  assignProgramToLifter,
  getUserPrograms,
} from "@liftarchives/database";

type Env = {
  Variables: {
    user: SessionUser;
  };
};

const requireCoach = createMiddleware<Env>(async (c, next) => {
  const user = c.get("user");
  const profile = await getCoachProfile(db, user.id);
  if (!profile) {
    return c.json({ message: "Coach profile required" }, 403);
  }
  await next();
});

const coachRoutes = new Hono<Env>()
  .use("*", authMiddleware)

  // ── Coach Registration ──
  .post("/register", zValidator("json", RegisterCoachSchema), async (c) => {
    const user = c.get("user");

    // Must have a lifter profile first
    const lifter = await getLifterProfile(db, user.id);
    if (!lifter) {
      return c.json({ message: "Lifter profile required before registering as coach" }, 400);
    }

    const existing = await getCoachProfile(db, user.id);
    if (existing) {
      return c.json({ message: "Coach profile already exists" }, 409);
    }

    const data = c.req.valid("json");
    const profile = await createCoachProfile(db, user.id, data);
    return c.json({ profile }, 201);
  })

  // ── Lifter Roster ──
  .get("/lifters", requireCoach, async (c) => {
    const user = c.get("user");
    const lifters = await getCoachLifters(db, user.id);
    return c.json({ lifters });
  })

  .delete("/lifters/:lifterId", requireCoach, async (c) => {
    const user = c.get("user");
    const lifterId = c.req.param("lifterId");
    const deleted = await removeLifter(db, user.id, lifterId);
    if (!deleted) {
      return c.json({ message: "Lifter not found in roster" }, 404);
    }
    return c.json({ removed: true });
  })

  // ── Invitations (Coach side) ──
  .post(
    "/invite",
    requireCoach,
    zValidator("json", InviteLifterSchema),
    async (c) => {
      const user = c.get("user");
      const { lifterEmail } = c.req.valid("json");
      const result = await inviteLifter(db, user.id, lifterEmail);

      if (result.error === "already_invited") {
        return c.json({ message: "Lifter already has a pending invite" }, 409);
      }
      if (result.error === "already_coaching") {
        return c.json({ message: "Already coaching this lifter" }, 409);
      }

      return c.json({ invitation: result.invitation }, 201);
    },
  )

  .get("/invites", requireCoach, async (c) => {
    const user = c.get("user");
    const invites = await getPendingInvitesForCoach(db, user.id);
    return c.json({ invites });
  })

  // ── Coach Session Feed ──
  .get("/sessions", requireCoach, async (c) => {
    const user = c.get("user");
    const limit = Number(c.req.query("limit") ?? "50");
    const offset = Number(c.req.query("offset") ?? "0");

    const lifters = await getCoachLifters(db, user.id);
    const lifterIds = lifters.map((l) => l.lifterId);

    const sessions = await getCoachVisibleSessions(db, lifterIds, {
      limit,
      offset,
    });
    return c.json({ sessions });
  })

  // ── Single Lifter Views ──
  .get("/lifters/:lifterId/sessions", requireCoach, async (c) => {
    const user = c.get("user");
    const lifterId = c.req.param("lifterId");
    const limit = Number(c.req.query("limit") ?? "20");
    const offset = Number(c.req.query("offset") ?? "0");

    // Verify this lifter is in coach's roster
    const lifters = await getCoachLifters(db, user.id);
    const isMyLifter = lifters.some((l) => l.lifterId === lifterId);
    if (!isMyLifter) {
      return c.json({ message: "Lifter not in your roster" }, 403);
    }

    const sessions = await getCoachVisibleSessions(db, [lifterId], {
      limit,
      offset,
    });
    return c.json({ sessions });
  })

  .get("/lifters/:lifterId/records", requireCoach, async (c) => {
    const user = c.get("user");
    const lifterId = c.req.param("lifterId");

    // Verify this lifter is in coach's roster
    const lifters = await getCoachLifters(db, user.id);
    const isMyLifter = lifters.some((l) => l.lifterId === lifterId);
    if (!isMyLifter) {
      return c.json({ message: "Lifter not in your roster" }, 403);
    }

    const records = await getUserBestRecords(db, lifterId);
    return c.json({ records });
  })

  // ── Assign Program to Lifter ──
  .post(
    "/lifters/:lifterId/assign-program",
    requireCoach,
    zValidator("json", AssignProgramToLifterSchema),
    async (c) => {
      const user = c.get("user");
      const lifterId = c.req.param("lifterId");
      const { programId, startDate } = c.req.valid("json");

      // Verify this lifter is in coach's roster
      const lifters = await getCoachLifters(db, user.id);
      const isMyLifter = lifters.some((l) => l.lifterId === lifterId);
      if (!isMyLifter) {
        return c.json({ message: "Lifter not in your roster" }, 403);
      }

      const assignment = await assignProgramToLifter(
        db,
        user.id,
        programId,
        lifterId,
        startDate,
      );
      if (!assignment) {
        return c.json({ message: "Program not found or not owned by you" }, 404);
      }

      return c.json({ assignment }, 201);
    },
  )

  // ── Coach's Program Library (convenience endpoint) ──
  .get("/programs", requireCoach, async (c) => {
    const user = c.get("user");
    const programs = await getUserPrograms(db, user.id);
    return c.json({ programs });
  });

// ── Lifter-side invite endpoints ──
// These are mounted under /api/invites separately

const inviteRoutes = new Hono<Env>()
  .use("*", authMiddleware)

  .get("/", async (c) => {
    const user = c.get("user");

    // User must have a lifter profile
    const profile = await getLifterProfile(db, user.id);
    if (!profile) {
      return c.json({ invites: [] });
    }

    const invites = await getPendingInvitesForLifter(db, user.id);
    return c.json({ invites });
  })

  .post("/:id/accept", async (c) => {
    const user = c.get("user");
    const inviteId = c.req.param("id");

    const result = await acceptInvite(db, inviteId, user.id);
    if (!result) {
      return c.json({ message: "Invite not found or already handled" }, 404);
    }

    return c.json({ accepted: true });
  })

  .post("/:id/decline", async (c) => {
    const user = c.get("user");
    const inviteId = c.req.param("id");

    const result = await declineInvite(db, inviteId, user.id);
    if (!result) {
      return c.json({ message: "Invite not found or already handled" }, 404);
    }

    return c.json({ declined: true });
  });

export { coachRoutes, inviteRoutes };
