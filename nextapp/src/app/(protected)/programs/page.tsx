import { withAuth } from "@/components/auth/withAuth";
import { Construction } from "lucide-react";

async function ProgramsPage() {
  return (
    <div className='grid place-items-center h-screen'>
      <div className='flex flex-col items-center gap-8'>
        <p className='text-6xl font-bold text-violet-300'>Programs</p>
        <div className='flex flex-col items-center justify-center'>
          <Construction size={48} />
          <p className='text-xl'>Under Construction</p>
        </div>
      </div>
    </div>
  );
}

export default withAuth(ProgramsPage);
