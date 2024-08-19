import { BenchmarkLiftsDto, LiftDto } from "@/db/data-access/dto/lifts/types";

interface LiftCardProps {
  lift: BenchmarkLiftsDto;
  weightPreference: string;
}

export default function LiftCard(props: LiftCardProps) {
  return (
    <div key={props.lift.lift.id} className="flex justify-around items-center bg-violet-300/20 border border-violet-300 p-4 rounded-xl w-full cursor-pointer hover:bg-violet-300/30">
      <div className="flex flex-col gap-2 w-[60%]">
        <div className="text-2xl font-semibold text-foreground">{props.lift.lift.name}</div>
        <p className="text-xs text-muted-foreground">{props.lift.date === null ? "No data found" : new Date(props.lift.date).toDateString()}</p>
      </div>
      <div className="flex flex-col gap-2 text-right w-[38%]">
        <p className="text-2xl font-bold text-violet-200">
          {props.lift.weight === null ? "--" : convertWeightToLbs(props.lift.weight, props.weightPreference)} {props.weightPreference}
        </p>
      </div>
    </div>
  );
}

const convertWeightToLbs = (weight: number, weightPreference: string): string => {
  if (weightPreference === "lbs") {
    return (weight * 2.20462).toFixed(2);
  }
  return weight.toFixed(2);
};
