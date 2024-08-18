import { auth } from "@/auth";
import { LiftDto } from "@/db/data-access/dto/lifts/types";
import { getBenchmarkLifts } from "@/db/data-access/lifts";
import { Construction } from "lucide-react";

export default async function LiftsPage() {
  const { getUser } = await auth();
  const user = getUser();

  const benchmarkLifts: LiftDto[] = await getBenchmarkLifts();

  if (!user) return <div>User is not authenticated</div>;

  return (
    <section className='container mx-auto pt-8'>
      <div className='flex flex-col items-center gap-8'>
        <p className='text-4xl font-bold text-violet-300'>Benchmark Lifts</p>
        <p className='text-base text-muted-foreground text-center'>
          Enter your one rep max for all the benchmark lifts. This will allow
          you to easily calculate your percentages when writing weightlifting
          programs.
        </p>
        <div className='container flex flex-col items-center justify-center gap-2 pb-24'>
          {benchmarkLifts.map((lift) => (
            <div
              key={lift.id}
              className='flex justify-around items-center bg-violet-300/20 border border-violet-300 p-4 rounded-xl w-full cursor-pointer hover:bg-violet-300/30'>
              <div className='flex flex-col gap-2 w-[60%]'>
                <div className='text-xl font-semibold text-foreground'>
                  {lift.name}
                </div>
                <div className='text-xs text-violet-300'>{lift.category}</div>
              </div>
              <div className='flex flex-col gap-2 text-right w-[38%]'>
                <p className='text-xl font-bold text-violet-200'>250kg</p>
                <p className='text-xs text-muted-foreground'>
                  {new Date().toDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
