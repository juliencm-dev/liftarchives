import { z } from "zod";

export const LifterProfileSchema = z.object({
  dateOfBirth: z.iso.date(),
  weight: z.number().positive(),
  gender: z.enum(["male", "female"]),
  liftUnit: z.enum(["kg", "lb"]),
  competitiveDivision: z.enum(["junior", "senior", "masters"]),
});

export type LifterProfileData = z.infer<typeof LifterProfileSchema>;

export const UpdateCoachProfileSchema = z.object({
  bio: z.string().max(1000).optional(),
});

export type UpdateCoachProfileData = z.infer<typeof UpdateCoachProfileSchema>;

export const UpdateAccountSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export type UpdateAccountData = z.infer<typeof UpdateAccountSchema>;

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export type ChangePasswordData = z.infer<typeof ChangePasswordSchema>;
