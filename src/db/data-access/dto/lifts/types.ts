export type LiftDto = {
  id?: string;
  name: string;
  description: string;
  category: string;
};

export type BenchmarkLiftsDto = {
  lift: LiftDto;
  liftForEstimation?: EstimationLiftDto;
  weight: number | null;
  date: string | null;
  history: BenchmarkHistoryDto[];
};

export type BenchmarkHistoryDto = {
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
