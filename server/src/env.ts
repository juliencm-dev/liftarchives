import { z } from "zod";

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),

    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.url(),

    DATABASE_URL: z.string().optional(),
    DATABASE_URL_DEV: z.string().optional(),

    RESEND_API_KEY: z.string().min(1),

    FRONTEND_URL: z.string().optional(),
  })
  .refine(
    (data) => !(data.NODE_ENV === "production" && !data.DATABASE_URL),
    { message: "DATABASE_URL is required in production", path: ["DATABASE_URL"] },
  )
  .refine(
    (data) => !(data.NODE_ENV !== "production" && !data.DATABASE_URL_DEV),
    { message: "DATABASE_URL_DEV is required in development", path: ["DATABASE_URL_DEV"] },
  )
  .refine(
    (data) => !(data.NODE_ENV === "production" && !data.FRONTEND_URL),
    { message: "FRONTEND_URL is required in production", path: ["FRONTEND_URL"] },
  );

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:\n", z.prettifyError(parsed.error));
  process.exit(1);
}

export const env = parsed.data;
