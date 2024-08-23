import SignInButton from "@/components/auth/signin-button";
import SignUpButton from "@/components/auth/signup-button";

export default function Home() {
  return (
    <main>
      <div className='container mx-auto'>
        <div className='grid place-items-center h-screen'>
          <div className='flex flex-col gap-4 items-center justify-center'>
            <h1 className='text-5xl font-bold text-violet-300'>
              Lift Archives{" "}
            </h1>
            <p className='text-xl'>Your personnal weightlifting journal</p>
          </div>
          <div className='flex flex-col gap-2 items-center justify-center w-[80%]'>
            <SignInButton />
            <SignUpButton />
            <div className='font-mono text-lg self-center px-3 py-0.5 rounded-[8px] border border-violet-300 text-violet-300 bg-neutral-300/40 mt-24'>
              Beta
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
