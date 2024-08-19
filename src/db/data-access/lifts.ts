import { db } from "@/db/db";
import { lifts } from "@/db/schemas/lifts";
import { UserLift, usersLifts } from "@/db/schemas/users";
import { LiftDto } from "@/db/data-access/dto/lifts/types";
import { toBenchmarkLiftsDtoMapper, toLiftDtoMapper } from "./dto-mapper/lifts";
import { asc, eq } from "drizzle-orm";
import { cache } from "react";

export const addLift = async (lift: LiftDto) => {
  try {
    await db.insert(lifts).values(lift);
  } catch (error) {
    throw new Error("Failed to add lift");
  }
};

export const getBenchmarkLiftsByUserId = cache(async (userId: string) => {
  const userBenchmarkLifts: UserLift[] = await db.query.usersLifts.findMany({
    where: eq(usersLifts.userId, userId),
    orderBy: asc(usersLifts.oneRepMaxDate),
  });

  // Group the lifts by liftId, placing each in its own array inside a main array
  const liftsGroupedByLiftID: Record<string, UserLift[]> = {};

  userBenchmarkLifts.forEach((lift) => {
    if (!liftsGroupedByLiftID[lift.liftId]) {
      liftsGroupedByLiftID[lift.liftId] = [];
    }
    // Add each lift to the corresponding group
    liftsGroupedByLiftID[lift.liftId].push(lift);
  });

  // Convert the object into an array of arrays, each representing a liftId
  const userBenchmarkLiftsArray: UserLift[][] =
    Object.values(liftsGroupedByLiftID);

  return toBenchmarkLiftsDtoMapper(userBenchmarkLiftsArray);
});

export const getLiftById = async (id: string) => {
  return toLiftDtoMapper(
    await db.query.lifts.findMany({ where: eq(lifts.id, id) })
  );
};

export const getBenchmarkLifts = cache(async () => {
  return toLiftDtoMapper(
    await db.query.lifts.findMany({ where: eq(lifts.benchmark, true) })
  );
});

export const getLifts = cache(async () => {
  return toLiftDtoMapper(await db.query.lifts.findMany());
});

export const addUserLift = async (userLift: UserLift) => {
  try {
    await db.insert(usersLifts).values(userLift);
  } catch (error) {
    throw new Error("Failed to add user lift");
  }
};
