import { auth } from "@/auth";
import LiftList from "@/components/lifts/lift-list";
import { BenchmarkLiftsDto } from "@/db/data-access/dto/lifts/types";
import { UserInformationDto } from "@/db/data-access/dto/users/types";
import { getBenchmarkLiftsByUserId } from "@/db/data-access/lifts";
import { getUserInformation } from "@/db/data-access/users";

export default async function LiftsPage() {
  const { getUser } = await auth();
  const user = getUser();

  if (!user) return <div>User is not authenticated</div>;

  const benchmarkLifts: BenchmarkLiftsDto[] = await getBenchmarkLiftsByUserId(
    user.id
  );
  const userInformations: UserInformationDto = await getUserInformation(
    user.id
  );

  return (
    <section className='container mx-auto pt-8 pb-24'>
      <div className='flex flex-col gap-8'>
        <h1 className='text-4xl font-bold text-violet-300'>Benchmark Lifts</h1>
        <p className='text-base text-muted-foreground '>
          Enter your one rep max for all the benchmark lifts. This will allow
          you to easily calculate your percentages when following along your
          weightlifting programs.
        </p>
        <LiftList
          lifts={benchmarkLifts}
          category='Main Lift'
          title='Main Lifts'
          weightPreference={userInformations.liftsUnit}
        />
        <LiftList
          lifts={benchmarkLifts}
          category='Accessory Lift'
          title='Accessory Lifts'
          weightPreference={userInformations.liftsUnit}
        />
      </div>
    </section>
  );
}
