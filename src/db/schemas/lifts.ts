import {
  boolean,
  date,
  doublePrecision,
  pgTable,
  primaryKey,
  text,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { max, min } from "drizzle-orm";

export const lifts = pgTable("lifts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name"),
  description: text("description"),
  category: text("category"),
  benchmark: boolean("benchmark").default(false),
});

export const liftsEstimates = pgTable(
  "liftsEstimates",
  {
    liftId: text("liftId")
      .notNull()
      .references(() => lifts.id, { onDelete: "cascade" }),
    liftForCalculationId: text("liftForCalculationId")
      .notNull()
      .references(() => lifts.id, { onDelete: "cascade" }),
    percentage: doublePrecision("percentage").notNull(),
    description: text("description").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.liftId, table.liftForCalculationId] }),
    };
  }
);

export const competitionCategoriesDetails = pgTable(
  "competitionCategoriesDetails",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text("name").notNull(),
    total: text("description").notNull(),
    minBirthDate: date("minBirthDate").notNull(),
    maxBirthDate: date("maxBirthDate").notNull(),
    minWeight: doublePrecision("minWeight").notNull(),
    maxWeight: doublePrecision("maxWeight").notNull(),
  }
);

export type Lift = typeof lifts.$inferSelect;
export type LiftEstimate = typeof liftsEstimates.$inferSelect;
