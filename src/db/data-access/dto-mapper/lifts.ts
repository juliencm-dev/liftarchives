import { Lift } from "@/db/schemas/lifts";
import { LiftDto } from "@/db/data-access/dto/lifts/types";

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
