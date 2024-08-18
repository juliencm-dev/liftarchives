import { SignInForm } from "@/components/auth/signin-form";

export default function Home() {
  return (
    <main>
      <div className='grid place-items-center h-screen'>
        <div className='flex flex-col items-center gap-12'>
          <div className='flex flex-col items-center justify-center'>
            <h1 className='text-4xl font-bold'>Lift Archives</h1>
            <p className='text-xl'>Your personnal weightlifting journal</p>
          </div>
          <SignInForm />
        </div>
      </div>
    </main>
  );
}
