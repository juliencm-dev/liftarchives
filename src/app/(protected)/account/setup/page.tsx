"use client";

import {
  MINIMUM_MASTER_BIRTH_YEAR,
  MINIMUM_SENIOR_BIRTH_YEAR,
} from "@/lib/constant";

import { Button } from "@/components/ui/button";
import { UserInformationDto } from "@/db/data-access/dto/users/types";
import { useState } from "react";
import { PulseLoader } from "react-spinners";
import { redirect } from "next/navigation";
import { userAccountSetupAction } from "@/actions/account/user-account-setup";
import { ServerResponseMessage } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { convertWeightToKg } from "@/lib/utils";

export default function AccountSetupPage() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [weightUnit, setWeightUnit] = useState<string>("kg");
  const [division, setDivision] = useState<"senior" | "master" | "junior">(
    "master"
  );

  const { toast } = useToast();

  const handleAccountSetup = async (formData: FormData) => {
    setIsPending(true);

    const newUserAccountInformations: UserInformationDto = {
      birthYear: Number(formData.get("birthYear") as string),
      weight: Number(
        convertWeightToKg(Number(formData.get("weight") as string), weightUnit)
      ),
      liftsUnit: formData.get("liftsUnit") as string,
      gender: formData.get("gender") as string,
      division: division,
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

  const handleDivision = (value: string) => {
    const birthYear = Number(value);

    if (birthYear <= MINIMUM_MASTER_BIRTH_YEAR) {
      setDivision("master");
    } else if (
      birthYear <= MINIMUM_SENIOR_BIRTH_YEAR &&
      birthYear > MINIMUM_MASTER_BIRTH_YEAR
    ) {
      setDivision("senior");
    } else {
      setDivision("junior");
    }
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

        <form
          className='flex flex-col gap-4'
          action={handleAccountSetup}>
          <div className='flex flex-col gap-2'>
            <h2 className='text-lg font-bold'>Gender</h2>
            <RadioGroup
              required
              name='gender'
              defaultValue='female'
              className='flex flex-col gap-6 bg-gradient-to-b from-neutral-800 p-4 rounded-xl w-full'>
              <div className='flex items-center justify-between'>
                <Label className='text-base text-foreground'>Female</Label>
                <RadioGroupItem value={"female"} />
              </div>
              <div className='flex items-center justify-between'>
                <Label className='text-base text-foreground'>Male</Label>
                <RadioGroupItem value={"male"} />
              </div>
            </RadioGroup>
          </div>
          <div className='flex flex-col gap-2'>
            <h2 className='text-lg font-bold'>Birth Year</h2>
            <div className='flex flex-col gap-6 bg-gradient-to-b from-neutral-800 p-4 rounded-xl w-full'>
              <p className='text-xs text-muted-foreground'>
                Your birth year is used to determine your current IWF age group.
              </p>
              <Select
                required
                name='birthYear'
                defaultValue={"1989"}
                onValueChange={handleDivision}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Array.from({ length: 2009 - 1929 + 1 }, (_, i) => (
                      <SelectItem
                        value={(2009 - i).toString()}
                        key={2009 - i}>
                        {2009 - i}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <p className='text-xs text-muted-foreground'>{`Your current IWF age division is ${division[0].toUpperCase()}${division.slice(
                1
              )}`}</p>
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <h2 className='text-lg font-bold'>Weight</h2>
            <div className='flex flex-col gap-4 bg-gradient-to-b from-neutral-800 p-4 rounded-xl w-full'>
              <p className='text-xs text-muted-foreground'>
                {weightUnit === "lbs"
                  ? "Enter your weight is in pounds"
                  : "Enter your weight is in kilograms"}
              </p>
              <Input
                required
                name='weight'
                type='number'
              />
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <h2 className='text-lg font-bold'>Weight Units</h2>
            <RadioGroup
              required
              name='liftsUnit'
              defaultValue='kg'
              onValueChange={(value) => setWeightUnit(value)}
              className='flex flex-col gap-6 bg-gradient-to-b from-neutral-800 p-4 rounded-xl w-full'>
              <div className='flex items-center justify-between'>
                <Label className='text-base text-foreground'>Pounds</Label>
                <RadioGroupItem value={"lbs"} />
              </div>
              <div className='flex items-center justify-between'>
                <Label className='text-base text-foreground'>Kilograms</Label>
                <RadioGroupItem value={"kg"} />
              </div>
            </RadioGroup>
          </div>

          <Input
            type='hidden'
            name='division'
            value={division}
          />

          <Button
            type='submit'
            className='w-full rounded-xl mt-6'
            disabled={isPending}>
            {isPending ? <PulseLoader size={4} /> : "Setup Account"}
          </Button>
        </form>
      </div>
    </div>
  );
}
