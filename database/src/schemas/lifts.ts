import {
  pgTable,
  text,
  boolean,
  date,
  doublePrecision,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import {
  liftCategoryEnum,
  genderEnum,
  competitiveDivisionEnum,
} from "./enums";

export const lifts = pgTable(
  "lifts",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    category: liftCategoryEnum("category").notNull(),
    isCore: boolean("is_core").default(false).notNull(),
    createdById: text("created_by_id").references(() => user.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("lifts_created_by_id_idx").on(table.createdById)],
);

export const competitionCategories = pgTable("competition_categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  qualifyingTotal: integer("qualifying_total"),
  minDateOfBirth: date("min_date_of_birth").notNull(),
  maxDateOfBirth: date("max_date_of_birth"),
  minWeight: doublePrecision("min_weight").notNull(),
  maxWeight: doublePrecision("max_weight"),
  gender: genderEnum("gender").notNull(),
  division: competitiveDivisionEnum("division").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
