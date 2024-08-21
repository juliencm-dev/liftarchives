import LiftCalculator from "@/components/dashboard/lift-calculator";
import PerformanceChart from "@/components/dashboard/performance-chart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BenchmarkLiftsDto } from "@/db/data-access/dto/lifts/types";
import { UserDto, UserInformationDto } from "@/db/data-access/dto/users/types";
import { getBenchmarkLiftsByUserId } from "@/db/data-access/lifts";
import { getCurrentUser, getUserInformation } from "@/db/data-access/users";
import { ArrowBigRight, CircleAlert, TriangleAlert } from "lucide-react";

export default async function DashboardPage() {
  const data = [
    {
      date: "2024-01-01",
      potential: 100,
      current: 70,
    },
    {
      date: "2024-03-02",
      potential: 105,
      current: 75,
    },
    {
      date: "2024-04-03",
      potential: 110,
      current: 97.5,
    },
    {
      date: "2024-05-04",
      potential: 115,
      current: 100,
    },
  ];

  const currentUser: UserDto = await getCurrentUser();
  if (!currentUser) return <div>User is not authenticated</div>;

  const benchmarkLifts: BenchmarkLiftsDto[] = await getBenchmarkLiftsByUserId(
    currentUser.id
  );
  const userInformations: UserInformationDto = await getUserInformation(
    currentUser.id
  );

  return (
    <div className='container mx-auto pt-8 pb-24'>
      <div className='flex flex-col gap-6'>
        <h1 className='text-4xl font-bold text-violet-300'>Dashboard</h1>
        <p className='text-base text-muted-foreground'>
          Welcome {currentUser.firstName} {currentUser.lastName}
        </p>

        {/* PROGRAMMING */}

        <div className='flex flex-col gap-4'>
          <Label className='text-lg font-bold'>Programming</Label>
          <div className='bg-gradient-to-b from-neutral-800 rounded-xl p-4'>
            <div className='flex gap-4 items-center'>
              <TriangleAlert className='text-yellow-300/80' />
              <p className='text-sm text-muted-foreground'>
                No programing found for today.
              </p>
            </div>
          </div>
        </div>

        <LiftCalculator
          lifts={benchmarkLifts}
          userInformations={userInformations}
        />

        {/* PERFORMANCE ANALYZER */}

        <div className='flex flex-col gap-4'>
          <Label className='text-lg font-bold'>Performance Analyzer</Label>
          <div className='flex flex-col gap-4 bg-gradient-to-b from-neutral-800 rounded-xl p-4'>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder='Select a lift' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {benchmarkLifts
                    .filter((lift) => lift.lift.category === "Main Lift")
                    .map((lift, index) => (
                      <SelectItem
                        value={lift.lift.id as string}
                        key={index}>
                        {lift.lift.name}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className='text-sm text-muted-foreground'>
              All lifts potential estimates are based on the weights entered as
              max in your benchmark lifts.
            </div>
            <div className='flex gap-4 items-center justify-between h-[150px]'>
              <div className='flex flex-col gap-2 w-[60%] bg-neutral-700/50 p-2 rounded-xl h-full'>
                <PerformanceChart data={data} />
              </div>
              <div className='flex flex-col w-[40%] justify-around bg-neutral-700/50 p-2 rounded-xl h-full'>
                <div>
                  <h4 className='text-base font-semibold'>Current Max: </h4>
                  <div className='flex gap-2 items-center justify-between text-red-400 font-bold'>
                    <p className='text-2xl'>
                      97.5 {userInformations.liftsUnit}
                    </p>
                    <CircleAlert />
                  </div>
                </div>
                <div>
                  <h4 className='text-base font-semibold'>Potential Max :</h4>
                  <span className='text-2xl text-violet-300 font-bold'>
                    108 {userInformations.liftsUnit}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COMPETITION DETAILS */}

        <div className='flex flex-col gap-4'>
          <Label className='text-lg font-bold'>Competition Details</Label>
          <div className='flex flex-col gap-4 bg-gradient-to-b from-neutral-800 rounded-xl p-4'>
            <h3 className='text-base font-semibold'>
              IWF Men Master (35) -81kg
            </h3>
            <p className='text-sm text-muted-foreground'>
              This category is selected based on your date of birth and current
              weight.
            </p>
            <div className='flex gap-4 items-center justify-between h-[150px]'>
              <div className='flex flex-col gap-2 w-[60%] bg-neutral-700/50 p-2 rounded-xl h-full'>
                <PerformanceChart data={data} />
              </div>
              <div className='flex flex-col w-[40%] justify-around bg-neutral-700/50 p-2 rounded-xl h-full'>
                <div>
                  <h4 className='text-base font-semibold'>Current Total: </h4>
                  <div className='flex gap-2 items-center justify-between text-red-400 font-bold'>
                    <p className='text-2xl'>
                      162.5 {userInformations.liftsUnit}
                    </p>
                    <CircleAlert />
                  </div>
                </div>
                <div>
                  <h4 className='text-base font-semibold'>Required Total :</h4>
                  <span className='text-2xl text-violet-300 font-bold'>
                    208 {userInformations.liftsUnit}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
