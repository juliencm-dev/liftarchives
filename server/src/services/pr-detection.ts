import {
  db,
  getUserBestForLiftAndReps,
  createSessionPR,
} from "@liftarchives/database";

function calcEpley(weight: number, reps: number): number {
  if (reps <= 1) return weight;
  return Math.round(weight * (1 + reps / 30) * 100) / 100;
}

export async function checkAndRecordPR(params: {
  userId: string;
  liftId: string;
  weight: number;
  reps: number;
  sessionSetId: string;
  date: string;
}): Promise<{ isPR: boolean; previousBest: number | null }> {
  const { userId, liftId, weight, reps, sessionSetId, date } = params;

  const previousBest = await getUserBestForLiftAndReps(
    db,
    userId,
    liftId,
    reps,
  );

  if (previousBest !== null && weight <= previousBest) {
    return { isPR: false, previousBest };
  }

  const estimatedOneRepMax = calcEpley(weight, reps);

  await createSessionPR(db, userId, {
    liftId,
    weight,
    reps,
    estimatedOneRepMax,
    date,
    sessionSetId,
  });

  return { isPR: true, previousBest };
}
