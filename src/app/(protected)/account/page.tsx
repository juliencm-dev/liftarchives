import { auth } from "@/auth";
import SignOutButton from "@/components/auth/signout-button";
import { UserDto, UserInformationDto } from "@/db/data-access/dto/users/types";
import { getCurrentUser, getUserInformation } from "@/db/data-access/users";
import { convertWeightToLbs } from "@/lib/utils";

export default async function AccountPage() {
  const currentUser: UserDto = await getCurrentUser();

  if (!currentUser) return <div>User is not authenticated</div>;

  const userInformations: UserInformationDto = await getUserInformation(
    currentUser.id
  );

  return (
    <div className='container mx-auto pt-8 pb-24'>
      <div className='grid gap-8'>
        <div className='grid gap-2'>
          <h1 className='text-4xl font-bold text-violet-300'>Account</h1>
          <p className='text-base text-muted-foreground'>
            On this page you can view your account information. You may also
            update your weight preferences as well as your password.
          </p>
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
              {Number(
                convertWeightToLbs(
                  userInformations.weight,
                  userInformations.liftsUnit
                )
              ).toFixed(1)}{" "}
              {userInformations.liftsUnit}
            </div>
          </div>
        </div>

        <div className='w-[150px]'>
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
