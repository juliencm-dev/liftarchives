"use server";

import { db } from "@/db/db";
import bcrypt from "bcryptjs";

import { signIn } from "next-auth/react";

export async function signInUser(email: string, password: string) {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  });

  if (!user) {
    throw new Error();
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const isPasswordCorrect = await bcrypt.compare(hashedPassword, user.password);

  if (!isPasswordCorrect) {
    throw new Error();
  }

  await signIn("credentials", {
    email,
    password,
    callbackUrl: "/dashboard",
  });
}
