import { UserDto, UserInformationDto } from "@/db/data-access/dto/users/types";
import { getCurrentUser, getUserInformation } from "@/db/data-access/users";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import SignOutButton from "@/components/auth/signout-button";
import UnitRadioGroup from "@/components/account/unit-radio-group";
import { Label } from "@/components/ui/label";
import {
  ChevronRight,
  CircleHelp,
  Database,
  LockKeyhole,
  Mail,
  ReceiptText,
  ShieldCheck,
} from "lucide-react";

export default async function AccountPage() {
  const currentUser: UserDto = await getCurrentUser();

  if (!currentUser) return <div>User is not authenticated</div>;

  const userInformations: UserInformationDto = await getUserInformation(
    currentUser.id
  );

  return (
    <div className='container mx-auto pt-8 pb-24'>
      <div className='grid gap-8'>
        <div className='grid gap-4'>
          <h1 className='text-4xl font-bold text-violet-300'>Account</h1>
          <div className='flex gap-4 items-center '>
            <Avatar className='h-12 w-12'>
              <AvatarFallback>
                {currentUser.firstName[0]}
                {currentUser.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className='font-semibold'>
                {currentUser.firstName} {currentUser.lastName}
              </h2>
              <h3 className='text-sm text-muted-foreground'>
                Member since {new Date(currentUser.createdAt).toDateString()}
              </h3>
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <h2 className='text-lg font-bold'>General</h2>
          <div className='flex flex-col gap-3 bg-gradient-to-b from-neutral-800 p-4 rounded-xl w-full'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-6'>
                <Mail />
                <Label className='text-base text-muted-foreground'>Email</Label>
              </div>
              <ChevronRight />
            </div>
            <div className='w-full border-b border-muted ' />
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-6'>
                <Database />
                <Label className='text-base text-muted-foreground'>
                  Data & Privacy
                </Label>
              </div>
              <ChevronRight />
            </div>
            <div className='w-full border-b border-muted ' />
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-6'>
                <LockKeyhole />
                <Label className='text-base text-muted-foreground'>
                  Password
                </Label>
              </div>
              <ChevronRight />
            </div>
            <div className='w-full border-b border-muted ' />
            <SignOutButton />
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <h2 className='text-lg font-bold'>Weight Units</h2>
          <UnitRadioGroup
            value={userInformations.liftsUnit}
            labels={[
              ["lbs", "Pounds"],
              ["kg", "Kilograms"],
            ]}
          />
        </div>

        <div className='flex flex-col gap-2'>
          <h2 className='text-lg font-bold'>Policies</h2>
          <div className='flex flex-col gap-3 bg-gradient-to-b from-neutral-800 p-4 rounded-xl w-full'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-6 '>
                <ReceiptText />
                <Label className='text-base text-muted-foreground'>
                  Terms of Service
                </Label>
              </div>
              <ChevronRight />
            </div>
            <div className='w-full border-b border-muted ' />
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-6'>
                <ShieldCheck />
                <Label className='text-base text-muted-foreground'>
                  Privacy Policy
                </Label>
              </div>
              <ChevronRight />
            </div>
            <div className='w-full border-b border-muted ' />
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-6'>
                <CircleHelp />
                <Label className='text-base text-muted-foreground'>About</Label>
              </div>
              <ChevronRight />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
