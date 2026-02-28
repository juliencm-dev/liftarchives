import { eq } from "drizzle-orm";
import { coachProfile } from "../schemas";
import type { DbClient } from "./types";

export async function getCoachProfile(dbClient: DbClient, userId: string) {
  return dbClient.query.coachProfile.findFirst({
    where: eq(coachProfile.userId, userId),
  });
}

export async function updateCoachProfile(
  dbClient: DbClient,
  userId: string,
  data: { bio?: string },
) {
  const [result] = await dbClient
    .update(coachProfile)
    .set(data)
    .where(eq(coachProfile.userId, userId))
    .returning();
  return result;
}
