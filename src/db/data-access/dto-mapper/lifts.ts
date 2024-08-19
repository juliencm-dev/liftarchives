import { Lift } from "@/db/schemas/lifts";
import {
  BenchmarkHistoryDto,
  BenchmarkLiftsDto,
  LiftDto,
} from "@/db/data-access/dto/lifts/types";
import { UserLift } from "@/db/schema";
import { getLiftById } from "../lifts";
import { clamp } from "@/lib/utils";

export async function toLiftDtoMapper(lifts: Lift[]): Promise<LiftDto[]> {
  return lifts.map((lift) => {
    return {
      id: lift.id,
      name: lift.name,
      description: lift.description,
      category: lift.category,
    } as LiftDto;
  });
}

export async function toBenchmarkLiftsDtoMapper(
  userLifts: UserLift[][]
): Promise<BenchmarkLiftsDto[]> {
  return Promise.all(
    userLifts.map(async (userLiftArray) => {
      const lift: LiftDto = (await getLiftById(userLiftArray[0].liftId))[0];
      let history: BenchmarkHistoryDto[] | null = null;

      if (userLiftArray.length > 1) {
        history = [];
        const sortedUserLifts = userLiftArray.sort(
          (a, b) =>
            new Date(b.oneRepMaxDate!).getTime() -
            new Date(a.oneRepMaxDate!).getTime()
        );

        for (let i = 1; i < clamp(sortedUserLifts.length, 1, 5); i++) {
          const currentLift = sortedUserLifts[i];
          history.push({
            date: currentLift.oneRepMaxDate,
            weight: currentLift.oneRepMax,
          } as unknown as BenchmarkHistoryDto);
        }
      }
      // Return the final DTO for this lift
      return {
        weight: userLiftArray[0].oneRepMax,
        date: userLiftArray[0].oneRepMaxDate,
        lift: lift,
        history: history,
      } as BenchmarkLiftsDto;
    })
  );
}
