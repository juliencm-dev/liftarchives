import { auth } from "@/auth";
import { Construction } from "lucide-react";

export default async function AccountPage() {
  const { getUser } = await auth();
  const user = getUser();

  if (!user) return <div>User is not authenticated</div>;

  return (
    <div className='grid place-items-center h-screen'>
      <div className='flex flex-col items-center gap-8'>
        <p className='text-6xl font-bold text-emerald-500'>Account</p>
        <div className='flex flex-col items-center justify-center'>
          <Construction size={48} />
          <p className='text-xl'>Under Construction</p>
        </div>
      </div>
    </div>
  );
}
