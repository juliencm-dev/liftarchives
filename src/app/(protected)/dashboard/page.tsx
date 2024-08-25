import { withAuth } from "@/components/auth/withAuth";
import CompetitionDetails from "@/components/dashboard/competition-details";
import LiftAnalyzer from "@/components/dashboard/lift-analyzer";

import { Label } from "@/components/ui/label";

import {
  SavedLiftsDto,
  CompetitionCategoryDetailsDto,
} from "@/db/data-access/dto/lifts/types";

import { UserDto, UserInformationDto } from "@/db/data-access/dto/users/types";
import {
  getBenchmarkLiftsByUserId,
  getCompetitionCategoryDetails,
  getDefaultLiftId,
} from "@/db/data-access/lifts";
import { getCurrentUser, getUserInformation } from "@/db/data-access/users";
import { TriangleAlert } from "lucide-react";

async function DashboardPage() {
  const currentUser: UserDto = await getCurrentUser();

  const defaultLiftId = await getDefaultLiftId();

  const competitionCategoryDetails: CompetitionCategoryDetailsDto[] =
    await getCompetitionCategoryDetails();

  const benchmarkLifts: SavedLiftsDto[] = await getBenchmarkLiftsByUserId(
    currentUser.id
  );
  const userInformations: UserInformationDto = await getUserInformation(
    currentUser.id
  );

  const currentTotal = calculateCurrentTotal(benchmarkLifts);

  return (
    <div className='container mx-auto pt-8 pb-24'>
      <div className='flex flex-col gap-6'>
        <h1 className='text-3xl font-bold text-violet-300'>Dashboard</h1>
        <div className='flex flex-col gap-2'>
          <p className='text-base text-muted-foreground'>
            Hello {currentUser.firstName} 👋
          </p>
          <p className='text-sm text-muted-foreground'>
            Welcome to your dashboard. Here you can view your lifts progression,
            competition details and programming information.
          </p>
        </div>

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

        <LiftAnalyzer
          lifts={benchmarkLifts}
          userInformations={userInformations}
          defaultLiftId={defaultLiftId}
        />

        <CompetitionDetails
          currentTotal={currentTotal}
          competitionCategoryDetails={competitionCategoryDetails[0]}
          userInformations={userInformations}
        />
      </div>
    </div>
  );
}

export default withAuth(DashboardPage);

const calculateCurrentTotal = (lifts: SavedLiftsDto[]) => {
  const currentTotal = lifts
    .filter((lift) => {
      return lift.lift.name === "Clean & Jerk" || lift.lift.name === "Snatch";
    })
    .reduce((acc, lift) => {
      if (lift.weight !== null) {
        return acc + lift.weight;
      }
      return acc;
    }, 0);

  return currentTotal;
};
