"use client";

import { Button } from "@/components/ui/button";
import { UserInformationDto } from "@/db/data-access/dto/users/types";
import { useState } from "react";
import { PulseLoader } from "react-spinners";
import { redirect } from "next/navigation";
import { userAccountSetupAction } from "@/actions/account/user-account-setup";
import { ServerResponseMessage } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";

export default function AccountSetupPage() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const { toast } = useToast();

  const handleAccountSetup = async (formData: FormData) => {
    setIsPending(true);

    const newUserAccountInformations: UserInformationDto = {
      birthYear: Number(formData.get("birthYear") as string),
      weight: Number(formData.get("weight") as string),
      liftsUnit: formData.get("liftsUnit") as string,
      gender: formData.get("gender") as string,
      division: formData.get("division") as string,
    };

    await userAccountSetupAction({
      userInformations: newUserAccountInformations,
    }).then((response: ServerResponseMessage) => {
      if (response.status !== 500) {
        setIsPending(false);
        toast({
          title: "Success",
          description: response.message,
        });
        redirect("/dashboard");
      } else {
        setIsPending(false);
        toast({
          title: "Error",
          variant: "destructive",
          description: response.message,
        });
      }
    });
  };

  return (
    <div className='container mx-auto pt-8 pb-24'>
      <div className='grid gap-6'>
        <div className='grid gap-6'>
          <h1 className='text-4xl font-bold text-violet-300'>Account Setup</h1>
          <div className='flex gap-4 items-center'>
            <p className='text-sm text-muted-foreground'>
              This is a one time process to setup your account. You will be
              asked to enter some details to help us properly setup your
              account. These informations can be changed at any time by visiting
              your account page and updating the informations under the
              "Profile" section.
            </p>
          </div>
        </div>

        <form action={handleAccountSetup}>
          <Button
            type='submit'
            className='w-full'
            disabled={isPending}>
            {isPending ? <PulseLoader size={4} /> : "Sign Up"}
          </Button>
        </form>
      </div>
    </div>
  );
}
