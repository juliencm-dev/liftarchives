import { auth } from "@/auth";
import { UserDto } from "@/db/data-access/dto/users/types";
import { getCurrentUser } from "@/db/data-access/users";

export default async function DashboardPage() {
  const currentUser: UserDto = await getCurrentUser();

  if (!currentUser) return <div>User is not authenticated</div>;

  return (
    <div className='container mx-auto pt-8 pb-24'>
      <div className='flex flex-col gap-8'>
        <div className='text-4xl font-bold text-violet-300'>Dashboard</div>
        <div className='text-base text-muted-foreground'>
          Welcome {currentUser.firstName} {currentUser.lastName}
        </div>
      </div>
    </div>
  );
}
