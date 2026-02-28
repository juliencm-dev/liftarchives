import { eq, or, asc, isNull } from "drizzle-orm";
import { lifts } from "../schemas";
import type { DbClient } from "./types";

export async function getCoreLifts(dbClient: DbClient) {
  return dbClient.query.lifts.findMany({
    where: eq(lifts.isCore, true),
    orderBy: asc(lifts.name),
  });
}

export async function getAllLifts(dbClient: DbClient, userId: string) {
  return dbClient.query.lifts.findMany({
    where: or(eq(lifts.isCore, true), eq(lifts.createdById, userId)),
    orderBy: asc(lifts.name),
  });
}

export async function getAllAvailableLifts(dbClient: DbClient, userId: string) {
  return dbClient.query.lifts.findMany({
    where: or(
      eq(lifts.isCore, true),
      eq(lifts.createdById, userId),
      isNull(lifts.createdById),
    ),
    orderBy: asc(lifts.name),
  });
}

export async function getLiftById(dbClient: DbClient, liftId: string) {
  return dbClient.query.lifts.findFirst({
    where: eq(lifts.id, liftId),
  });
}

export async function createLift(
  dbClient: DbClient,
  userId: string,
  data: {
    name: string;
    category: "olympic" | "powerlifting" | "accessory";
    description?: string;
    parentLiftId?: string;
  },
) {
  const [result] = await dbClient
    .insert(lifts)
    .values({
      id: crypto.randomUUID(),
      name: data.name,
      category: data.category,
      description: data.description,
      parentLiftId: data.parentLiftId ?? null,
      isCore: false,
      createdById: userId,
    })
    .returning();
  return result;
}
