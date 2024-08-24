import { db } from "@/db/db";
import {
  competitionCategoriesDetails,
  CompetitionCategoryDetails,
  Lift,
  LiftEstimate,
  lifts,
  liftsEstimates,
} from "@/db/schemas/lifts";
import { UserLift, usersLifts } from "@/db/schemas/users";
import {
  CompetitionCategoryDetailsDto,
  EstimationLiftDto,
  LiftDto,
} from "@/db/data-access/dto/lifts/types";
import {
  toSavedLiftsDtoMapper,
  toCompetitionCategoryDetailsMapper,
  toLiftDtoMapper,
} from "@/db/data-access/dto-mapper/lifts";
import {
  getAuthenticatedUserId,
  getCurrentUser,
  getUserInformation,
} from "@/db/data-access/users";

import { asc, eq } from "drizzle-orm";
import { cache } from "react";
import { UserDto, UserInformationDto } from "./dto/users/types";

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

  return toSavedLiftsDtoMapper(userBenchmarkLiftsArray);
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

export const getEstimationLift = async (
  liftId: string
): Promise<EstimationLiftDto | undefined> => {
  const userId: string = await getAuthenticatedUserId();

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

  const liftEstimate: LiftEstimate = (
    await db.query.liftsEstimates.findMany({
      where: eq(liftsEstimates.liftId, liftId),
    })
  )[0];

  if (liftEstimate === undefined) {
    return undefined;
  }

  const liftEstimateLatestMax = liftsGroupedByLiftID[
    liftEstimate.liftForCalculationId
  ].sort(
    (a, b) =>
      new Date(b.oneRepMaxDate!).getTime() -
      new Date(a.oneRepMaxDate!).getTime()
  )[0].oneRepMax;

  const liftEstimationDto: EstimationLiftDto = {
    weight: liftEstimateLatestMax,
    percentage: liftEstimate.percentage,
    description: liftEstimate.description,
  };

  return liftEstimationDto;
};

export const addCompetitionCategoryDetails = async (
  competitionCategoryDetails: CompetitionCategoryDetailsDto
) => {
  try {
    await db
      .insert(competitionCategoriesDetails)
      .values(competitionCategoryDetails as CompetitionCategoryDetails);
  } catch (error) {
    throw new Error("Failed to add competition category details");
  }
};

export const getCompetitionCategoryDetails = cache(async () => {
  const currentUser: UserDto = await getCurrentUser();
  if (!currentUser) throw new Error("User not authenticated");

  const currentUserInformation: UserInformationDto = await getUserInformation(
    currentUser.id
  );

  const competitionCategoryDetails: CompetitionCategoryDetails[] =
    await db.query.competitionCategoriesDetails.findMany({
      where: eq(
        competitionCategoriesDetails.gender,
        currentUserInformation.gender
      ),
    });

  const filteredCompetitionCategoryDetailsByAge: CompetitionCategoryDetails[] =
    competitionCategoryDetails.filter(
      (competitionCategoryDetail: CompetitionCategoryDetails) => {
        if (
          competitionCategoryDetail.maxBirthYear === null &&
          currentUserInformation.birthYear <
            competitionCategoryDetail.minBirthYear
        )
          return true;

        if (
          currentUserInformation.birthYear <=
          competitionCategoryDetail.minBirthYear
        ) {
          if (
            currentUserInformation.birthYear >
            competitionCategoryDetail.maxBirthYear!
          ) {
            return true;
          }
        }
      }
    );

  const filteredCompetitionCategoryDetailsByWeight: CompetitionCategoryDetails[] =
    filteredCompetitionCategoryDetailsByAge.filter(
      (competitionCategoryDetail: CompetitionCategoryDetails) => {
        if (
          competitionCategoryDetail.maxWeight === null &&
          currentUserInformation.weight > competitionCategoryDetail.minWeight
        )
          return true;

        if (
          currentUserInformation.weight > competitionCategoryDetail.minWeight
        ) {
          if (
            currentUserInformation.weight <=
            competitionCategoryDetail.maxWeight!
          ) {
            return true;
          }
        }
      }
    );

  const filteredCompetitionCategoryDetailsByDivision: CompetitionCategoryDetails[] =
    filteredCompetitionCategoryDetailsByWeight.filter(
      (competitionCategoryDetail: CompetitionCategoryDetails) => {
        if (
          competitionCategoryDetail.division === currentUserInformation.division
        ) {
          return true;
        }
      }
    );

  return toCompetitionCategoryDetailsMapper(
    filteredCompetitionCategoryDetailsByDivision
  );
});

export const getDefaultLiftId = cache(async () => {
  const currentUser: UserDto = await getCurrentUser();
  if (!currentUser) throw new Error("User not authenticated");

  const defaultLiftId: Lift = (await db.query.lifts.findFirst({
    where: eq(lifts.name, "Clean"),
  })) as Lift;

  return defaultLiftId.id;
});
