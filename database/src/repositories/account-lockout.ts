import { eq } from "drizzle-orm";
import { user } from "../schemas";
import type { DbClient } from "./types";

export async function isAccountLocked(
  dbClient: DbClient,
  email: string,
): Promise<boolean> {
  const result = await dbClient.query.user.findFirst({
    where: eq(user.email, email),
    columns: { locked: true },
  });
  return result?.locked ?? false;
}

export async function lockAccountByEmail(
  dbClient: DbClient,
  email: string,
): Promise<void> {
  await dbClient
    .update(user)
    .set({ locked: true })
    .where(eq(user.email, email));
}

export async function unlockAccountById(
  dbClient: DbClient,
  userId: string,
): Promise<void> {
  await dbClient
    .update(user)
    .set({ locked: false })
    .where(eq(user.id, userId));
}
