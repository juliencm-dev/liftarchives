import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware, type SessionUser } from "@/middleware/auth";
import {
  CreateClubSchema,
  UpdateClubSchema,
  AddClubMemberSchema,
} from "@liftarchives/shared";
import {
  db,
  createClub,
  getClubById,
  updateClub,
  deleteClub,
  getUserClubs,
  addClubMember,
  removeClubMember,
  isClubMember,
} from "@liftarchives/database";

type Env = {
  Variables: {
    user: SessionUser;
  };
};

const requireClubMember = createMiddleware<Env>(async (c, next) => {
  const user = c.get("user");
  const clubId = c.req.param("id");
  if (!clubId) return c.json({ message: "Club ID required" }, 400);

  const member = await isClubMember(db, clubId, user.id);
  if (!member) return c.json({ message: "Not a club member" }, 403);

  await next();
});

const requireClubOwner = createMiddleware<Env>(async (c, next) => {
  const user = c.get("user");
  const clubId = c.req.param("id");
  if (!clubId) return c.json({ message: "Club ID required" }, 400);

  const club = await getClubById(db, clubId);
  if (!club) return c.json({ message: "Club not found" }, 404);
  if (club.ownerId !== user.id) return c.json({ message: "Owner only" }, 403);

  await next();
});

export const clubRoutes = new Hono<Env>()
  .use("*", authMiddleware)

  // ── Create Club ──
  .post("/", zValidator("json", CreateClubSchema), async (c) => {
    const user = c.get("user");
    const data = c.req.valid("json");
    const club = await createClub(db, user.id, data);
    return c.json({ club }, 201);
  })

  // ── List User's Clubs ──
  .get("/", async (c) => {
    const user = c.get("user");
    const clubs = await getUserClubs(db, user.id);
    return c.json({ clubs });
  })

  // ── Get Club Detail ──
  .get("/:id", requireClubMember, async (c) => {
    const clubId = c.req.param("id");
    const club = await getClubById(db, clubId);
    if (!club) return c.json({ message: "Club not found" }, 404);
    return c.json({ club });
  })

  // ── Update Club ──
  .put("/:id", requireClubOwner, zValidator("json", UpdateClubSchema), async (c) => {
    const user = c.get("user");
    const clubId = c.req.param("id");
    const data = c.req.valid("json");
    const updated = await updateClub(db, user.id, clubId, data);
    if (!updated) return c.json({ message: "Club not found" }, 404);
    return c.json({ club: updated });
  })

  // ── Delete Club ──
  .delete("/:id", requireClubOwner, async (c) => {
    const user = c.get("user");
    const clubId = c.req.param("id");
    const deleted = await deleteClub(db, user.id, clubId);
    if (!deleted) return c.json({ message: "Club not found" }, 404);
    return c.json({ deleted: true });
  })

  // ── Add Member ──
  .post(
    "/:id/members",
    requireClubOwner,
    zValidator("json", AddClubMemberSchema),
    async (c) => {
      const clubId = c.req.param("id");
      const { userId, role } = c.req.valid("json");
      const result = await addClubMember(db, clubId, userId, role);

      if (result.error === "already_member") {
        return c.json({ message: "User is already a member" }, 409);
      }

      return c.json({ membership: result.membership }, 201);
    },
  )

  // ── Remove Member ──
  .delete("/:id/members/:userId", requireClubOwner, async (c) => {
    const clubId = c.req.param("id");
    const userId = c.req.param("userId");
    const result = await removeClubMember(db, clubId, userId);

    if (result.error === "cannot_remove_owner") {
      return c.json({ message: "Cannot remove the club owner" }, 400);
    }
    if (result.error === "not_found") {
      return c.json({ message: "Member not found" }, 404);
    }

    return c.json({ removed: true });
  });
