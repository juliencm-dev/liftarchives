type LiftCategory =
  | "olympic"
  | "powerlifting"
  | "crossfit"
  | "strongman"
  | "hybrid"
  | "hyrox"
  | "accessory";

type TrainingSettings = {
  barWeight: number;
  olympicIncrement: number;
  powerliftingIncrement: number;
  accessoryIncrement: number;
};

type PreviousSet = {
  weight: number;
  reps: number;
  setType: string;
  feedback: string | null;
};

type BlockTemplate = {
  sets: number;
  reps: number;
  upTo: boolean;
  upToPercent: number | null;
  upToRpe: number | null;
};

function getIncrement(
  settings: TrainingSettings,
  category: LiftCategory,
): number {
  switch (category) {
    case "olympic":
      return settings.olympicIncrement;
    case "powerlifting":
      return settings.powerliftingIncrement;
    default:
      return settings.accessoryIncrement;
  }
}

function roundToIncrement(weight: number, increment: number): number {
  return Math.round(weight / increment) * increment;
}

function generateWarmupProgression(
  barWeight: number,
  targetWeight: number,
  increment: number,
): number[] {
  if (targetWeight <= barWeight) return [barWeight];

  const warmups: number[] = [barWeight];
  const steps = [0.4, 0.6, 0.75]; // 40%, 60%, 75% of target

  for (const pct of steps) {
    const w = roundToIncrement(targetWeight * pct, increment);
    if (w > barWeight && w < targetWeight) {
      warmups.push(w);
    }
  }

  return warmups;
}

export function suggestWeights(params: {
  settings: TrainingSettings;
  oneRepMax: number | null;
  category: LiftCategory;
  blockTemplate: BlockTemplate;
  previousSets: PreviousSet[] | null;
}): {
  warmupSets: { weight: number; reps: number }[];
  workingSets: { weight: number; reps: number }[];
} {
  const { settings, oneRepMax, category, blockTemplate, previousSets } =
    params;
  const increment = getIncrement(settings, category);

  // If no 1RM and no previous data, return empty suggestions
  if (!oneRepMax && !previousSets) {
    return {
      warmupSets: [{ weight: settings.barWeight, reps: blockTemplate.reps }],
      workingSets: [],
    };
  }

  // Determine target weight
  let targetWeight: number;

  if (oneRepMax && blockTemplate.upToPercent) {
    targetWeight = roundToIncrement(
      (oneRepMax * blockTemplate.upToPercent) / 100,
      increment,
    );
  } else if (previousSets && previousSets.length > 0) {
    // Use previous working set weight as baseline
    const lastWorkingSets = previousSets.filter(
      (s) => s.setType === "working",
    );
    const lastWorking =
      lastWorkingSets.length > 0
        ? lastWorkingSets[lastWorkingSets.length - 1]
        : previousSets[previousSets.length - 1];
    targetWeight = lastWorking.weight;

    // Adjust based on last feedback
    const lastFeedback = lastWorking.feedback;
    if (lastFeedback === "easy") {
      targetWeight = roundToIncrement(targetWeight + increment, increment);
    } else if (lastFeedback === "hard") {
      // Keep same or go slightly down
      targetWeight = roundToIncrement(targetWeight, increment);
    }
  } else {
    targetWeight = settings.barWeight;
  }

  // Generate warm-up progression
  const warmupWeights = generateWarmupProgression(
    settings.barWeight,
    targetWeight,
    increment,
  );
  const warmupSets = warmupWeights.map((w) => ({
    weight: w,
    reps: Math.min(blockTemplate.reps, 5),
  }));

  // Generate working sets
  const workingSets: { weight: number; reps: number }[] = [];
  for (let i = 0; i < blockTemplate.sets; i++) {
    workingSets.push({
      weight: targetWeight,
      reps: blockTemplate.reps,
    });
  }

  return { warmupSets, workingSets };
}
