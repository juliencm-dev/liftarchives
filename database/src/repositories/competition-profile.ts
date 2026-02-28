import { eq, and, desc, lte, gte, or, isNull } from "drizzle-orm";
import {
  lifterProfile,
  coachLifters,
  competitionCategories,
  personalRecords,
  lifts,
} from "../schemas";
import type { DbClient } from "./types";

export async function getCompetitionProfile(
  dbClient: DbClient,
  userId: string,
) {
  // 1. Get lifter profile with club
  const profile = await dbClient.query.lifterProfile.findFirst({
    where: eq(lifterProfile.userId, userId),
    with: {
      club: true,
    },
  });

  if (!profile) {
    return null;
  }

  // 2. Get assigned coach (via coachLifters)
  const coachAssignment = await dbClient.query.coachLifters.findFirst({
    where: eq(coachLifters.lifterId, userId),
    with: {
      coach: {
        with: {
          user: true,
        },
      },
    },
  });

  // 3. Find matching competition category
  const today = new Date().toISOString().split("T")[0]!;
  const matchingCategories = await dbClient
    .select()
    .from(competitionCategories)
    .where(
      and(
        eq(competitionCategories.gender, profile.gender),
        eq(competitionCategories.division, profile.competitiveDivision),
        lte(competitionCategories.minWeight, profile.weight),
        or(
          isNull(competitionCategories.maxWeight),
          gte(competitionCategories.maxWeight, profile.weight),
        ),
        lte(competitionCategories.minDateOfBirth, today),
        or(
          isNull(competitionCategories.maxDateOfBirth),
          gte(competitionCategories.maxDateOfBirth, profile.dateOfBirth),
        ),
      ),
    )
    .limit(1);

  const category = matchingCategories[0] ?? null;

  // 4. Get best competition total (sum of best 1RM for Snatch + Clean & Jerk)
  // First, find the competition lifts
  const competitionLifts = await dbClient.query.lifts.findMany({
    where: and(
      or(eq(lifts.name, "Snatch"), eq(lifts.name, "Clean & Jerk")),
      eq(lifts.isCore, true),
    ),
  });

  let competitionTotal: number | null = null;
  let trainingBestTotal: number | null = null;

  if (competitionLifts.length > 0) {
    const liftIds = competitionLifts.map((l) => l.id);

    // Get best competition records (source = 'competition')
    const competitionRecords: Record<string, number> = {};
    const trainingRecords: Record<string, number> = {};

    for (const liftId of liftIds) {
      // Best competition result
      const compRecord = await dbClient.query.personalRecords.findFirst({
        where: and(
          eq(personalRecords.userId, userId),
          eq(personalRecords.liftId, liftId),
          eq(personalRecords.reps, 1),
          eq(personalRecords.source, "competition"),
        ),
        orderBy: desc(personalRecords.weight),
      });
      if (compRecord) {
        competitionRecords[liftId] = compRecord.weight;
      }

      // Best training result (any source)
      const bestRecord = await dbClient.query.personalRecords.findFirst({
        where: and(
          eq(personalRecords.userId, userId),
          eq(personalRecords.liftId, liftId),
          eq(personalRecords.reps, 1),
        ),
        orderBy: desc(personalRecords.weight),
      });
      if (bestRecord) {
        trainingRecords[liftId] = bestRecord.weight;
      }
    }

    // Calculate competition total (only if we have records for all lifts)
    if (Object.keys(competitionRecords).length === liftIds.length) {
      competitionTotal = Object.values(competitionRecords).reduce(
        (sum, w) => sum + w,
        0,
      );
    }

    // Calculate training best total (only if we have records for all lifts)
    if (Object.keys(trainingRecords).length === liftIds.length) {
      trainingBestTotal = Object.values(trainingRecords).reduce(
        (sum, w) => sum + w,
        0,
      );
    }
  }

  return {
    coachName: coachAssignment?.coach?.user?.name ?? null,
    clubName: profile.club?.name ?? null,
    category: category
      ? {
          name: category.name,
          qualifyingTotal: category.qualifyingTotal,
        }
      : null,
    competitionTotal,
    trainingBestTotal,
    liftUnit: profile.liftUnit,
  };
}
