import { db } from "@/db/db";
import { lifts } from "../schemas/lifts";
import { LiftDto } from "./dto/lifts/types";

export const addLift = async (lift: LiftDto) => {
  try {
    await db.insert(lifts).values(lift);
  } catch (error) {
    throw new Error("Failed to add lift");
  }
};
