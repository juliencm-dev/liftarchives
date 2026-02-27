import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { hashPassword, verifyPassword } from "@/utils/password";
import { db, unlockAccountById } from "@liftarchives/database";
import { finalizeSignUp } from "@/hooks/auth/signup";
import { clearFailures } from "@/hooks/auth/signin";
import { sendEmail, getFrontendUrl } from "@/emails/send";
import { VerifyEmail } from "@/emails/verify-email";
import { ResetPassword } from "@/emails/reset-password";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  trustedOrigins:
    process.env.NODE_ENV === "production"
      ? [process.env.FRONTEND_URL!]
      : ["http://localhost:3000", "http://127.0.0.1:3000"],
  hooks: {
    after: finalizeSignUp,
  },
  user: {
    additionalFields: {
      firstName: {
        type: "string",
        required: false,
      },
      lastName: {
        type: "string",
        required: false,
      },
      locked: {
        type: "boolean",
        required: false,
      },
      plan: {
        type: "string",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    password: {
      hash: hashPassword,
      verify: verifyPassword,
    },
    sendResetPassword: async ({ user, token }) => {
      const resetUrl = `${getFrontendUrl()}/reset-password?token=${token}`;
      sendEmail({
        to: user.email,
        subject: "Reset your password",
        react: ResetPassword({ userName: user.name ?? "", resetUrl }),
      }).catch((err) =>
        console.error("[Auth] Failed to send reset password email:", err),
      );
    },
    onPasswordReset: async ({ user }) => {
      await unlockAccountById(db, user.id);
      clearFailures(user.email);
      console.log(`Password for user ${user.email} has been reset. Account unlocked.`);
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, token }) => {
      const verificationUrl = `${getFrontendUrl()}/verify-email?token=${token}`;
      sendEmail({
        to: user.email,
        subject: "Verify your email address",
        react: VerifyEmail({ userName: user.name ?? "", verificationUrl }),
      }).catch((err) =>
        console.error("[Auth] Failed to send verification email:", err),
      );
    },
  },
});
