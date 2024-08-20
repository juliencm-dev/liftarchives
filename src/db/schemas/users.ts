import {
  timestamp,
  pgTable,
  text,
  integer,
  doublePrecision,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { InferResultType } from "@/db/schema";
import { lifts } from "./lifts";

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  email: text("email").notNull(),
  password: text("password").notNull(),
  firstName: text("firstName"),
  lastName: text("lastName"),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  accountIsSetup: timestamp("accountIsSetup", { mode: "date" }),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  image: text("image"),
});

export const usersInformations = pgTable("usersInformations", {
  userId: text("userId")
    .notNull()
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  age: integer("age").notNull(),
  weight: text("weight").notNull(),
  liftsUnit: text("liftsUnits").notNull(),
});

export const usersLifts = pgTable("usersLifts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  liftId: text("liftId")
    .notNull()
    .references(() => lifts.id, { onDelete: "cascade" }),
  oneRepMax: doublePrecision("oneRepMax"),
  oneRepMaxDate: timestamp("oneRepMaxDate", { mode: "date" }),
});

export type User = typeof users.$inferSelect;
export type UserInformation = typeof usersInformations.$inferSelect;
export type UserLift = typeof usersLifts.$inferSelect;

export type UserWithRelations = InferResultType<
  "users",
  { usersInformations: true; usersLifts: true }
>;
