import {
  pgTable,
  text,
  date,
  doublePrecision,
  timestamp,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { clubs } from "./clubs";
import {
  genderEnum,
  liftUnitEnum,
  competitiveDivisionEnum,
} from "./enums";

export const lifterProfile = pgTable(
  "lifter_profile",
  {
    userId: text("user_id")
      .primaryKey()
      .references(() => user.id, { onDelete: "cascade" }),
    dateOfBirth: date("date_of_birth").notNull(),
    weight: doublePrecision("weight").notNull(),
    gender: genderEnum("gender").notNull(),
    liftUnit: liftUnitEnum("lift_unit").notNull(),
    competitiveDivision: competitiveDivisionEnum("competitive_division").notNull(),
    clubId: text("club_id").references(() => clubs.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("lifter_profile_club_id_idx").on(table.clubId)],
);

export const coachProfile = pgTable(
  "coach_profile",
  {
    userId: text("user_id")
      .primaryKey()
      .references(() => user.id, { onDelete: "cascade" }),
    bio: text("bio"),
    clubId: text("club_id").references(() => clubs.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("coach_profile_club_id_idx").on(table.clubId)],
);

export const coachLifters = pgTable(
  "coach_lifters",
  {
    id: text("id").primaryKey(),
    coachId: text("coach_id")
      .notNull()
      .references(() => coachProfile.userId, { onDelete: "cascade" }),
    lifterId: text("lifter_id")
      .notNull()
      .references(() => lifterProfile.userId, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    unique("coach_lifters_coach_lifter_uniq").on(table.coachId, table.lifterId),
    index("coach_lifters_coach_id_idx").on(table.coachId),
    index("coach_lifters_lifter_id_idx").on(table.lifterId),
  ],
);
