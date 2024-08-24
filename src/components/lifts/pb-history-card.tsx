import { BenchmarkHistoryDto } from "@/db/data-access/dto/lifts/types";
import { convertWeightToLbs } from "@/lib/utils";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { TriangleAlert } from "lucide-react";

export default function PBHistoryCard({
  userLifts,
  weightPreference,
}: {
  userLifts: BenchmarkHistoryDto[];
  weightPreference: string;
}) {
  return (
    <div className='flex justify-between bg-neutral-900 p-4 rounded-xl w-full mt-2 shadow-sm'>
      <div className='flex flex-col text-left bg-neutral-800/50 p-8 rounded-xl shadow-sm w-full'>
        <div className='flex flex-col gap-3'>
          <div className='flex flex-col gap-2'>
            <p className='text-xl font-semibold text-foreground'>
              Lift History
            </p>
            <p className='text-sm text-muted-foreground'>
              Recently recorded personal bests
            </p>
          </div>
          <div className='flex flex-col gap-2 mt-4 max-h-[125px]'>
            <ScrollArea className='overflow-y-auto'>
              {userLifts.length === 0 ? (
                <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                  <TriangleAlert className='text-yellow-300/80' /> No data found
                </div>
              ) : (
                userLifts
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .map((lift) => (
                    <div
                      key={lift.date}
                      className='flex justify-between items-center gap-2 w-full'>
                      <p className='text-xs text-muted-foreground'>
                        {new Date(lift.date).toDateString()}
                      </p>
                      <p className='text-base font-semibold text-foreground'>
                        {convertWeightToLbs(lift.weight, weightPreference)}{" "}
                        {weightPreference}
                      </p>
                    </div>
                  ))
              )}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
