import { eq, and, asc, desc, max } from "drizzle-orm";
import { personalRecords } from "../schemas";
import type { DbClient } from "./types";

// ── PR Detection Queries ──

export async function getUserBestForLiftAndReps(
  dbClient: DbClient,
  userId: string,
  liftId: string,
  reps: number,
) {
  const [result] = await dbClient
    .select({ maxWeight: max(personalRecords.weight) })
    .from(personalRecords)
    .where(
      and(
        eq(personalRecords.userId, userId),
        eq(personalRecords.liftId, liftId),
        eq(personalRecords.reps, reps),
      ),
    );

  return result?.maxWeight ?? null;
}

export async function createSessionPR(
  dbClient: DbClient,
  userId: string,
  data: {
    liftId: string;
    weight: number;
    reps: number;
    estimatedOneRepMax: number | null;
    date: string;
    sessionSetId: string;
  },
) {
  const [result] = await dbClient
    .insert(personalRecords)
    .values({
      id: crypto.randomUUID(),
      userId,
      liftId: data.liftId,
      weight: data.weight,
      reps: data.reps,
      estimatedOneRepMax: data.estimatedOneRepMax,
      date: data.date,
      sessionSetId: data.sessionSetId,
      source: "session",
    })
    .returning();

  return result;
}

// ── Existing CRUD ──

export async function getUserRecords(
  dbClient: DbClient,
  userId: string,
  liftId?: string,
) {
  const conditions = [eq(personalRecords.userId, userId)];
  if (liftId) {
    conditions.push(eq(personalRecords.liftId, liftId));
  }

  return dbClient.query.personalRecords.findMany({
    where: and(...conditions),
    orderBy: asc(personalRecords.date),
    with: { lift: true },
  });
}

export async function getUserBestRecords(dbClient: DbClient, userId: string) {
  return dbClient.query.personalRecords.findMany({
    where: and(
      eq(personalRecords.userId, userId),
      eq(personalRecords.reps, 1),
    ),
    orderBy: desc(personalRecords.weight),
    with: { lift: true },
  });
}

export async function createPersonalRecord(
  dbClient: DbClient,
  userId: string,
  data: {
    id: string;
    liftId: string;
    weight: number;
    reps: number;
    estimatedOneRepMax: number | null;
    date: string;
    notes?: string;
  },
) {
  const [result] = await dbClient
    .insert(personalRecords)
    .values({
      ...data,
      userId,
      source: "manual",
    })
    .returning();
  return result;
}

export async function getRecentUserRecords(
  dbClient: DbClient,
  userId: string,
  limit = 10,
) {
  return dbClient.query.personalRecords.findMany({
    where: eq(personalRecords.userId, userId),
    orderBy: desc(personalRecords.createdAt),
    limit,
    with: { lift: true },
  });
}

export async function deletePersonalRecord(
  dbClient: DbClient,
  userId: string,
  recordId: string,
) {
  const [result] = await dbClient
    .delete(personalRecords)
    .where(
      and(
        eq(personalRecords.id, recordId),
        eq(personalRecords.userId, userId),
      ),
    )
    .returning();
  return result;
}
