import { BenchmarkHistoryDto } from "@/db/data-access/dto/lifts/types";
import { convertWeightToLbs } from "@/lib/utils";
import { TriangleAlert } from "lucide-react";

export default function PBHistoryCard({
  userLifts,
  weightPreference,
}: {
  userLifts: BenchmarkHistoryDto[] | null;
  weightPreference: string;
}) {
  const history = [
    {
      date: "2024-03-01",
      weight: 88,
    },
    {
      date: "2024-05-02",
      weight: 93.25,
    },
    {
      date: "2024-07-03",
      weight: 97.5,
    },
  ];

  return (
    <div className='flex justify-between bg-neutral-900 p-4 rounded-xl w-full mt-2 shadow-sm'>
      <div className='flex flex-col gap-6 text-left bg-neutral-800/50 p-8 rounded-xl shadow-sm w-full'>
        <div className='flex flex-col gap-2'>
          <p className='text-xl font-semibold text-foreground'>Lift History</p>
          <p className='text-sm'>Recently recorded personal bests</p>
          <tr className='border-b border-muted' />
          <div className='flex flex-col gap-2 mt-4'>
            {userLifts === null ? (
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
                    <p className='text-sm text-muted-foreground'>
                      {new Date(lift.date).toDateString()}
                    </p>
                    <p className='text-lg font-semibold text-foreground'>
                      {convertWeightToLbs(lift.weight, weightPreference)}{" "}
                      {weightPreference}
                    </p>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
