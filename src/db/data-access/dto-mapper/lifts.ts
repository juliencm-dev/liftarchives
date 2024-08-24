import { CompetitionCategoryDetails, Lift } from "@/db/schemas/lifts";
import {
  BenchmarkHistoryDto,
  BenchmarkLiftsDto,
  CompetitionCategoryDetailsDto,
  EstimationLiftDto,
  LiftDto,
} from "@/db/data-access/dto/lifts/types";
import { UserLift } from "@/db/schema";
import { getEstimationLift, getLiftById } from "../lifts";
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

      const liftEstimation: EstimationLiftDto | undefined =
        await getEstimationLift(lift.id as string);

      const history: BenchmarkHistoryDto[] = [];

      if (userLiftArray.length > 1) {
        const sortedUserLifts = userLiftArray.sort(
          (a, b) =>
            new Date(b.oneRepMaxDate!).getTime() -
            new Date(a.oneRepMaxDate!).getTime()
        );

        for (let i = 1; i < sortedUserLifts.length; i++) {
          const currentLift = sortedUserLifts[i];
          if (currentLift.oneRepMax != null) {
            history.push({
              date: currentLift.oneRepMaxDate,
              weight: currentLift.oneRepMax,
            } as unknown as BenchmarkHistoryDto);
          }
        }
      }

      return {
        weight: userLiftArray.sort((a, b) => b.oneRepMax! - a.oneRepMax!)[0]
          .oneRepMax,
        date: userLiftArray.sort((a, b) => b.oneRepMax! - a.oneRepMax!)[0]
          .oneRepMaxDate,
        lift: lift,
        history: history,
        liftForEstimation:
          liftEstimation !== undefined ? liftEstimation : undefined,
      } as BenchmarkLiftsDto;
    })
  );
}

export async function toCompetitionCategoryDetailsMapper(
  competitionCategoryDetails: CompetitionCategoryDetails[]
): Promise<CompetitionCategoryDetailsDto[]> {
  return competitionCategoryDetails.map((competitionCategoryDetails) => {
    return {
      name: competitionCategoryDetails.name,
      total: competitionCategoryDetails.total,
      minBirthYear: competitionCategoryDetails.minBirthYear,
      maxBirthYear: competitionCategoryDetails.maxBirthYear,
      minWeight: competitionCategoryDetails.minWeight,
      maxWeight: competitionCategoryDetails.maxWeight,
    } as CompetitionCategoryDetailsDto;
  });
}
