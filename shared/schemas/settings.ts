import { z } from "zod";

export const UpdateTrainingSettingsSchema = z.object({
  barWeight: z.number().min(0).max(100).optional(),
  olympicIncrement: z.number().min(0.25).max(10).optional(),
  powerliftingIncrement: z.number().min(0.5).max(10).optional(),
  accessoryIncrement: z.number().min(0.5).max(10).optional(),
  defaultRestSeconds: z.number().int().min(0).max(600).optional(),
  defaultBlockRestSeconds: z.number().int().min(0).max(600).optional(),
});

export const TrainingSettingsResponseSchema = z.object({
  userId: z.string(),
  barWeight: z.number(),
  olympicIncrement: z.number(),
  powerliftingIncrement: z.number(),
  accessoryIncrement: z.number(),
  defaultRestSeconds: z.number(),
  defaultBlockRestSeconds: z.number(),
});

export type UpdateTrainingSettingsData = z.infer<
  typeof UpdateTrainingSettingsSchema
>;
export type TrainingSettingsResponse = z.infer<
  typeof TrainingSettingsResponseSchema
>;
