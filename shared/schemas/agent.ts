import { z } from "zod";

// ---------------------------------------------------------------------------
// Program draft schemas — what the vision LLM extracts from a board photo.
// Mirrors CreateProgramSchema structure but uses liftId values matched by
// the LLM via a tool that provides the full lift catalog.
// ---------------------------------------------------------------------------

export const DraftBlockMovementSchema = z.object({
  liftId: z.string(),
  reps: z.number().int().min(1).default(1),
});

export const DraftProgramBlockSchema = z.object({
  sets: z.number().int().min(1).default(1),
  reps: z.number().int().min(1).default(1),
  movements: z.array(DraftBlockMovementSchema).min(1),
  upTo: z.boolean().default(false),
  upToPercent: z.number().min(1).max(100).nullable().optional(),
  upToRpe: z.number().min(1).max(10).nullable().optional(),
  setDetails: z.array(z.object({ percent: z.number().nullable().optional(), rpe: z.number().nullable().optional() })).nullable().optional(),
  notes: z.string().max(500).nullable().optional(),
  warning: z.string().nullable().optional(),
});

export const DraftProgramDaySchema = z.object({
  name: z.string().max(200).nullable().optional(),
  blocks: z.array(DraftProgramBlockSchema).min(1),
});

export const DraftProgramWeekSchema = z.object({
  name: z.string().max(200).nullable().optional(),
  days: z.array(DraftProgramDaySchema).min(1),
});

export const ProgramDraftSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(1000).nullable().optional(),
  weeks: z.array(DraftProgramWeekSchema).min(1),
  extractionConfidence: z.enum(["high", "medium", "low"]),
  warnings: z.array(z.string()).default([]),
});

export type ProgramDraft = z.infer<typeof ProgramDraftSchema>;
export type DraftProgramWeek = z.infer<typeof DraftProgramWeekSchema>;
export type DraftProgramDay = z.infer<typeof DraftProgramDaySchema>;
export type DraftProgramBlock = z.infer<typeof DraftProgramBlockSchema>;
export type DraftBlockMovement = z.infer<typeof DraftBlockMovementSchema>;
