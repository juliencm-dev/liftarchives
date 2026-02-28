import { z } from "zod";

// ---------------------------------------------------------------------------
// Request schemas
// ---------------------------------------------------------------------------

export const StartSessionSchema = z.object({
  programDayId: z.string(),
  title: z.string().optional(),
});

export const LogSetSchema = z.object({
  sessionExerciseId: z.string(),
  weight: z.number().min(0),
  reps: z.number().int().min(1),
  setType: z.enum(["warmup", "working", "backoff", "dropset", "amrap"]),
  rpe: z.number().min(1).max(10).optional(),
  percentageOf1rm: z.number().min(0).max(100).optional(),
  feedback: z.enum(["hard", "normal", "easy"]).optional(),
  tempo: z.string().optional(),
  restSeconds: z.number().int().min(0).optional(),
  notes: z.string().max(500).optional(),
});

export const UpdateSetSchema = z.object({
  weight: z.number().min(0).optional(),
  reps: z.number().int().min(1).optional(),
  setType: z
    .enum(["warmup", "working", "backoff", "dropset", "amrap"])
    .optional(),
  rpe: z.number().min(1).max(10).nullable().optional(),
  feedback: z.enum(["hard", "normal", "easy"]).nullable().optional(),
  notes: z.string().max(500).nullable().optional(),
});

export const UpdateSessionSchema = z.object({
  title: z.string().optional(),
  notes: z.string().max(2000).optional(),
});

export const AddExerciseSchema = z.object({
  liftId: z.string(),
  programBlockId: z.string().optional(),
  notes: z.string().max(500).optional(),
});

export const BatchSetItemSchema = z.object({
  sessionExerciseId: z.string(),
  weight: z.number().min(0),
  reps: z.number().int().min(1),
  setType: z.enum(["warmup", "working", "backoff", "dropset", "amrap"]),
  rpe: z.number().min(1).max(10).optional(),
  feedback: z.enum(["hard", "normal", "easy"]).optional(),
});

export const BatchSetsSchema = z.object({
  sets: z.array(BatchSetItemSchema).min(1),
});

// ---------------------------------------------------------------------------
// Response schemas
// ---------------------------------------------------------------------------

export const SessionSetResponseSchema = z.object({
  id: z.string(),
  sessionExerciseId: z.string(),
  setNumber: z.number(),
  weight: z.number(),
  reps: z.number(),
  rpe: z.number().nullable(),
  percentageOf1rm: z.number().nullable(),
  tempo: z.string().nullable(),
  restSeconds: z.number().nullable(),
  setType: z.enum(["warmup", "working", "backoff", "dropset", "amrap"]),
  feedback: z.enum(["hard", "normal", "easy"]).nullable(),
  notes: z.string().nullable(),
});

export const SessionExerciseResponseSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  liftId: z.string(),
  programBlockId: z.string().nullable(),
  order: z.number(),
  notes: z.string().nullable(),
  lift: z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
  }),
  sets: z.array(SessionSetResponseSchema),
});

export const SessionResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  programDayId: z.string().nullable(),
  date: z.string(),
  title: z.string().nullable(),
  notes: z.string().nullable(),
  durationMinutes: z.number().nullable(),
  startedAt: z.string().nullable(),
  completedAt: z.string().nullable(),
  exercises: z.array(SessionExerciseResponseSchema),
});

export const SessionSummaryResponseSchema = z.object({
  id: z.string(),
  date: z.string(),
  title: z.string().nullable(),
  durationMinutes: z.number().nullable(),
  completedAt: z.string().nullable(),
  exerciseCount: z.number(),
  totalSets: z.number(),
  totalVolume: z.number(),
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type StartSessionData = z.infer<typeof StartSessionSchema>;
export type LogSetData = z.infer<typeof LogSetSchema>;
export type UpdateSetData = z.infer<typeof UpdateSetSchema>;
export type UpdateSessionData = z.infer<typeof UpdateSessionSchema>;
export type AddExerciseData = z.infer<typeof AddExerciseSchema>;
export type SessionResponse = z.infer<typeof SessionResponseSchema>;
export type SessionSummaryResponse = z.infer<typeof SessionSummaryResponseSchema>;
export type SessionSetResponse = z.infer<typeof SessionSetResponseSchema>;
export type SessionExerciseResponse = z.infer<typeof SessionExerciseResponseSchema>;
export type BatchSetsData = z.infer<typeof BatchSetsSchema>;
export type BatchSetItem = z.infer<typeof BatchSetItemSchema>;
