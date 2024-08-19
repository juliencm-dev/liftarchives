export type LiftDto = {
  id?: string;
  name: string;
  description: string;
  category: string;
};

export type BenchmarkLiftsDto = {
  lift: LiftDto;
  weight: number | null;
  date: string | null;
};
