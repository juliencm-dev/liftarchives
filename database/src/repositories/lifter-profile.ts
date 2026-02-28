import { eq } from "drizzle-orm";
import { lifterProfile } from "../schemas";
import type { DbClient } from "./types";

export async function getLifterProfile(dbClient: DbClient, userId: string) {
  return dbClient.query.lifterProfile.findFirst({
    where: eq(lifterProfile.userId, userId),
  });
}

export async function createLifterProfile(
  dbClient: DbClient,
  userId: string,
  data: {
    dateOfBirth: string;
    weight: number;
    gender: "male" | "female";
    liftUnit: "kg" | "lb";
    competitiveDivision: "junior" | "senior" | "masters";
  },
) {
  const [result] = await dbClient
    .insert(lifterProfile)
    .values({ userId, ...data })
    .returning();
  return result;
}

export async function updateLifterProfile(
  dbClient: DbClient,
  userId: string,
  data: Partial<{
    dateOfBirth: string;
    weight: number;
    gender: "male" | "female";
    liftUnit: "kg" | "lb";
    competitiveDivision: "junior" | "senior" | "masters";
  }>,
) {
  const [result] = await dbClient
    .update(lifterProfile)
    .set(data)
    .where(eq(lifterProfile.userId, userId))
    .returning();
  return result;
}
