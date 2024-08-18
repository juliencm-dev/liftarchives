import { auth } from "@/auth";

export default async function Home() {
  const { getUser } = await auth();
  const user = getUser();
  if (!user) throw new Error("User not authenticated");

  return (
    <main className='px-2 py-12'>
      <div className='container mx-auto'>
        <div className='flex flex-col gap-6 '>
          <div className='flex flex-col items-center justify-center'>
            <h1 className='text-4xl font-bold'>LiftArchives</h1>
            <p className='text-xl'>Your personnal weightlifting journal</p>
          </div>
          <div className='flex flex-col items-center justify-center'>
            <p>Welcome {user.name}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
