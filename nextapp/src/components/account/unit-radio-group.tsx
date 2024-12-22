"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { updateUserLiftUnitAction } from "@/actions/account/update-user-lift-unit";

interface UnitRadioGroupProps {
  value: string;
  labels: string[][];
}

export default function UnitRadioGroup(props: UnitRadioGroupProps) {
  const [value, setValue] = useState<string>(props.value);

  const handleUpdateUserInformation = async (value: string) => {
    setValue(value);
    updateUserLiftUnitAction({
      liftsUnit: value as "lbs" | "kg",
    });
  };

  return (
    <RadioGroup
      defaultValue={value}
      onValueChange={(value) => handleUpdateUserInformation(value)}
      className='flex flex-col gap-6 bg-gradient-to-b from-neutral-800 p-4 rounded-xl w-full'>
      <div className='flex items-center justify-between'>
        <Label className='text-base text-foreground'>
          {props.labels[0][1]}
        </Label>
        <RadioGroupItem value={props.labels[0][0]} />
      </div>
      <div className='flex items-center justify-between'>
        <Label className='text-base text-foreground'>
          {props.labels[1][1]}
        </Label>
        <RadioGroupItem value={props.labels[1][0]} />
      </div>
    </RadioGroup>
  );
}
