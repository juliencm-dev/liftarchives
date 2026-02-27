import { pgEnum } from "drizzle-orm/pg-core";

export const genderEnum = pgEnum("gender", ["male", "female"]);

export const liftUnitEnum = pgEnum("lift_unit", ["kg", "lb"]);

export const competitiveDivisionEnum = pgEnum("competitive_division", [
  "junior",
  "senior",
  "masters",
]);

export const liftCategoryEnum = pgEnum("lift_category", [
  "olympic",
  "accessory",
  "pull_variation",
  "drill",
]);

export const clubMembershipRoleEnum = pgEnum("club_membership_role", [
  "admin",
  "coach",
  "lifter",
]);

export const clubMembershipStatusEnum = pgEnum("club_membership_status", [
  "active",
  "pending",
  "banned",
]);

export const setTypeEnum = pgEnum("set_type", [
  "warmup",
  "working",
  "backoff",
  "dropset",
  "amrap",
]);

export const programAssignmentStatusEnum = pgEnum(
  "program_assignment_status",
  ["active", "completed", "paused"],
);

export const prSourceEnum = pgEnum("pr_source", [
  "session",
  "manual",
  "competition",
]);
