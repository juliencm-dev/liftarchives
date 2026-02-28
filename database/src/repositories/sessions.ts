import {
  eq,
  and,
  inArray,
  isNotNull,
  isNull,
  gte,
  desc,
  max,
  count,
} from "drizzle-orm";
import {
  trainingSessions,
  sessionExercises,
  sessionSets,
} from "../schemas";
import type { DbClient } from "./types";

// ── Session CRUD ──

export async function startSession(
  dbClient: DbClient,
  params: {
    userId: string;
    programDayId: string;
    date: string;
    title?: string;
  },
) {
  const [session] = await dbClient
    .insert(trainingSessions)
    .values({
      id: crypto.randomUUID(),
      userId: params.userId,
      programDayId: params.programDayId,
      date: params.date,
      title: params.title ?? null,
      startedAt: new Date(),
      completedAt: null,
    })
    .returning();

  return session;
}

/** Kept for backward compat with "quick complete" flow */
export async function createProgramSession(
  dbClient: DbClient,
  params: {
    userId: string;
    programDayId: string;
    date: string;
    title?: string;
  },
) {
  const [session] = await dbClient
    .insert(trainingSessions)
    .values({
      id: crypto.randomUUID(),
      userId: params.userId,
      programDayId: params.programDayId,
      date: params.date,
      title: params.title ?? null,
      completedAt: null,
    })
    .returning();

  return session;
}

export async function getActiveSession(dbClient: DbClient, userId: string) {
  return dbClient.query.trainingSessions.findFirst({
    where: and(
      eq(trainingSessions.userId, userId),
      isNull(trainingSessions.completedAt),
    ),
    orderBy: desc(trainingSessions.createdAt),
    with: {
      exercises: {
        orderBy: (ex, { asc }) => [asc(ex.order)],
        with: {
          lift: true,
          programBlock: {
            with: {
              movements: {
                with: { lift: true },
              },
            },
          },
          sets: {
            orderBy: (s, { asc }) => [asc(s.setNumber)],
          },
        },
      },
      programDay: {
        with: {
          blocks: {
            with: {
              movements: {
                with: { lift: true },
              },
            },
          },
        },
      },
    },
  });
}

export async function getSessionById(
  dbClient: DbClient,
  userId: string,
  sessionId: string,
) {
  return dbClient.query.trainingSessions.findFirst({
    where: and(
      eq(trainingSessions.id, sessionId),
      eq(trainingSessions.userId, userId),
    ),
    with: {
      exercises: {
        orderBy: (ex, { asc }) => [asc(ex.order)],
        with: {
          lift: true,
          programBlock: {
            with: {
              movements: {
                with: { lift: true },
              },
            },
          },
          sets: {
            orderBy: (s, { asc }) => [asc(s.setNumber)],
          },
        },
      },
      programDay: {
        with: {
          blocks: {
            with: {
              movements: {
                with: { lift: true },
              },
            },
          },
        },
      },
    },
  });
}

export async function updateSession(
  dbClient: DbClient,
  userId: string,
  sessionId: string,
  data: { title?: string; notes?: string },
) {
  const [updated] = await dbClient
    .update(trainingSessions)
    .set(data)
    .where(
      and(
        eq(trainingSessions.id, sessionId),
        eq(trainingSessions.userId, userId),
      ),
    )
    .returning();

  return updated ?? null;
}

export async function discardSession(
  dbClient: DbClient,
  userId: string,
  sessionId: string,
) {
  const [deleted] = await dbClient
    .delete(trainingSessions)
    .where(
      and(
        eq(trainingSessions.id, sessionId),
        eq(trainingSessions.userId, userId),
        isNull(trainingSessions.completedAt),
      ),
    )
    .returning();

  return deleted ?? null;
}

export async function completeSession(
  dbClient: DbClient,
  userId: string,
  sessionId: string,
) {
  const now = new Date();

  // Get the session to compute duration
  const session = await dbClient.query.trainingSessions.findFirst({
    where: and(
      eq(trainingSessions.id, sessionId),
      eq(trainingSessions.userId, userId),
    ),
  });

  if (!session) return null;

  let durationMinutes: number | null = null;
  if (session.startedAt) {
    durationMinutes = Math.round(
      (now.getTime() - session.startedAt.getTime()) / 60000,
    );
  }

  const [updated] = await dbClient
    .update(trainingSessions)
    .set({
      completedAt: now,
      ...(durationMinutes !== null ? { durationMinutes } : {}),
    })
    .where(
      and(
        eq(trainingSessions.id, sessionId),
        eq(trainingSessions.userId, userId),
      ),
    )
    .returning();

  return updated ?? null;
}

export async function getUserSessions(
  dbClient: DbClient,
  userId: string,
  options: { limit?: number; offset?: number } = {},
) {
  const { limit = 20, offset = 0 } = options;

  return dbClient.query.trainingSessions.findMany({
    where: and(
      eq(trainingSessions.userId, userId),
      isNotNull(trainingSessions.completedAt),
    ),
    orderBy: desc(trainingSessions.completedAt),
    limit,
    offset,
    with: {
      exercises: {
        orderBy: (ex, { asc }) => [asc(ex.order)],
        with: {
          lift: true,
          sets: {
            orderBy: (s, { asc }) => [asc(s.setNumber)],
          },
        },
      },
      programDay: true,
    },
  });
}

export async function getWeeklySessionCount(
  dbClient: DbClient,
  userId: string,
  weekStart: Date,
) {
  const [result] = await dbClient
    .select({ count: count() })
    .from(trainingSessions)
    .where(
      and(
        eq(trainingSessions.userId, userId),
        isNotNull(trainingSessions.completedAt),
        gte(trainingSessions.completedAt, weekStart),
      ),
    );

  return result?.count ?? 0;
}

