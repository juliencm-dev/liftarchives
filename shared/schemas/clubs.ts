import { z } from "zod";

// ---------------------------------------------------------------------------
// Request schemas
// ---------------------------------------------------------------------------

export const CreateClubSchema = z.object({
  name: z.string().min(1).max(100),
  location: z.string().max(200).optional(),
  description: z.string().max(1000).optional(),
});

export const UpdateClubSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  location: z.string().max(200).optional(),
  description: z.string().max(1000).optional(),
});

export const AddClubMemberSchema = z.object({
  userId: z.string(),
  role: z.string().default("member"),
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CreateClubData = z.infer<typeof CreateClubSchema>;
export type UpdateClubData = z.infer<typeof UpdateClubSchema>;
export type AddClubMemberData = z.infer<typeof AddClubMemberSchema>;
