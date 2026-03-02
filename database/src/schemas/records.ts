import {
  sqliteTable,
  text,
  integer,
  real,
  index,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { user } from "./auth";
import { lifts } from "./lifts";
import { sessionSets } from "./sessions";

export const personalRecords = sqliteTable(
  "personal_records",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    liftId: text("lift_id")
      .notNull()
      .references(() => lifts.id, { onDelete: "cascade" }),
    weight: real("weight").notNull(),
    reps: integer("reps").notNull(),
    estimatedOneRepMax: real("estimated_one_rep_max"),
    sessionSetId: text("session_set_id").references(() => sessionSets.id, {
      onDelete: "set null",
    }),
    date: text("date").notNull(),
    source: text("source").notNull(),
    notes: text("notes"),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
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
