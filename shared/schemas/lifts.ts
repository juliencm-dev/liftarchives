import { z } from "zod";

export const AddPersonalRecordSchema = z.object({
  liftId: z.string(),
  weight: z.number().positive(),
  reps: z.int().min(1).default(1),
  date: z.iso.date(),
  notes: z.string().max(500).optional(),
});

export type AddPersonalRecordData = z.infer<typeof AddPersonalRecordSchema>;

export const CreateLiftSchema = z.object({
  name: z.string().min(1, "Lift name is required"),
  category: z.enum(["olympic", "powerlifting", "accessory"]),
  description: z.string().max(500).optional(),
  parentLiftId: z.string().optional(),
});

export type CreateLiftData = z.infer<typeof CreateLiftSchema>;
