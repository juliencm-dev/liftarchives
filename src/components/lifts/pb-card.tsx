import { BenchmarkLiftsDto } from "@/db/data-access/dto/lifts/types";
import { cn, convertWeightToLbs } from "@/lib/utils";

export default function PBCard({
  lift,
  weightPreference,
}: {
  lift: BenchmarkLiftsDto;
  weightPreference: string;
}) {
  return (
    <div className='flex justify-between bg-neutral-900 p-4 rounded-xl w-full mt-4 shadow-sm'>
      <div className='flex flex-col gap-4 text-left bg-neutral-800/50 p-8 w-[70%] rounded-xl shadow-sm'>
        <div className='flex flex-col gap-2'>
          <p className='text-xl font-semibold text-foreground'>
            Personnal Best
          </p>
          <p className='text-sm text-muted-foreground'>
            {lift.date === null
              ? "No data found"
              : "Achieved on " + new Date(lift.date).toDateString()}
          </p>
        </div>
        <p
          className={cn(
            lift.weight === null ? "text-lg sm:text-xl" : "text-2xl",
            "font-semibold text-violet-300"
          )}>
          {lift.weight === null
            ? "Add a personnal best"
            : convertWeightToLbs(lift.weight, weightPreference)}{" "}
          {lift.weight !== null && weightPreference}
        </p>
      </div>
      <div className='flex justify-center items-center gap-2 bg-neutral-800/50 p-8 rounded-xl w-[calc(30%-1rem)] cursor-pointer hover:bg-violet-300/30 hover:text-foreground transition-colors shadow-sm'>
        <div className='text-6xl'>+</div>
      </div>
    </div>
  );
}
