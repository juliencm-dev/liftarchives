import { z } from "zod";

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),

    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.url(),

    RESEND_API_KEY: z.string().min(1),

    OPENROUTER_API_KEY: z.string().min(1),

    R2_BUCKET_NAME: z.string().min(1),
    R2_ACCESS_KEY_ID: z.string().min(1),
    R2_SECRET_ACCESS_KEY: z.string().min(1),
    R2_ENDPOINT: z.string().min(1),
    R2_PUBLIC_URL: z.string().min(1),

    FRONTEND_URL: z.string().optional(),
  })
  .refine(
    (data) => !(data.NODE_ENV === "production" && !data.FRONTEND_URL),
    { message: "FRONTEND_URL is required in production", path: ["FRONTEND_URL"] },
  );

type Env = z.infer<typeof envSchema>;
let _env: Env | null = null;

function validateEnv(): Env {
  if (_env) return _env;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const msg =
      "Invalid environment variables:\n" + z.prettifyError(parsed.error);
    console.error(msg);
    throw new Error(msg);
  }
  _env = parsed.data;
  return _env;
}

export const env: Env = new Proxy({} as Env, {
  get(_, prop: string) {
    return validateEnv()[prop as keyof Env];
  },
});
