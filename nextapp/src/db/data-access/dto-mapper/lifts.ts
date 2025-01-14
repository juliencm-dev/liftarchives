import { CompetitionCategoryDetails, Lift } from "@/db/schemas/lifts";
import { LiftHistoryDto, SavedLiftsDto, CompetitionCategoryDetailsDto, EstimationLiftDto, LiftDto, UserTrackedLiftDto } from "@/db/data-access/dto/lifts/types";
import { UserLift, UserTrackedLift } from "@/db/schema";
import { getEstimationLift, getLiftById } from "../lifts";

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

export async function toSavedLiftsDtoMapper(userLifts: UserLift[][]): Promise<SavedLiftsDto[]> {
  return Promise.all(
    userLifts.map(async userLiftArray => {
      const lift: LiftDto = (await getLiftById(userLiftArray[0].liftId))[0];

      const liftEstimation: EstimationLiftDto | undefined = await getEstimationLift(lift.id as string);

      const history: LiftHistoryDto[] = [];

      if (userLiftArray.length > 1) {
        const sortedUserLifts = userLiftArray.sort((a, b) => new Date(b.oneRepMaxDate!).getTime() - new Date(a.oneRepMaxDate!).getTime());

        for (let i = 1; i < sortedUserLifts.length; i++) {
          const currentLift = sortedUserLifts[i];
          if (currentLift.oneRepMax != null) {
            history.push({
              id: currentLift.id,
              date: currentLift.oneRepMaxDate,
              weight: currentLift.oneRepMax,
            } as unknown as LiftHistoryDto);
          }
        }
      }

      return {
        weight: userLiftArray.sort((a, b) => b.oneRepMax! - a.oneRepMax!)[0].oneRepMax,
        date: userLiftArray.sort((a, b) => b.oneRepMax! - a.oneRepMax!)[0].oneRepMaxDate,
        lift: lift,
        history: history,
        liftForEstimation: liftEstimation !== undefined ? liftEstimation : undefined,
        isBenchmark: true,
      } as SavedLiftsDto;
    })
  );
}

export async function toCompetitionCategoryDetailsMapper(competitionCategoryDetails: CompetitionCategoryDetails[]): Promise<CompetitionCategoryDetailsDto[]> {
  return competitionCategoryDetails.map(competitionCategoryDetails => {
    return {
      name: competitionCategoryDetails.name,
      total: competitionCategoryDetails.total,
      minBirthYear: competitionCategoryDetails.minBirthYear,
      maxBirthYear: competitionCategoryDetails.maxBirthYear,
      minWeight: competitionCategoryDetails.minWeight,
      maxWeight: competitionCategoryDetails.maxWeight,
      division: competitionCategoryDetails.division,
    } as CompetitionCategoryDetailsDto;
  });
}

export async function toSavedUserTrackedLiftsDtoMapper(userLifts: UserTrackedLift[][]): Promise<SavedLiftsDto[]> {
  return Promise.all(
    userLifts.map(async userLiftArray => {
      const lift: LiftDto = (await getLiftById(userLiftArray[0].liftId))[0];

      const history: LiftHistoryDto[] = [];

      if (userLiftArray.length > 1) {
        const sortedUserLifts = userLiftArray.sort((a, b) => new Date(b.oneRepMaxDate!).getTime() - new Date(a.oneRepMaxDate!).getTime());

        for (let i = 1; i < sortedUserLifts.length; i++) {
          const currentLift = sortedUserLifts[i];
          if (currentLift.oneRepMax != null) {
            history.push({
              id: currentLift.id,
              date: currentLift.oneRepMaxDate,
              weight: currentLift.oneRepMax,
            } as unknown as LiftHistoryDto);
          }
        }
      }

      return {
        weight: userLiftArray.sort((a, b) => b.oneRepMax! - a.oneRepMax!)[0].oneRepMax,
        date: userLiftArray.sort((a, b) => b.oneRepMax! - a.oneRepMax!)[0].oneRepMaxDate,
        lift: lift,
        history: history,
        isBenchmark: false,
      } as UserTrackedLiftDto;
    })
  );
}
