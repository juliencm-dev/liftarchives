import { z } from "zod";

// ---------------------------------------------------------------------------
// Request schemas
// ---------------------------------------------------------------------------

export const InviteLifterSchema = z.object({
  lifterEmail: z.string().email(),
});

export const AcceptInviteSchema = z.object({
  inviteId: z.string(),
});

export const DeclineInviteSchema = z.object({
  inviteId: z.string(),
});

export const RegisterCoachSchema = z.object({
  bio: z.string().max(1000).optional(),
});

export const AssignProgramToLifterSchema = z.object({
  programId: z.string(),
  startDate: z.string().optional(),
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type InviteLifterData = z.infer<typeof InviteLifterSchema>;
export type AcceptInviteData = z.infer<typeof AcceptInviteSchema>;
export type DeclineInviteData = z.infer<typeof DeclineInviteSchema>;
export type RegisterCoachData = z.infer<typeof RegisterCoachSchema>;
export type AssignProgramToLifterData = z.infer<typeof AssignProgramToLifterSchema>;
