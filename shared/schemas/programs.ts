import { z } from "zod";

// ---------------------------------------------------------------------------
// Request schemas — what the client sends
// ---------------------------------------------------------------------------

export const BlockMovementSchema = z.object({
  liftId: z.string(),
  reps: z.number().int().min(1).default(1),
});

export const ProgramBlockSchema = z.object({
  sets: z.number().int().min(1).default(1),
  reps: z.number().int().min(1).default(1),
  movements: z.array(BlockMovementSchema).min(1),
  upTo: z.boolean().default(false),
  upToPercent: z.number().min(1).max(100).optional(),
  upToRpe: z.number().min(1).max(10).optional(),
  notes: z.string().max(500).optional(),
});

export const ProgramDaySchema = z.object({
  name: z.string().optional(),
  blocks: z.array(ProgramBlockSchema),
});

export const ProgramWeekInputSchema = z.object({
  name: z.string().optional(),
  days: z.array(ProgramDaySchema).min(1, "At least one day is required"),
});

export const CreateProgramSchema = z.object({
  name: z.string().min(1, "Program name is required"),
  description: z.string().max(1000).optional(),
  weeks: z
    .array(ProgramWeekInputSchema)
    .min(1, "At least one week is required"),
});

export const UpdateProgramSchema = z.object({
  name: z.string().min(1, "Program name is required"),
  description: z.string().max(1000).optional(),
  weeks: z
    .array(ProgramWeekInputSchema)
    .min(1, "At least one week is required"),
});

export const AssignProgramSchema = z.object({
  programId: z.string(),
  startDate: z.string().optional(),
});

export const CompleteDaySchema = z.object({
  programDayId: z.string(),
});

export type CreateProgramData = z.infer<typeof CreateProgramSchema>;
export type UpdateProgramData = z.infer<typeof UpdateProgramSchema>;
export type AssignProgramData = z.infer<typeof AssignProgramSchema>;
export type CompleteDayData = z.infer<typeof CompleteDaySchema>;
export type ProgramWeekInputData = z.infer<typeof ProgramWeekInputSchema>;
export type ProgramDayData = z.infer<typeof ProgramDaySchema>;
export type ProgramBlockData = z.infer<typeof ProgramBlockSchema>;
export type BlockMovementData = z.infer<typeof BlockMovementSchema>;

// ---------------------------------------------------------------------------
// Response schemas — single source of truth for what the server returns
// ---------------------------------------------------------------------------

const LiftCategoryEnum = z.enum([
  "olympic",
  "powerlifting",
  "crossfit",
  "strongman",
  "hybrid",
  "hyrox",
  "accessory",
]);

export const ProgramLiftResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  isCore: z.boolean(),
  parentLiftId: z.string().nullable(),
  category: LiftCategoryEnum,
  description: z.string().nullable(),
});

export const BlockMovementResponseSchema = z.object({
  id: z.string(),
  liftId: z.string(),
  displayOrder: z.number(),
  reps: z.number(),
  lift: ProgramLiftResponseSchema,
});

export const ProgramBlockResponseSchema = z.object({
  id: z.string(),
  displayOrder: z.number(),
  sets: z.number(),
  reps: z.number(),
  upTo: z.boolean(),
  upToPercent: z.number().nullable(),
  upToRpe: z.number().nullable(),
  notes: z.string().nullable(),
  movements: z.array(BlockMovementResponseSchema),
});

export const ProgramDayResponseSchema = z.object({
  id: z.string(),
  dayNumber: z.number(),
  name: z.string().nullable(),
  notes: z.string().nullable(),
  blocks: z.array(ProgramBlockResponseSchema),
});

export const ProgramWeekResponseSchema = z.object({
  id: z.string(),
  weekNumber: z.number(),
  name: z.string().nullable(),
  notes: z.string().nullable(),
  days: z.array(ProgramDayResponseSchema),
});

export const ProgramResponseSchema = z.object({
  id: z.string(),
  createdById: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  durationWeeks: z.number(),
  weeks: z.array(ProgramWeekResponseSchema),
});

/** Lighter schema for list endpoint — weeks → days only, no blocks */
export const ProgramSummaryResponseSchema = z.object({
  id: z.string(),
  createdById: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  durationWeeks: z.number(),
  weeks: z.array(
    z.object({
      id: z.string(),
      weekNumber: z.number(),
      name: z.string().nullable(),
      notes: z.string().nullable(),
      days: z.array(
        z.object({
          id: z.string(),
          dayNumber: z.number(),
          name: z.string().nullable(),
          notes: z.string().nullable(),
        }),
      ),
    }),
  ),
});

export type ProgramResponse = z.infer<typeof ProgramResponseSchema>;
export type ProgramSummaryResponse = z.infer<typeof ProgramSummaryResponseSchema>;
export type ProgramDayResponse = z.infer<typeof ProgramDayResponseSchema>;
export type ProgramBlockResponse = z.infer<typeof ProgramBlockResponseSchema>;
export type BlockMovementResponse = z.infer<typeof BlockMovementResponseSchema>;
export type ProgramLiftResponse = z.infer<typeof ProgramLiftResponseSchema>;
export type ProgramWeekResponse = z.infer<typeof ProgramWeekResponseSchema>;
