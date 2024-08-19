import { BenchmarkLiftsDto } from "@/db/data-access/dto/lifts/types";
import { convertWeightToLbs } from "@/lib/utils";

interface LiftCardProps {
  lift: BenchmarkLiftsDto;
  weightPreference: string;
}

export default function LiftCard(props: LiftCardProps) {
  return (
    <div
      key={props.lift.lift.id}
      className='flex justify-around items-center bg-violet-300/30 border p-4 rounded-xl w-full cursor-pointer hover:bg-violet-300/40 transition-colors'>
      <div className='flex flex-col gap-2 w-[55%] text-left'>
        <div className='text-lg sm:text-2xl font-semibold text-foreground'>
          {props.lift.lift.name}
        </div>
        <p className='text-xs text-muted-foreground'>
          {props.lift.date === null
            ? "No data found"
            : new Date(props.lift.date).toDateString()}
        </p>
      </div>
      <div className='flex flex-col gap-2 text-right w-[calc(45%-1rem)]'>
        <p className='text-lg sm:text-2xl font-bold text-violet-200'>
          {props.lift.weight === null
            ? "--"
            : convertWeightToLbs(
                props.lift.weight,
                props.weightPreference
              )}{" "}
          {props.weightPreference}
        </p>
      </div>
    </div>
  );
}
