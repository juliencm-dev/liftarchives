import { db } from "@/db/db";
import { lifts } from "@/db/schemas/lifts";
import { usersLifts } from "@/db/schemas/users";
import { LiftDto } from "@/db/data-access/dto/lifts/types";
import { toBenchmarkLiftsDtoMapper, toLiftDtoMapper } from "./dto-mapper/lifts";
import { eq } from "drizzle-orm";
import { cache } from "react";

export const addLift = async (lift: LiftDto) => {
  try {
    await db.insert(lifts).values(lift);
  } catch (error) {
    throw new Error("Failed to add lift");
  }
};

export const getBenchmarkLiftsByUserId = cache(async (userId: string) => {
  const userBenchmarkLifts = await db.query.usersLifts.findMany({
    where: eq(usersLifts.userId, userId),
  });
  return toBenchmarkLiftsDtoMapper(userBenchmarkLifts);
});

export const getLiftById = async (id: string) => {
  return toLiftDtoMapper(await db.query.lifts.findMany({ where: eq(lifts.id, id) }));
};

export const getBenchmarkLifts = cache(async () => {
  return toLiftDtoMapper(await db.query.lifts.findMany({ where: eq(lifts.benchmark, true) }));
});

export const getLifts = cache(async () => {
  return toLiftDtoMapper(await db.query.lifts.findMany());
});
