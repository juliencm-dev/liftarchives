import {
  pgTable,
  text,
  integer,
  boolean,
  doublePrecision,
  date,
  timestamp,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { lifts } from "./lifts";
import { programAssignmentStatusEnum } from "./enums";

export const programs = pgTable(
  "programs",
  {
    id: text("id").primaryKey(),
    createdById: text("created_by_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    durationWeeks: integer("duration_weeks").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("programs_created_by_id_idx").on(table.createdById)],
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

export const programBlocks = pgTable(
  "program_blocks",
  {
    id: text("id").primaryKey(),
    dayId: text("day_id")
      .notNull()
      .references(() => programDays.id, { onDelete: "cascade" }),
    displayOrder: integer("display_order").notNull(),
    sets: integer("sets").notNull().default(1),
    reps: integer("reps").notNull().default(1),
    upTo: boolean("up_to").notNull().default(false),
    upToPercent: doublePrecision("up_to_percent"),
    upToRpe: doublePrecision("up_to_rpe"),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("program_blocks_day_id_idx").on(table.dayId)],
);

export const programBlockMovements = pgTable(
  "program_block_movements",
  {
    id: text("id").primaryKey(),
    blockId: text("block_id")
      .notNull()
      .references(() => programBlocks.id, { onDelete: "cascade" }),
    liftId: text("lift_id")
      .notNull()
      .references(() => lifts.id, { onDelete: "restrict" }),
    displayOrder: integer("display_order").notNull(),
    reps: integer("reps").notNull().default(1),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("program_block_movements_block_id_idx").on(table.blockId),
    index("program_block_movements_lift_id_idx").on(table.liftId),
  ],
);

export const programAssignments = pgTable(
  "program_assignments",
  {
    id: text("id").primaryKey(),
    programId: text("program_id")
      .notNull()
      .references(() => programs.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    assignedAt: timestamp("assigned_at").defaultNow().notNull(),
    startDate: date("start_date"),
    status: programAssignmentStatusEnum("status").default("active").notNull(),
    currentWeekNumber: integer("current_week_number").notNull().default(1),
    currentCycle: integer("current_cycle").notNull().default(1),
    currentWeekStartedAt: timestamp("current_week_started_at")
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique("program_assignments_program_user_uniq").on(
      table.programId,
      table.userId,
    ),
    index("program_assignments_program_id_idx").on(table.programId),
    index("program_assignments_user_id_idx").on(table.userId),
  ],
);
