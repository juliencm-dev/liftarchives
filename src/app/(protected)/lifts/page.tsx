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
    <div className='grid place-items-center h-screen pt-8'>
      <div className='flex flex-col items-center gap-8'>
        <p className='text-6xl font-bold text-emerald-500'>Lifts</p>
        <div className='container flex flex-col items-center justify-center gap-2 pb-24'>
          {benchmarkLifts.map((lift) => (
            <div
              key={lift.id}
              className='flex justify-around items-center bg-emerald-500/20 border border-emerald-500 p-4 rounded-xl w-[320px]'>
              <div className='flex flex-col gap-2 w-[160px]'>
                <div className='text-xl font-semibold text-foreground'>
                  {lift.name}
                </div>
                <div className='text-xs text-emerald-500'>{lift.category}</div>
              </div>
              <div className='flex flex-col gap-2 text-right w-[120px]'>
                <p className='text-xl font-bold text-emerald-200'>250kg</p>
                <p className='text-xs text-muted-foreground'>
                  {new Date().toDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
