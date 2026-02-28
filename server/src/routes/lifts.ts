import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware, type SessionUser } from "@/middleware/auth";
import { AddPersonalRecordSchema, CreateLiftSchema } from "@liftarchives/shared";
import {
  db,
  getAllLifts,
  getAllAvailableLifts,
  createLift,
  getUserRecords,
  getUserBestRecords,
  getRecentUserRecords,
  createPersonalRecord,
  deletePersonalRecord,
} from "@liftarchives/database";

type Env = {
  Variables: {
    user: SessionUser;
  };
};

const liftsRoutes = new Hono<Env>()
  .use("*", authMiddleware)
  .get("/", async (c) => {
    const user = c.get("user");
    const allLifts = await getAllLifts(db, user.id);
    return c.json({ lifts: allLifts });
  })
  .get("/all", async (c) => {
    const user = c.get("user");
    const allLifts = await getAllAvailableLifts(db, user.id);
    return c.json({ lifts: allLifts });
  })
  .post("/", zValidator("json", CreateLiftSchema), async (c) => {
    const user = c.get("user");
    const data = c.req.valid("json");
    const lift = await createLift(db, user.id, data);
    return c.json({ lift }, 201);
  })
  .get("/records", async (c) => {
    const user = c.get("user");
    const liftId = c.req.query("liftId");
    const records = await getUserRecords(db, user.id, liftId || undefined);
    return c.json({ records });
  })
  .get("/records/recent", async (c) => {
    const user = c.get("user");
    const records = await getRecentUserRecords(db, user.id);
    return c.json({ records });
  })
  .get("/records/best", async (c) => {
    const user = c.get("user");
    const records = await getUserBestRecords(db, user.id);
    return c.json({ records });
  })
  .post("/records", zValidator("json", AddPersonalRecordSchema), async (c) => {
    const user = c.get("user");
    const data = c.req.valid("json");

    // Epley formula for estimated 1RM: weight * (1 + reps / 30)
    const estimatedOneRepMax =
      data.reps > 1
        ? Math.round(data.weight * (1 + data.reps / 30) * 100) / 100
        : data.weight;

    const record = await createPersonalRecord(db, user.id, {
      id: crypto.randomUUID(),
      liftId: data.liftId,
      weight: data.weight,
      reps: data.reps,
      estimatedOneRepMax,
      date: data.date,
      notes: data.notes,
    });

    return c.json({ record }, 201);
  })
  .delete("/records/:id", async (c) => {
    const user = c.get("user");
    const recordId = c.req.param("id");
    const deleted = await deletePersonalRecord(db, user.id, recordId);

    if (!deleted) {
      return c.json({ message: "Record not found" }, 404);
    }

    return c.json({ record: deleted });
  });

export { liftsRoutes };
