import {
  boolean,
  doublePrecision,
  pgTable,
  primaryKey,
  text,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

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

export type Lift = typeof lifts.$inferSelect;
export type LiftEstimate = typeof liftsEstimates.$inferSelect;
