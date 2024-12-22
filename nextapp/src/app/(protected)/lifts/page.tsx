import { withAuth } from "@/components/auth/withAuth";
import SavedLiftList from "@/components/lifts/saved-lift-list";
import UserTrackedLiftList from "@/components/lifts/user-tracked-lift-list";
import {
  LiftDto,
  SavedLiftsDto,
  UserTrackedLiftDto,
} from "@/db/data-access/dto/lifts/types";
import { UserInformationDto } from "@/db/data-access/dto/users/types";
import {
  getBenchmarkLiftsByUserId,
  getNoneBenchmarkLifts,
  getUserTrackedLiftsByUserId,
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

  const userTrackedLifts: UserTrackedLiftDto[] =
    await getUserTrackedLiftsByUserId(userId);

  const lifts: LiftDto[] = await getNoneBenchmarkLifts();

  const userInformations: UserInformationDto = await getUserInformation(userId);

  return (
    <section className='container mx-auto pt-8 pb-24'>
      <div className='flex flex-col gap-6'>
        <h1 className='text-3xl font-bold text-violet-300'>Lifts</h1>
        <p className='text-sm text-muted-foreground'>
          This section will allow you to track your lifts progression and
          maximum weights.
        </p>

        <SavedLiftList
          lifts={benchmarkLifts}
          category='Main Lift'
          title='Benchmark Lifts'
          userId={userId}
          isOpen={true}
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
