import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware, type SessionUser } from "@/middleware/auth";
import {
  StartSessionSchema,
  LogSetSchema,
  UpdateSetSchema,
  UpdateSessionSchema,
  AddExerciseSchema,
  BatchSetsSchema,
} from "@liftarchives/shared";
import {
  db,
  startSession,
  getActiveSession,
  getSessionById,
  updateSession,
  discardSession,
  completeSession,
  getUserSessions,
  getWeeklySessionCount,
  getCompletedDaysForWeek,
  addSessionExercise,
  logSessionSet,
  updateSessionSet,
  deleteSessionSet,
  getActiveAssignment,
  advanceWeekIfComplete,
  getPreviousPerformance,
  getTrainingSettings,
  getUserBestRecords,
} from "@liftarchives/database";
import { checkAndRecordPR } from "@/services/pr-detection";
import { suggestWeights } from "@/services/weight-suggestion";

type Env = {
  Variables: {
    user: SessionUser;
  };
};

const sessionRoutes = new Hono<Env>()
  .use("*", authMiddleware)

  // ── Start a new session ──
  .post(
    "/start",
    zValidator("json", StartSessionSchema),
    async (c) => {
      const user = c.get("user");
      const { programDayId, title } = c.req.valid("json");

      // Check for existing active session
      const existing = await getActiveSession(db, user.id);
      if (existing) {
        return c.json(
          { message: "You already have an active session. Complete or discard it first." },
          409,
        );
      }

      const today = new Date().toISOString().split("T")[0];
      const session = await startSession(db, {
        userId: user.id,
        programDayId,
        date: today,
        title,
      });

      const full = await getSessionById(db, user.id, session.id);
      return c.json({ session: full }, 201);
    },
  )

  // ── Get active (in-progress) session ──
  .get("/active", async (c) => {
    const user = c.get("user");
    const session = await getActiveSession(db, user.id);
    if (!session) return c.json({ session: null });

    // Attach the relevant 1RM to each exercise (parent lift for olympic variants)
    const bestRecords = await getUserBestRecords(db, user.id);
    const exercises = session.exercises.map((ex) => {
      const lookupId = ex.lift.parentLiftId ?? ex.liftId;
      const record = bestRecords.find((r) => r.liftId === lookupId);
      return { ...ex, oneRepMax: record?.weight ?? null };
    });

    return c.json({ session: { ...session, exercises } });
  })

  // ── List completed sessions (paginated) ──
  .get("/", async (c) => {
    const user = c.get("user");
    const limit = parseInt(c.req.query("limit") ?? "20", 10);
    const offset = parseInt(c.req.query("offset") ?? "0", 10);

    const sessions = await getUserSessions(db, user.id, { limit, offset });

    const summaries = sessions.map((s) => {
      const totalSets = s.exercises.reduce(
        (acc, ex) => acc + ex.sets.length,
        0,
      );
      const totalVolume = s.exercises.reduce(
        (acc, ex) =>
          acc +
          ex.sets.reduce((setAcc, set) => setAcc + set.weight * set.reps, 0),
        0,
      );

      return {
        id: s.id,
        date: s.date,
        title: s.title,
        durationMinutes: s.durationMinutes,
        completedAt: s.completedAt?.toISOString() ?? null,
        exerciseCount: s.exercises.length,
        totalSets,
        totalVolume,
      };
    });

    return c.json({ sessions: summaries });
  })

  // ── Weekly session count ──
  .get("/weekly-count", async (c) => {
    const user = c.get("user");
    const now = new Date();
    const day = now.getDay();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - ((day + 6) % 7)); // Monday
    weekStart.setHours(0, 0, 0, 0);

    const count = await getWeeklySessionCount(db, user.id, weekStart);
    return c.json({ count });
  })

  // ── Get session by ID ──
  .get("/:id", async (c) => {
    const user = c.get("user");
    const sessionId = c.req.param("id");
    const session = await getSessionById(db, user.id, sessionId);

    if (!session) {
      return c.json({ message: "Session not found" }, 404);
    }

    return c.json({ session });
  })

  // ── Update session metadata ──
  .put(
    "/:id",
    zValidator("json", UpdateSessionSchema),
    async (c) => {
      const user = c.get("user");
      const sessionId = c.req.param("id");
      const data = c.req.valid("json");
      const session = await updateSession(db, user.id, sessionId, data);

      if (!session) {
        return c.json({ message: "Session not found" }, 404);
      }

      return c.json({ session });
    },
  )

  // ── Complete session ──
  .post("/:id/complete", async (c) => {
    const user = c.get("user");
    const sessionId = c.req.param("id");
    const session = await completeSession(db, user.id, sessionId);

    if (!session) {
      return c.json({ message: "Session not found" }, 404);
    }

    // Check week advancement if linked to a program day
    let advanced = false;
    let newWeekNumber: number | undefined;
    let newCycle: number | undefined;

    if (session.programDayId) {
      const assignment = await getActiveAssignment(db, user.id);
      if (assignment) {
        const week = assignment.program.weeks.find(
          (w) => w.weekNumber === assignment.currentWeekNumber,
        );
        if (week) {
          const weekDayIds = week.days.map((d) => d.id);
          const completedDayIds = await getCompletedDaysForWeek(
            db,
            user.id,
            weekDayIds,
            assignment.currentWeekStartedAt,
          );
          const result = await advanceWeekIfComplete(
            db,
            assignment,
            completedDayIds,
          );
          advanced = result.advanced;
          newWeekNumber = result.newWeekNumber;
          newCycle = result.newCycle;
        }
      }
    }

    // Fetch full session for summary
    const full = await getSessionById(db, user.id, sessionId);

    return c.json({
      session: full,
      advanced,
      newWeekNumber: newWeekNumber ?? null,
      newCycle: newCycle ?? null,
    });
  })

  // ── Discard in-progress session ──
  .delete("/:id", async (c) => {
    const user = c.get("user");
    const sessionId = c.req.param("id");
    const deleted = await discardSession(db, user.id, sessionId);

    if (!deleted) {
      return c.json(
        { message: "Session not found or already completed" },
        404,
      );
    }

    return c.json({ session: deleted });
  })

  // ── Add exercise to session ──
  .post(
    "/:id/exercises",
    zValidator("json", AddExerciseSchema),
    async (c) => {
      const user = c.get("user");
      const sessionId = c.req.param("id");
      const data = c.req.valid("json");

      // Verify session belongs to user
      const session = await getSessionById(db, user.id, sessionId);
      if (!session) {
        return c.json({ message: "Session not found" }, 404);
      }
      if (session.completedAt) {
        return c.json({ message: "Cannot modify a completed session" }, 400);
      }

      const exercise = await addSessionExercise(db, {
        sessionId,
        liftId: data.liftId,
        programBlockId: data.programBlockId,
        notes: data.notes,
      });

      return c.json({ exercise }, 201);
    },
  )

  // ── Batch upload all sets at session end ──
  .post(
    "/:id/batch-upload",
    zValidator("json", BatchSetsSchema),
    async (c) => {
      const user = c.get("user");
      const sessionId = c.req.param("id");
      const { sets } = c.req.valid("json");

      const session = await getSessionById(db, user.id, sessionId);
      if (!session) {
        return c.json({ message: "Session not found" }, 404);
      }
      if (session.completedAt) {
        return c.json({ message: "Cannot modify a completed session" }, 400);
      }

      const prs: Array<{
        liftName: string;
        weight: number;
        reps: number;
        previousBest: number | null;
      }> = [];

      for (const setData of sets) {
        const exercise = session.exercises.find(
          (ex) => ex.id === setData.sessionExerciseId,
        );
        if (!exercise) continue;

        const set = await logSessionSet(db, {
          sessionExerciseId: setData.sessionExerciseId,
          weight: setData.weight,
          reps: setData.reps,
          setType: setData.setType,
          rpe: setData.rpe,
          feedback: setData.feedback,
        });

        if (setData.setType === "working" || setData.setType === "amrap") {
          const prResult = await checkAndRecordPR({
            userId: user.id,
            liftId: exercise.liftId,
            weight: setData.weight,
            reps: setData.reps,
            sessionSetId: set.id,
            date: session.date,
          });
          if (prResult.isPR) {
            prs.push({
              liftName: exercise.lift.name,
              weight: setData.weight,
              reps: setData.reps,
              previousBest: prResult.previousBest,
            });
          }
        }
      }

      return c.json({ uploaded: sets.length, prs }, 201);
    },
  )

  // ── Log a set ──
  .post(
    "/:id/sets",
    zValidator("json", LogSetSchema),
    async (c) => {
      const user = c.get("user");
      const sessionId = c.req.param("id");
      const data = c.req.valid("json");

      // Verify session belongs to user
      const session = await getSessionById(db, user.id, sessionId);
      if (!session) {
        return c.json({ message: "Session not found" }, 404);
      }
      if (session.completedAt) {
        return c.json({ message: "Cannot modify a completed session" }, 400);
      }

      // Find the exercise to get the liftId for PR check
      const exercise = session.exercises.find(
        (ex) => ex.id === data.sessionExerciseId,
      );
      if (!exercise) {
        return c.json({ message: "Exercise not found in this session" }, 404);
      }

      const set = await logSessionSet(db, data);

      // Auto-PR detection (only for working sets)
      let prResult = { isPR: false, previousBest: null as number | null };
      if (data.setType === "working" || data.setType === "amrap") {
        prResult = await checkAndRecordPR({
          userId: user.id,
          liftId: exercise.liftId,
          weight: data.weight,
          reps: data.reps,
          sessionSetId: set.id,
          date: session.date,
        });
      }

      return c.json({
        set,
        isPR: prResult.isPR,
        previousBest: prResult.previousBest,
      }, 201);
    },
  )

  // ── Update a set ──
  .put(
    "/:id/sets/:setId",
    zValidator("json", UpdateSetSchema),
    async (c) => {
      const user = c.get("user");
      const sessionId = c.req.param("id");
      const setId = c.req.param("setId");
      const data = c.req.valid("json");

      // Verify session belongs to user
      const session = await getSessionById(db, user.id, sessionId);
      if (!session) {
        return c.json({ message: "Session not found" }, 404);
      }

      const set = await updateSessionSet(db, setId, data);
      if (!set) {
        return c.json({ message: "Set not found" }, 404);
      }

      return c.json({ set });
    },
  )

  // ── Delete a set ──
  .delete("/:id/sets/:setId", async (c) => {
    const user = c.get("user");
    const sessionId = c.req.param("id");
    const setId = c.req.param("setId");

    // Verify session belongs to user
    const session = await getSessionById(db, user.id, sessionId);
    if (!session) {
      return c.json({ message: "Session not found" }, 404);
    }

    const set = await deleteSessionSet(db, setId);
    if (!set) {
      return c.json({ message: "Set not found" }, 404);
    }

    return c.json({ set });
  })

  // ── Previous performance for an exercise ──
  .get("/:id/previous-performance/:exerciseId", async (c) => {
    const user = c.get("user");
    const sessionId = c.req.param("id");
    const exerciseId = c.req.param("exerciseId");

    const session = await getSessionById(db, user.id, sessionId);
    if (!session) {
      return c.json({ message: "Session not found" }, 404);
    }

    const exercise = session.exercises.find((ex) => ex.id === exerciseId);
    if (!exercise) {
      return c.json({ message: "Exercise not found" }, 404);
    }

    if (!exercise.programBlockId) {
      return c.json({ previous: null });
    }

    const previous = await getPreviousPerformance(
      db,
      user.id,
      exercise.programBlockId,
    );

    return c.json({ previous });
  })

  // ── Weight suggestions for an exercise ──
  .get("/:id/suggestions/:exerciseId", async (c) => {
    const user = c.get("user");
    const sessionId = c.req.param("id");
    const exerciseId = c.req.param("exerciseId");

    const session = await getSessionById(db, user.id, sessionId);
    if (!session) {
      return c.json({ message: "Session not found" }, 404);
    }

    const exercise = session.exercises.find((ex) => ex.id === exerciseId);
    if (!exercise) {
      return c.json({ message: "Exercise not found" }, 404);
    }

    const settings = await getTrainingSettings(db, user.id);

    // Get 1RM for this lift
    const bestRecords = await getUserBestRecords(db, user.id);
    const liftBest = bestRecords.find((r) => r.liftId === exercise.liftId);
    const oneRepMax = liftBest?.weight ?? null;

    // Get previous performance if linked to a program block
    let previousSets: {
      weight: number;
      reps: number;
      setType: string;
      feedback: string | null;
    }[] | null = null;

    if (exercise.programBlockId) {
      const previous = await getPreviousPerformance(
        db,
        user.id,
        exercise.programBlockId,
      );
      if (previous) {
        previousSets = previous.sets;
      }
    }

    // Get block template from program block
    const blockTemplate = exercise.programBlock
      ? {
          sets: exercise.programBlock.sets ?? 1,
          reps: exercise.programBlock.reps ?? 1,
          upTo: exercise.programBlock.upTo ?? false,
          upToPercent: exercise.programBlock.upToPercent ?? null,
          upToRpe: exercise.programBlock.upToRpe ?? null,
        }
      : { sets: 3, reps: 5, upTo: false, upToPercent: null, upToRpe: null };

    const liftCategory = (exercise.lift as { category?: string })?.category ?? "accessory";

    const suggestions = suggestWeights({
      settings: {
        barWeight: settings.barWeight,
        olympicIncrement: settings.olympicIncrement,
        powerliftingIncrement: settings.powerliftingIncrement,
        accessoryIncrement: settings.accessoryIncrement,
      },
      oneRepMax,
      category: liftCategory as Parameters<typeof suggestWeights>[0]["category"],
      blockTemplate,
      previousSets,
    });

    return c.json({ suggestions, oneRepMax });
  });

export { sessionRoutes };