// ── Completed days for week (kept for program advancement) ──

export async function getCompletedDaysForWeek(
  dbClient: DbClient,
  userId: string,
  programDayIds: string[],
  since: Date,
): Promise<string[]> {
  if (programDayIds.length === 0) return [];

  const rows = await dbClient
    .selectDistinct({ programDayId: trainingSessions.programDayId })
    .from(trainingSessions)
    .where(
      and(
        eq(trainingSessions.userId, userId),
        inArray(trainingSessions.programDayId, programDayIds),
        isNotNull(trainingSessions.completedAt),
        gte(trainingSessions.createdAt, since),
      ),
    );

  return rows
    .map((r) => r.programDayId)
    .filter((id): id is string => id !== null);
}

// ── Exercise & Set Logging ──

export async function addSessionExercise(
  dbClient: DbClient,
  params: {
    sessionId: string;
    liftId: string;
    programBlockId?: string;
    notes?: string;
  },
) {
  // Auto-calculate order
  const [maxOrder] = await dbClient
    .select({ maxOrder: max(sessionExercises.order) })
    .from(sessionExercises)
    .where(eq(sessionExercises.sessionId, params.sessionId));

  const order = (maxOrder?.maxOrder ?? 0) + 1;

  const [exercise] = await dbClient
    .insert(sessionExercises)
    .values({
      id: crypto.randomUUID(),
      sessionId: params.sessionId,
      liftId: params.liftId,
      programBlockId: params.programBlockId ?? null,
      order,
      notes: params.notes ?? null,
    })
    .returning();

  return exercise;
}

export async function logSessionSet(
  dbClient: DbClient,
  params: {
    sessionExerciseId: string;
    weight: number;
    reps: number;
    setType: "warmup" | "working" | "backoff" | "dropset" | "amrap";
    rpe?: number;
    percentageOf1rm?: number;
    feedback?: "hard" | "normal" | "easy";
    tempo?: string;
    restSeconds?: number;
    notes?: string;
  },
) {
  // Auto-calculate setNumber
  const [maxSet] = await dbClient
    .select({ maxSet: max(sessionSets.setNumber) })
    .from(sessionSets)
    .where(eq(sessionSets.sessionExerciseId, params.sessionExerciseId));

  const setNumber = (maxSet?.maxSet ?? 0) + 1;

  const [set] = await dbClient
    .insert(sessionSets)
    .values({
      id: crypto.randomUUID(),
      sessionExerciseId: params.sessionExerciseId,
      setNumber,
      weight: params.weight,
      reps: params.reps,
      setType: params.setType,
      rpe: params.rpe ?? null,
      percentageOf1rm: params.percentageOf1rm ?? null,
      feedback: params.feedback ?? null,
      tempo: params.tempo ?? null,
      restSeconds: params.restSeconds ?? null,
      notes: params.notes ?? null,
    })
    .returning();

  return set;
}

export async function updateSessionSet(
  dbClient: DbClient,
  setId: string,
  data: {
    weight?: number;
    reps?: number;
    setType?: "warmup" | "working" | "backoff" | "dropset" | "amrap";
    rpe?: number | null;
    feedback?: "hard" | "normal" | "easy" | null;
    notes?: string | null;
  },
) {
  const [updated] = await dbClient
    .update(sessionSets)
    .set(data)
    .where(eq(sessionSets.id, setId))
    .returning();

  return updated ?? null;
}

export async function deleteSessionSet(dbClient: DbClient, setId: string) {
  const [deleted] = await dbClient
    .delete(sessionSets)
    .where(eq(sessionSets.id, setId))
    .returning();

  return deleted ?? null;
}

// ── Coach Visibility ──

export async function getCoachVisibleSessions(
  dbClient: DbClient,
  lifterUserIds: string[],
  options: { limit?: number; offset?: number } = {},
) {
  if (lifterUserIds.length === 0) return [];

  const { limit = 50, offset = 0 } = options;

  return dbClient.query.trainingSessions.findMany({
    where: and(
      inArray(trainingSessions.userId, lifterUserIds),
      isNotNull(trainingSessions.completedAt),
      eq(trainingSessions.isSharedWithCoach, true),
    ),
    orderBy: desc(trainingSessions.completedAt),
    limit,
    offset,
    with: {
      exercises: {
        orderBy: (ex, { asc }) => [asc(ex.order)],
        with: {
          lift: true,
          sets: {
            orderBy: (s, { asc }) => [asc(s.setNumber)],
          },
        },
      },
      programDay: true,
    },
  });
}

// ── Previous Performance ──

export async function getPreviousPerformance(
  dbClient: DbClient,
  userId: string,
  programBlockId: string,
) {
  // Find the most recent completed session that has an exercise linked to this block
  const exercise = await dbClient.query.sessionExercises.findFirst({
    where: eq(sessionExercises.programBlockId, programBlockId),
    orderBy: desc(sessionExercises.createdAt),
    with: {
      session: true,
      sets: {
        orderBy: (s, { asc }) => [asc(s.setNumber)],
      },
    },
  });

  if (!exercise || !exercise.session) return null;

  // Verify the session belongs to the user and is completed
  if (
    exercise.session.userId !== userId ||
    !exercise.session.completedAt
  ) {
    return null;
  }

  return {
    sessionId: exercise.session.id,
    date: exercise.session.date,
    sets: exercise.sets,
  };
}
