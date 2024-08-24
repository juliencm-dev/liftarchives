import { withAuth } from "@/components/auth/withAuth";
import LiftList from "@/components/lifts/lift-list";
import { SavedLiftsDto } from "@/db/data-access/dto/lifts/types";
import { UserInformationDto } from "@/db/data-access/dto/users/types";
import { getBenchmarkLiftsByUserId } from "@/db/data-access/lifts";
import {
  getAuthenticatedUserId,
  getUserInformation,
} from "@/db/data-access/users";

async function LiftsPage() {
  const userId = await getAuthenticatedUserId();

  const benchmarkLifts: SavedLiftsDto[] = await getBenchmarkLiftsByUserId(
    userId
  );
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
        <LiftList
          lifts={benchmarkLifts}
          category='Main Lift'
          title='Main Lifts'
          userId={userId}
          isOpen={true}
          weightPreference={userInformations.liftsUnit}
        />
        <LiftList
          lifts={benchmarkLifts}
          category='Accessory Lift'
          title='Accessory Lifts'
          userId={userId}
          weightPreference={userInformations.liftsUnit}
        />
        <div className='flex flex-col gap-2'>
          <h2 className='text-lg font-bold'>Additionnal Lifts</h2>
          <p className='text-xs text-muted-foreground '>
            Here you can track additional lifts that may be useful for your
            personnal progression and goals.
          </p>
        </div>
        <LiftList
          lifts={benchmarkLifts}
          category='Tracked Lift'
          title='Tracked Lifts'
          userId={userId}
          weightPreference={userInformations.liftsUnit}
        />
      </div>
    </section>
  );
}

export default withAuth(LiftsPage);
