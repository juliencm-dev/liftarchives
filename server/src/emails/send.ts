import { Resend } from "resend";
import { env } from "@/env";
import type { ReactElement } from "react";

const resend = new Resend(env.RESEND_API_KEY);

const FROM_ADDRESS = "Lift Archives <noreply@liftarchives.com>";

export type EmailType = "verify_email" | "reset_password";

export function getFrontendUrl() {
  if (env.NODE_ENV === "production") {
    return env.FRONTEND_URL!;
  }
  return "http://localhost:3000";
}

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string;
  subject: string;
  react: ReactElement;
}) {
  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject,
    react,
  });

  if (error) {
    console.error(`[Email] Failed to send to ${to}:`, error);
    throw error;
  }
}
