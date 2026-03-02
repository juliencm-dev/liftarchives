import {
  sqliteTable,
  text,
  integer,
  real,
  index,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { user } from "./auth";
import { lifts } from "./lifts";

export const programs = sqliteTable(
  "programs",
  {
    id: text("id").primaryKey(),
    createdById: text("created_by_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    durationWeeks: integer("duration_weeks").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("programs_created_by_id_idx").on(table.createdById)],
);

export const programWeeks = sqliteTable(
  "program_weeks",
  {
    id: text("id").primaryKey(),
    programId: text("program_id")
      .notNull()
      .references(() => programs.id, { onDelete: "cascade" }),
    weekNumber: integer("week_number").notNull(),
    name: text("name"),
    notes: text("notes"),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("program_weeks_program_id_idx").on(table.programId)],
);

export const programDays = sqliteTable(
  "program_days",
  {
    id: text("id").primaryKey(),
    weekId: text("week_id")
      .notNull()
      .references(() => programWeeks.id, { onDelete: "cascade" }),
    dayNumber: integer("day_number").notNull(),
    name: text("name"),
    notes: text("notes"),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("program_days_week_id_idx").on(table.weekId)],
);

export const programBlocks = sqliteTable(
  "program_blocks",
  {
    id: text("id").primaryKey(),
    dayId: text("day_id")
      .notNull()
      .references(() => programDays.id, { onDelete: "cascade" }),
    displayOrder: integer("display_order").notNull(),
    sets: integer("sets").notNull().default(1),
    reps: integer("reps").notNull().default(1),
    upTo: integer("up_to", { mode: "boolean" }).notNull().default(false),
    upToPercent: real("up_to_percent"),
    upToRpe: real("up_to_rpe"),
    setDetails: text("set_details", { mode: "json" }).$type<{ percent?: number; rpe?: number }[] | null>(),
    notes: text("notes"),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  },
  (table) => [index("program_blocks_day_id_idx").on(table.dayId)],
);

export const programBlockMovements = sqliteTable(
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
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  },
  (table) => [
    index("program_block_movements_block_id_idx").on(table.blockId),
    index("program_block_movements_lift_id_idx").on(table.liftId),
  ],
);

export const programAssignments = sqliteTable(
  "program_assignments",
  {
    id: text("id").primaryKey(),
    programId: text("program_id")
      .notNull()
      .references(() => programs.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    assignedById: text("assigned_by_id").references(() => user.id, {
      onDelete: "set null",
    }),
    assignedAt: integer("assigned_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
    startDate: text("start_date"),
    status: text("status").default("active").notNull(),
    currentWeekNumber: integer("current_week_number").notNull().default(1),
    currentCycle: integer("current_cycle").notNull().default(1),
    currentWeekStartedAt: integer("current_week_started_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
  },
  (table) => [
    uniqueIndex("program_assignments_program_user_uniq").on(
      table.programId,
      table.userId,
    ),
    index("program_assignments_program_id_idx").on(table.programId),
    index("program_assignments_user_id_idx").on(table.userId),
  ],
);
