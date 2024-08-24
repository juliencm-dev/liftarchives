export type LiftDto = {
  id?: string;
  name: string;
  description: string;
  category: string;
};

export type SavedLiftsDto = {
  lift: LiftDto;
  liftForEstimation?: EstimationLiftDto;
  weight: number | null;
  date: string | null;
  history: LiftHistoryDto[];
};

export type LiftHistoryDto = {
  id: string;
  date: string;
  weight: number;
};

export type EstimationLiftDto = {
  weight: number | null;
  percentage: number;
  description: string;
};

export type CompetitionCategoryDetailsDto = {
  name: string;
  total: number | null;
  minBirthYear: number;
  maxBirthYear: number | null;
  minWeight: number;
  maxWeight: number | null;
  gender: string;
};
