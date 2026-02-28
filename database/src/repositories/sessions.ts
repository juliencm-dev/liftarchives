import { eq, and, inArray, isNotNull, gte } from "drizzle-orm";
import { trainingSessions } from "../schemas";
import type { DbClient } from "./types";

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

export async function completeSession(
  dbClient: DbClient,
  userId: string,
  sessionId: string,
) {
  const [updated] = await dbClient
    .update(trainingSessions)
    .set({ completedAt: new Date() })
    .where(
      and(
        eq(trainingSessions.id, sessionId),
        eq(trainingSessions.userId, userId),
      ),
    )
    .returning();

  return updated ?? null;
}

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
