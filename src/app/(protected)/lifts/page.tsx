import { withAuth } from "@/components/auth/withAuth";
import SavedLiftList from "@/components/lifts/saved-lift-list";
import UserTrackedLiftList from "@/components/lifts/user-tracked-lift-list";
import { LiftDto, SavedLiftsDto } from "@/db/data-access/dto/lifts/types";
import { UserInformationDto } from "@/db/data-access/dto/users/types";
import {
  getBenchmarkLiftsByUserId,
  getNoneBenchmarkLifts,
} from "@/db/data-access/lifts";
import {
  getAuthenticatedUserId,
  getUserInformation,
} from "@/db/data-access/users";

async function LiftsPage() {
  const userId = await getAuthenticatedUserId();

  const benchmarkLifts: SavedLiftsDto[] = await getBenchmarkLiftsByUserId(
    userId
  );

  const userTrackedLifts: SavedLiftsDto[] = await getBenchmarkLiftsByUserId(
    userId
  );

  const lifts: LiftDto[] = await getNoneBenchmarkLifts();

  const userInformations: UserInformationDto = await getUserInformation(userId);

  return (
    <section className='container mx-auto pt-8 pb-24'>
      <div className='flex flex-col gap-6'>
        <h1 className='text-3xl font-bold text-violet-300'>Lifts</h1>
        <div className='flex flex-col gap-2'>
          <h2 className='text-lg font-bold'>Benchmark Lifts</h2>
          <p className='text-xs text-muted-foreground '>
            Filling out this section will allow you to easily calculate your
            percentages when following along your weightlifting programs.
          </p>
        </div>
        <SavedLiftList
          lifts={benchmarkLifts}
          category='Main Lift'
          title='Main Lifts'
          userId={userId}
          isOpen={true}
          weightPreference={userInformations.liftsUnit}
        />
        <SavedLiftList
          lifts={benchmarkLifts}
          category='Accessory Lift'
          title='Accessory Lifts'
          userId={userId}
          weightPreference={userInformations.liftsUnit}
        />
        <UserTrackedLiftList
          userLifts={userTrackedLifts}
          lifts={lifts}
          title='Lifts'
          userId={userId}
          weightPreference={userInformations.liftsUnit}
        />
      </div>
    </section>
  );
}

export default withAuth(LiftsPage);
