import { auth } from "@/auth";
import { withAuth } from "@/components/auth/withAuth";
import LiftList from "@/components/lifts/lift-list";
import { BenchmarkLiftsDto } from "@/db/data-access/dto/lifts/types";
import { UserInformationDto } from "@/db/data-access/dto/users/types";
import { getBenchmarkLiftsByUserId } from "@/db/data-access/lifts";
import {
  getAuthenticatedUserId,
  getUserInformation,
} from "@/db/data-access/users";

async function LiftsPage() {
  const userId = await getAuthenticatedUserId();

  const benchmarkLifts: BenchmarkLiftsDto[] = await getBenchmarkLiftsByUserId(
    userId
  );
  const userInformations: UserInformationDto = await getUserInformation(userId);

  return (
    <section className='container mx-auto pt-8 pb-24'>
      <div className='flex flex-col gap-6'>
        <h1 className='text-3xl font-bold text-violet-300'>Benchmark Lifts</h1>
        <p className='text-sm text-muted-foreground '>
          Enter your one rep max for all the benchmark lifts. This will allow
          you to easily calculate your percentages when following along your
          weightlifting programs.
        </p>
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
      </div>
    </section>
  );
}

export default withAuth(LiftsPage);
