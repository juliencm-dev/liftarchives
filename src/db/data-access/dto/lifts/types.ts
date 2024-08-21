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
};
