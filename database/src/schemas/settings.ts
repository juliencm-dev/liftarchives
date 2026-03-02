import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { user } from "./auth";

export const trainingSettings = sqliteTable("training_settings", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  barWeight: real("bar_weight").notNull().default(20),
  snatchIncrement: real("snatch_increment").notNull().default(5),
  cleanAndJerkIncrement: real("clean_and_jerk_increment")
    .notNull()
    .default(10),
  powerliftingIncrement: real("powerlifting_increment")
    .notNull()
    .default(2.5),
  accessoryIncrement: real("accessory_increment")
    .notNull()
    .default(2.5),
  defaultRestSeconds: integer("default_rest_seconds").notNull().default(120),
  defaultBlockRestSeconds: integer("default_block_rest_seconds")
    .notNull()
    .default(180),
  intensityMode: text("intensity_mode").notNull().default("percent"),
});
