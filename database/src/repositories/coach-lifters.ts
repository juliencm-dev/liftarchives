import { eq, and } from "drizzle-orm";
import {
  coachLifters,
  coachInvitations,
  lifterProfile,
  user,
} from "../schemas";
import type { DbClient } from "./types";

export async function getCoachLifters(dbClient: DbClient, coachId: string) {
  return dbClient.query.coachLifters.findMany({
    where: eq(coachLifters.coachId, coachId),
    with: {
      lifter: {
        with: {
          user: {
            columns: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  });
}

export async function getLifterCoach(dbClient: DbClient, lifterId: string) {
  const row = await dbClient.query.coachLifters.findFirst({
    where: eq(coachLifters.lifterId, lifterId),
    with: {
      coach: {
        with: {
          user: {
            columns: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  });
  return row ?? null;
}

export async function inviteLifter(
  dbClient: DbClient,
  coachId: string,
  lifterEmail: string,
) {
  // Check if already invited (pending)
  const existing = await dbClient.query.coachInvitations.findFirst({
    where: and(
      eq(coachInvitations.coachId, coachId),
      eq(coachInvitations.lifterEmail, lifterEmail),
      eq(coachInvitations.status, "pending"),
    ),
  });
  if (existing) return { invitation: existing, error: "already_invited" as const };

  // Check if already a lifter
  const existingUser = await dbClient.query.user.findFirst({
    where: eq(user.email, lifterEmail),
    columns: { id: true },
  });

  let matchedLifterId: string | null = null;
  if (existingUser) {
    const existingLifter = await dbClient.query.lifterProfile.findFirst({
      where: eq(lifterProfile.userId, existingUser.id),
      columns: { userId: true },
    });
    if (existingLifter) {
      // Check if already coaching this lifter
      const alreadyCoaching = await dbClient.query.coachLifters.findFirst({
        where: and(
          eq(coachLifters.coachId, coachId),
          eq(coachLifters.lifterId, existingLifter.userId),
        ),
      });
      if (alreadyCoaching) return { invitation: null, error: "already_coaching" as const };
      matchedLifterId = existingLifter.userId;
    }
  }

  const inviteCode = crypto.randomUUID().slice(0, 8);

  const [invitation] = await dbClient
    .insert(coachInvitations)
    .values({
      id: crypto.randomUUID(),
      coachId,
      lifterEmail,
      lifterId: matchedLifterId,
      status: "pending",
      inviteCode,
    })
    .returning();

  return { invitation, error: null };
}

export async function getPendingInvitesForCoach(
  dbClient: DbClient,
  coachId: string,
) {
  return dbClient.query.coachInvitations.findMany({
    where: and(
      eq(coachInvitations.coachId, coachId),
      eq(coachInvitations.status, "pending"),
    ),
  });
}

export async function getPendingInvitesForLifter(
  dbClient: DbClient,
  lifterId: string,
) {
  return dbClient.query.coachInvitations.findMany({
    where: and(
      eq(coachInvitations.lifterId, lifterId),
      eq(coachInvitations.status, "pending"),
    ),
    with: {
      coach: {
        with: {
          user: {
            columns: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  });
}

export async function acceptInvite(
  dbClient: DbClient,
  inviteId: string,
  lifterId: string,
) {
  // Get the invitation
  const invitation = await dbClient.query.coachInvitations.findFirst({
    where: and(
      eq(coachInvitations.id, inviteId),
      eq(coachInvitations.lifterId, lifterId),
      eq(coachInvitations.status, "pending"),
    ),
  });
  if (!invitation) return null;

  // Check not already coaching
  const existing = await dbClient.query.coachLifters.findFirst({
    where: and(
      eq(coachLifters.coachId, invitation.coachId),
      eq(coachLifters.lifterId, lifterId),
    ),
  });
  if (existing) return null;

  // Update invitation and create relationship
  const stmts = [
    dbClient
      .update(coachInvitations)
      .set({ status: "accepted", lifterId })
      .where(eq(coachInvitations.id, inviteId)),
    dbClient.insert(coachLifters).values({
      id: crypto.randomUUID(),
      coachId: invitation.coachId,
      lifterId,
    }),
  ];

  await (dbClient.batch as (s: any[]) => Promise<unknown[]>)(stmts);

  return invitation;
}

export async function declineInvite(
  dbClient: DbClient,
  inviteId: string,
  lifterId: string,
) {
  const [result] = await dbClient
    .update(coachInvitations)
    .set({ status: "declined" })
    .where(
      and(
        eq(coachInvitations.id, inviteId),
        eq(coachInvitations.lifterId, lifterId),
        eq(coachInvitations.status, "pending"),
      ),
    )
    .returning();
  return result ?? null;
}

export async function removeLifter(
  dbClient: DbClient,
  coachId: string,
  lifterId: string,
) {
  const [deleted] = await dbClient
    .delete(coachLifters)
    .where(
      and(
        eq(coachLifters.coachId, coachId),
        eq(coachLifters.lifterId, lifterId),
      ),
    )
    .returning();
  return deleted ?? null;
}
