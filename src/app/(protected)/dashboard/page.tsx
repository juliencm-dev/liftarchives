import { auth } from "@/auth";
import SignOutButton from "@/components/auth/signout-button";
import { UserInformationDto } from "@/db/data-access/dto/users/types";
import { getUserInformation } from "@/db/data-access/users";

export default async function DashboardPage() {
  const { getUser } = await auth();
  const user = getUser();

  if (!user) return <div>User is not authenticated</div>;

  const userInformations: UserInformationDto = await getUserInformation(
    user.id
  );

  return (
    <div className='container mx-auto pt-8 pb-24'>
      <div className='flex flex-col gap-8'>
        <div className='text-4xl font-bold text-violet-300'>Dashboard</div>
        <div className='text-base text-muted-foreground'>
          Welcome {user.name}
        </div>
        <div className='flex gap-4'>
          <div className='flex flex-col gap-2 border border-muted rounded-xl p-4 bg-neutral-800 min-w-20 items-center justify-center'>
            <div className='text-xs text-muted-foreground'>Age</div>
            <div className='text-xl font-semibold text-foreground'>
              {userInformations.age}
            </div>
          </div>
          <div className='flex flex-col gap-2 border border-muted rounded-xl p-4 bg-neutral-800 min-w-20 items-center justify-center'>
            <div className='text-xs text-muted-foreground'>Weight</div>
            <div className='text-xl font-semibold text-foreground'>
              {userInformations.weight} {userInformations.liftsUnit}
            </div>
          </div>
        </div>
        <SignOutButton />
      </div>
    </div>
  );
}
