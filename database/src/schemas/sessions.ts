import {
  pgTable,
  text,
  integer,
  doublePrecision,
  date,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { lifts } from "./lifts";
import { programDays } from "./programs";
import { setTypeEnum, setFeedbackEnum } from "./enums";
import { programBlocks } from "./programs";

export const trainingSessions = pgTable(
  "training_sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    programDayId: text("program_day_id").references(() => programDays.id, {
      onDelete: "set null",
    }),
    date: date("date").notNull(),
    title: text("title"),
    notes: text("notes"),
    durationMinutes: integer("duration_minutes"),
    startedAt: timestamp("started_at"),
    completedAt: timestamp("completed_at"),
    isSharedWithCoach: boolean("is_shared_with_coach").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("training_sessions_user_id_date_idx").on(table.userId, table.date),
    index("training_sessions_program_day_id_idx").on(table.programDayId),
  ],
);

export const sessionExercises = pgTable(
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
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("session_exercises_session_id_idx").on(table.sessionId),
    index("session_exercises_lift_id_idx").on(table.liftId),
  ],
);

export const sessionSets = pgTable(
  "session_sets",
  {
    id: text("id").primaryKey(),
    sessionExerciseId: text("session_exercise_id")
      .notNull()
      .references(() => sessionExercises.id, { onDelete: "cascade" }),
    setNumber: integer("set_number").notNull(),
    weight: doublePrecision("weight").notNull(),
    reps: integer("reps").notNull(),
    rpe: doublePrecision("rpe"),
    percentageOf1rm: doublePrecision("percentage_of_1rm"),
    tempo: text("tempo"),
    restSeconds: integer("rest_seconds"),
    setType: setTypeEnum("set_type").notNull(),
    feedback: setFeedbackEnum("feedback"),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("session_sets_session_exercise_id_idx").on(table.sessionExerciseId),
  ],
);

export const exerciseMedia = pgTable(
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
    isPrivate: boolean("is_private").default(true).notNull(),
    uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  },
  (table) => [
    index("exercise_media_session_exercise_id_idx").on(
      table.sessionExerciseId,
    ),
    index("exercise_media_uploaded_by_id_idx").on(table.uploadedById),
  ],
);
