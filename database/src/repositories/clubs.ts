import { eq, and } from "drizzle-orm";
import { clubs, clubMemberships } from "../schemas";
import type { DbClient } from "./types";

export async function createClub(
  dbClient: DbClient,
  ownerId: string,
  data: { name: string; location?: string; description?: string },
) {
  const clubId = crypto.randomUUID();
  const membershipId = crypto.randomUUID();

  const stmts = [
    dbClient.insert(clubs).values({
      id: clubId,
      ownerId,
      name: data.name,
      location: data.location ?? null,
      description: data.description ?? null,
    }),
    dbClient.insert(clubMemberships).values({
      id: membershipId,
      userId: ownerId,
      clubId,
      role: "owner",
      status: "active",
    }),
  ];

  await (dbClient.batch as (s: any[]) => Promise<unknown[]>)(stmts);

  return dbClient.query.clubs.findFirst({
    where: eq(clubs.id, clubId),
    with: {
      owner: {
        columns: { id: true, name: true, email: true, image: true },
      },
    },
  });
}

export async function getClubById(dbClient: DbClient, clubId: string) {
  return (
    (await dbClient.query.clubs.findFirst({
      where: eq(clubs.id, clubId),
      with: {
        owner: {
          columns: { id: true, name: true, email: true, image: true },
        },
        memberships: {
          with: {
            user: {
              columns: { id: true, name: true, email: true, image: true },
            },
          },
        },
      },
    })) ?? null
  );
}

export async function updateClub(
  dbClient: DbClient,
  ownerId: string,
  clubId: string,
  data: { name?: string; location?: string; description?: string },
) {
  const [updated] = await dbClient
    .update(clubs)
    .set(data)
    .where(and(eq(clubs.id, clubId), eq(clubs.ownerId, ownerId)))
    .returning();
  return updated ?? null;
}

export async function deleteClub(
  dbClient: DbClient,
  ownerId: string,
  clubId: string,
) {
  const [deleted] = await dbClient
    .delete(clubs)
    .where(and(eq(clubs.id, clubId), eq(clubs.ownerId, ownerId)))
    .returning();
  return deleted ?? null;
}

export async function getUserClubs(dbClient: DbClient, userId: string) {
  const memberships = await dbClient.query.clubMemberships.findMany({
    where: eq(clubMemberships.userId, userId),
    with: {
      club: {
        with: {
          owner: {
            columns: { id: true, name: true, email: true, image: true },
          },
          memberships: {
            columns: { id: true },
          },
        },
      },
    },
  });

  return memberships.map((m) => ({
    ...m.club,
    memberCount: m.club.memberships.length,
    userRole: m.role,
  }));
}

export async function getClubMembers(dbClient: DbClient, clubId: string) {
  return dbClient.query.clubMemberships.findMany({
    where: eq(clubMemberships.clubId, clubId),
    with: {
      user: {
        columns: { id: true, name: true, email: true, image: true },
      },
    },
  });
}

export async function addClubMember(
  dbClient: DbClient,
  clubId: string,
  userId: string,
  role: string,
) {
  // Check if already a member
  const existing = await dbClient.query.clubMemberships.findFirst({
    where: and(
      eq(clubMemberships.clubId, clubId),
      eq(clubMemberships.userId, userId),
    ),
  });
  if (existing) return { membership: existing, error: "already_member" as const };

  const [membership] = await dbClient
    .insert(clubMemberships)
    .values({
      id: crypto.randomUUID(),
      userId,
      clubId,
      role,
      status: "active",
    })
    .returning();

  return { membership, error: null };
}

export async function removeClubMember(
  dbClient: DbClient,
  clubId: string,
  userId: string,
) {
  // Prevent removing the club owner
  const club = await dbClient.query.clubs.findFirst({
    where: eq(clubs.id, clubId),
    columns: { ownerId: true },
  });
  if (club?.ownerId === userId) return { error: "cannot_remove_owner" as const };

  const [deleted] = await dbClient
    .delete(clubMemberships)
    .where(
      and(
        eq(clubMemberships.clubId, clubId),
        eq(clubMemberships.userId, userId),
      ),
    )
    .returning();

  if (!deleted) return { error: "not_found" as const };
  return { error: null };
}

export async function isClubMember(
  dbClient: DbClient,
  clubId: string,
  userId: string,
) {
  const membership = await dbClient.query.clubMemberships.findFirst({
    where: and(
      eq(clubMemberships.clubId, clubId),
      eq(clubMemberships.userId, userId),
    ),
  });
  return !!membership;
}
