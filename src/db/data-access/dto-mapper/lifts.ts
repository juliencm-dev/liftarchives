import { Lift } from "@/db/schemas/lifts";
import { BenchmarkLiftsDto, LiftDto } from "@/db/data-access/dto/lifts/types";
import { UserLift } from "@/db/schema";
import { getLiftById } from "../lifts";

export async function toLiftDtoMapper(lifts: Lift[]): Promise<LiftDto[]> {
  return lifts.map(lift => {
    return {
      id: lift.id,
      name: lift.name,
      description: lift.description,
      category: lift.category,
    } as LiftDto;
  });
}

export async function toBenchmarkLiftsDtoMapper(userLifts: UserLift[]): Promise<BenchmarkLiftsDto[]> {
  return Promise.all(
    userLifts.map(async userLift => {
      const lift: LiftDto = (await getLiftById(userLift.liftId))[0];
      return {
        weight: userLift.oneRepMax,
        date: userLift.oneRepMaxDate,
        lift: lift,
      } as BenchmarkLiftsDto;
    })
  );
}
