import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  emailVerified: z.boolean(),
  image: z.string().nullable().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  plan: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;

export const SignInDataSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export type SignInData = z.infer<typeof SignInDataSchema>;

export const SignUpDataSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export type SignUpData = z.infer<typeof SignUpDataSchema>;
