import {
  sqliteTable,
  text,
  real,
  integer,
  index,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { user } from "./auth";
import { clubs } from "./clubs";

export const lifterProfile = sqliteTable(
  "lifter_profile",
  {
    userId: text("user_id")
      .primaryKey()
      .references(() => user.id, { onDelete: "cascade" }),
    dateOfBirth: text("date_of_birth").notNull(),
    weight: real("weight").notNull(),
    gender: text("gender").notNull(),
    liftUnit: text("lift_unit").notNull(),
    competitiveDivision: text("competitive_division").notNull(),
    clubId: text("club_id").references(() => clubs.id, { onDelete: "set null" }),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("lifter_profile_club_id_idx").on(table.clubId)],
);

export const coachProfile = sqliteTable(
  "coach_profile",
  {
    userId: text("user_id")
      .primaryKey()
      .references(() => user.id, { onDelete: "cascade" }),
    bio: text("bio"),
    clubId: text("club_id").references(() => clubs.id, { onDelete: "set null" }),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("coach_profile_club_id_idx").on(table.clubId)],
);

export const coachInvitations = sqliteTable(
  "coach_invitations",
  {
    id: text("id").primaryKey(),
    coachId: text("coach_id")
      .notNull()
      .references(() => coachProfile.userId, { onDelete: "cascade" }),
    lifterEmail: text("lifter_email").notNull(),
    lifterId: text("lifter_id").references(() => lifterProfile.userId, {
      onDelete: "set null",
    }),
    status: text("status").notNull().default("pending"),
    inviteCode: text("invite_code").unique(),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp" }),
  },
  (table) => [
    index("coach_invitations_coach_id_idx").on(table.coachId),
    index("coach_invitations_lifter_id_idx").on(table.lifterId),
    index("coach_invitations_lifter_email_idx").on(table.lifterEmail),
  ],
);

export const coachLifters = sqliteTable(
  "coach_lifters",
  {
    id: text("id").primaryKey(),
    coachId: text("coach_id")
      .notNull()
      .references(() => coachProfile.userId, { onDelete: "cascade" }),
    lifterId: text("lifter_id")
      .notNull()
      .references(() => lifterProfile.userId, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  },
  (table) => [
    uniqueIndex("coach_lifters_coach_lifter_uniq").on(table.coachId, table.lifterId),
    index("coach_lifters_coach_id_idx").on(table.coachId),
    index("coach_lifters_lifter_id_idx").on(table.lifterId),
  ],
);
