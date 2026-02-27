import {
  pgTable,
  text,
  integer,
  doublePrecision,
  date,
  timestamp,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { coachProfile, lifterProfile } from "./profiles";
import { lifts } from "./lifts";
import { setTypeEnum, programAssignmentStatusEnum } from "./enums";

export const programs = pgTable(
  "programs",
  {
    id: text("id").primaryKey(),
    coachId: text("coach_id")
      .notNull()
      .references(() => coachProfile.userId, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    durationWeeks: integer("duration_weeks").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("programs_coach_id_idx").on(table.coachId)],
);

export const programWeeks = pgTable(
  "program_weeks",
  {
    id: text("id").primaryKey(),
    programId: text("program_id")
      .notNull()
      .references(() => programs.id, { onDelete: "cascade" }),
    weekNumber: integer("week_number").notNull(),
    name: text("name"),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("program_weeks_program_id_idx").on(table.programId)],
);

export const programDays = pgTable(
  "program_days",
  {
    id: text("id").primaryKey(),
    weekId: text("week_id")
      .notNull()
      .references(() => programWeeks.id, { onDelete: "cascade" }),
    dayNumber: integer("day_number").notNull(),
    name: text("name"),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("program_days_week_id_idx").on(table.weekId)],
);

export const programDayExercises = pgTable(
  "program_day_exercises",
  {
    id: text("id").primaryKey(),
    dayId: text("day_id")
      .notNull()
      .references(() => programDays.id, { onDelete: "cascade" }),
    liftId: text("lift_id")
      .notNull()
      .references(() => lifts.id, { onDelete: "restrict" }),
    order: integer("order").notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("program_day_exercises_day_id_idx").on(table.dayId),
    index("program_day_exercises_lift_id_idx").on(table.liftId),
  ],
);

export const programDayExerciseSets = pgTable(
  "program_day_exercise_sets",
  {
    id: text("id").primaryKey(),
    exerciseId: text("exercise_id")
      .notNull()
      .references(() => programDayExercises.id, { onDelete: "cascade" }),
    setNumber: integer("set_number").notNull(),
    prescribedReps: integer("prescribed_reps"),
    prescribedWeight: doublePrecision("prescribed_weight"),
    prescribedRpe: doublePrecision("prescribed_rpe"),
    prescribedPercentage: doublePrecision("prescribed_percentage"),
    prescribedTempo: text("prescribed_tempo"),
    prescribedRestSeconds: integer("prescribed_rest_seconds"),
    setType: setTypeEnum("set_type").notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("program_day_exercise_sets_exercise_id_idx").on(table.exerciseId),
  ],
);

export const programAssignments = pgTable(
  "program_assignments",
  {
    id: text("id").primaryKey(),
    programId: text("program_id")
      .notNull()
      .references(() => programs.id, { onDelete: "cascade" }),
    lifterId: text("lifter_id")
      .notNull()
      .references(() => lifterProfile.userId, { onDelete: "cascade" }),
    assignedAt: timestamp("assigned_at").defaultNow().notNull(),
    startDate: date("start_date"),
    status: programAssignmentStatusEnum("status").default("active").notNull(),
  },
  (table) => [
    unique("program_assignments_program_lifter_uniq").on(
      table.programId,
      table.lifterId,
    ),
    index("program_assignments_program_id_idx").on(table.programId),
    index("program_assignments_lifter_id_idx").on(table.lifterId),
  ],
);
