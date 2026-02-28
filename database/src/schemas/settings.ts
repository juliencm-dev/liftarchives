import { pgTable, text, integer, doublePrecision } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const trainingSettings = pgTable("training_settings", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  barWeight: doublePrecision("bar_weight").notNull().default(20),
  olympicIncrement: doublePrecision("olympic_increment").notNull().default(1.0),
  powerliftingIncrement: doublePrecision("powerlifting_increment")
    .notNull()
    .default(2.5),
  accessoryIncrement: doublePrecision("accessory_increment")
    .notNull()
    .default(2.5),
  defaultRestSeconds: integer("default_rest_seconds").notNull().default(120),
  defaultBlockRestSeconds: integer("default_block_rest_seconds")
    .notNull()
    .default(180),
});
