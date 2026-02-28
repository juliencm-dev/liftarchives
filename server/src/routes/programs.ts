import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware, type SessionUser } from "@/middleware/auth";
import {
  CreateProgramSchema,
  UpdateProgramSchema,
  AssignProgramSchema,
  CompleteDaySchema,
} from "@liftarchives/shared";
import {
  db,
  getUserPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
  getActiveAssignment,
  assignProgram,
  unassignProgram,
  advanceWeekIfComplete,
  createProgramSession,
  completeSession,
  getCompletedDaysForWeek,
} from "@liftarchives/database";

type Env = {
  Variables: {
    user: SessionUser;
  };
};

const programRoutes = new Hono<Env>()
  .use("*", authMiddleware)
  .get("/", async (c) => {
    const user = c.get("user");
    const programs = await getUserPrograms(db, user.id);
    return c.json({ programs });
  })
  .get("/active", async (c) => {
    const user = c.get("user");
    const assignment = await getActiveAssignment(db, user.id);

    if (!assignment) {
      return c.json({
        assignment: null,
        program: null,
        currentWeek: null,
        upNextDay: null,
      });
    }

    const week = assignment.program.weeks.find(
      (w) => w.weekNumber === assignment.currentWeekNumber,
    );
    if (!week) {
      return c.json({
        assignment: null,
        program: null,
        currentWeek: null,
        upNextDay: null,
      });
    }

    const weekDayIds = week.days.map((d) => d.id);
    const completedDayIds = await getCompletedDaysForWeek(
      db,
      user.id,
      weekDayIds,
      assignment.currentWeekStartedAt,
    );

    const annotatedDays = week.days.map((day) => ({
      ...day,
      isCompleted: completedDayIds.includes(day.id),
    }));

    const upNextDay =
      annotatedDays.find((d) => !d.isCompleted) ?? null;

    return c.json({
      assignment: {
        id: assignment.id,
        programId: assignment.programId,
        currentWeekNumber: assignment.currentWeekNumber,
        currentCycle: assignment.currentCycle,
        status: assignment.status,
      },
      program: assignment.program,
      currentWeek: {
        weekNumber: assignment.currentWeekNumber,
        totalWeeks: assignment.program.durationWeeks,
        cycle: assignment.currentCycle,
        days: annotatedDays,
      },
      upNextDay,
    });
  })
  .post(
    "/active/complete-day",
    zValidator("json", CompleteDaySchema),
    async (c) => {
      const user = c.get("user");
      const { programDayId } = c.req.valid("json");

      const assignment = await getActiveAssignment(db, user.id);
      if (!assignment) {
        return c.json({ message: "No active assignment" }, 404);
      }

      const week = assignment.program.weeks.find(
        (w) => w.weekNumber === assignment.currentWeekNumber,
      );
      if (!week) {
        return c.json({ message: "Program has no weeks" }, 400);
      }

      const weekDayIds = week.days.map((d) => d.id);
      if (!weekDayIds.includes(programDayId)) {
        return c.json(
          { message: "Day does not belong to current week" },
          400,
        );
      }

      // Check not already completed
      const completedDayIds = await getCompletedDaysForWeek(
        db,
        user.id,
        weekDayIds,
        assignment.currentWeekStartedAt,
      );
      if (completedDayIds.includes(programDayId)) {
        return c.json({ message: "Day already completed" }, 400);
      }

      // Create + complete session atomically
      const dayData = week.days.find((d) => d.id === programDayId);
      const today = new Date().toISOString().split("T")[0];
      const session = await createProgramSession(db, {
        userId: user.id,
        programDayId,
        date: today,
        title: dayData?.name ?? `Day ${dayData?.dayNumber}`,
      });
      await completeSession(db, user.id, session.id);

      // Check week advancement
      const updatedCompletedDayIds = [...completedDayIds, programDayId];
      const advancement = await advanceWeekIfComplete(
        db,
        assignment,
        updatedCompletedDayIds,
      );

      return c.json({
        session,
        advanced: advancement.advanced,
        newWeekNumber: advancement.newWeekNumber ?? null,
        newCycle: advancement.newCycle ?? null,
      });
    },
  )
  .get("/:id", async (c) => {
    const user = c.get("user");
    const programId = c.req.param("id");
    const program = await getProgramById(db, programId);

    if (!program || program.createdById !== user.id) {
      return c.json({ message: "Program not found" }, 404);
    }

    return c.json({ program });
  })
  .post("/", zValidator("json", CreateProgramSchema), async (c) => {
    const user = c.get("user");
    const data = c.req.valid("json");
    const program = await createProgram(db, user.id, data);
    return c.json({ program }, 201);
  })
  .put("/:id", zValidator("json", UpdateProgramSchema), async (c) => {
    const user = c.get("user");
    const programId = c.req.param("id");
    const data = c.req.valid("json");
    const program = await updateProgram(db, user.id, programId, data);

    if (!program) {
      return c.json({ message: "Program not found" }, 404);
    }

    return c.json({ program });
  })
  .delete("/:id", async (c) => {
    const user = c.get("user");
    const programId = c.req.param("id");
    const deleted = await deleteProgram(db, user.id, programId);

    if (!deleted) {
      return c.json({ message: "Program not found" }, 404);
    }

    return c.json({ program: deleted });
  })
  .post("/assign", zValidator("json", AssignProgramSchema), async (c) => {
    const user = c.get("user");
    const data = c.req.valid("json");
    const assignment = await assignProgram(
      db,
      user.id,
      data.programId,
      data.startDate,
    );
    return c.json({ assignment }, 201);
  })
  .post("/unassign/:id", async (c) => {
    const user = c.get("user");
    const programId = c.req.param("id");
    const result = await unassignProgram(db, user.id, programId);

    if (!result) {
      return c.json({ message: "No active assignment found" }, 404);
    }

    return c.json({ assignment: result });
  });

export { programRoutes };
