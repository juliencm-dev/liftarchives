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
import { programDays } from "./programs";
import { programBlocks } from "./programs";

export const trainingSessions = sqliteTable(
  "training_sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    programDayId: text("program_day_id").references(() => programDays.id, {
      onDelete: "set null",
    }),
    date: text("date").notNull(),
    title: text("title"),
    notes: text("notes"),
    durationMinutes: integer("duration_minutes"),
    startedAt: integer("started_at", { mode: "timestamp" }),
    completedAt: integer("completed_at", { mode: "timestamp" }),
    isSharedWithCoach: integer("is_shared_with_coach", { mode: "boolean" }).default(false).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("training_sessions_user_id_date_idx").on(table.userId, table.date),
    index("training_sessions_program_day_id_idx").on(table.programDayId),
  ],
);

export const sessionExercises = sqliteTable(
  "session_exercises",
  {
    id: text("id").primaryKey(),
    sessionId: text("session_id")
      .notNull()
      .references(() => trainingSessions.id, { onDelete: "cascade" }),
    liftId: text("lift_id")
      .notNull()
      .references(() => lifts.id, { onDelete: "restrict" }),
    programBlockId: text("program_block_id").references(
      () => programBlocks.id,
      { onDelete: "set null" },
    ),
    order: integer("order").notNull(),
    notes: text("notes"),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("session_exercises_session_id_idx").on(table.sessionId),
    index("session_exercises_lift_id_idx").on(table.liftId),
  ],
);

export const sessionSets = sqliteTable(
  "session_sets",
  {
    id: text("id").primaryKey(),
    sessionExerciseId: text("session_exercise_id")
      .notNull()
      .references(() => sessionExercises.id, { onDelete: "cascade" }),
    setNumber: integer("set_number").notNull(),
    weight: real("weight").notNull(),
    reps: integer("reps").notNull(),
    rpe: real("rpe"),
    percentageOf1rm: real("percentage_of_1rm"),
    tempo: text("tempo"),
    restSeconds: integer("rest_seconds"),
    setType: text("set_type").notNull(),
    feedback: text("feedback"),
    notes: text("notes"),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("session_sets_session_exercise_id_idx").on(table.sessionExerciseId),
  ],
);

export const exerciseMedia = sqliteTable(
  "exercise_media",
  {
    id: text("id").primaryKey(),
    sessionExerciseId: text("session_exercise_id")
      .notNull()
      .references(() => sessionExercises.id, { onDelete: "cascade" }),
    uploadedById: text("uploaded_by_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    title: text("title"),
    description: text("description"),
    fileType: text("file_type"),
    fileSize: integer("file_size"),
    isPrivate: integer("is_private", { mode: "boolean" }).default(true).notNull(),
    uploadedAt: integer("uploaded_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  },
  (table) => [
    index("exercise_media_session_exercise_id_idx").on(
      table.sessionExerciseId,
    ),
    index("exercise_media_uploaded_by_id_idx").on(table.uploadedById),
  ],
);
