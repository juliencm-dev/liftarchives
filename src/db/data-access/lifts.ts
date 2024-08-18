import { db } from "@/db/db";
import { lifts } from "@/db/schemas/lifts";
import { LiftDto } from "@/db/data-access/dto/lifts/types";
import { toLiftDtoMapper } from "./dto-mapper/lifts";
import { eq } from "drizzle-orm";

export const addLift = async (lift: LiftDto) => {
  try {
    await db.insert(lifts).values(lift);
  } catch (error) {
    throw new Error("Failed to add lift");
  }
};

export const getBenchmarkLifts = async () => {
  return toLiftDtoMapper(
    await db.query.lifts.findMany({ where: eq(lifts.benchmark, true) })
  );
};

export const getLifts = async () => {
  return toLiftDtoMapper(await db.query.lifts.findMany());
};
