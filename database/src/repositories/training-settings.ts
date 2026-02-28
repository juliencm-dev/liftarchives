import { eq } from "drizzle-orm";
import { trainingSettings } from "../schemas";
import type { DbClient } from "./types";

const DEFAULTS = {
  barWeight: 20,
  olympicIncrement: 1.0,
  powerliftingIncrement: 2.5,
  accessoryIncrement: 2.5,
  defaultRestSeconds: 120,
  defaultBlockRestSeconds: 180,
};

export async function getTrainingSettings(
  dbClient: DbClient,
  userId: string,
) {
  const settings = await dbClient.query.trainingSettings.findFirst({
    where: eq(trainingSettings.userId, userId),
  });

  if (!settings) {
    return { userId, ...DEFAULTS };
  }

  return settings;
}

export async function upsertTrainingSettings(
  dbClient: DbClient,
  userId: string,
  data: {
    barWeight?: number;
    olympicIncrement?: number;
    powerliftingIncrement?: number;
    accessoryIncrement?: number;
    defaultRestSeconds?: number;
    defaultBlockRestSeconds?: number;
  },
) {
  const [result] = await dbClient
    .insert(trainingSettings)
    .values({
      userId,
      ...DEFAULTS,
      ...data,
    })
    .onConflictDoUpdate({
      target: trainingSettings.userId,
      set: data,
    })
    .returning();

  return result;
}
