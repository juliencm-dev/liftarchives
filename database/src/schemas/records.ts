import {
  pgTable,
  text,
  integer,
  doublePrecision,
  date,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { lifts } from "./lifts";
import { sessionSets } from "./sessions";
import { prSourceEnum } from "./enums";

export const personalRecords = pgTable(
  "personal_records",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    liftId: text("lift_id")
      .notNull()
      .references(() => lifts.id, { onDelete: "cascade" }),
    weight: doublePrecision("weight").notNull(),
    reps: integer("reps").notNull(),
    estimatedOneRepMax: doublePrecision("estimated_one_rep_max"),
    sessionSetId: text("session_set_id").references(() => sessionSets.id, {
      onDelete: "set null",
    }),
    date: date("date").notNull(),
    source: prSourceEnum("source").notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("personal_records_user_lift_reps_idx").on(
      table.userId,
      table.liftId,
      table.reps,
    ),
    index("personal_records_session_set_id_idx").on(table.sessionSetId),
  ],
);
