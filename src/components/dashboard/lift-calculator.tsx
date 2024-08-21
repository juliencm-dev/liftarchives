"use client";

import { BenchmarkLiftsDto } from "@/db/data-access/dto/lifts/types";
import { UserInformationDto } from "@/db/data-access/dto/users/types";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { ArrowBigRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { convertWeightToLbs } from "@/lib/utils";

export default function LiftCalculator({
  lifts,
  userInformations,
}: {
  lifts: BenchmarkLiftsDto[];
  userInformations: UserInformationDto;
}) {
  const percentageValue = [50, 70, 60, 90, 70, 95];
  const [selectedLift, setSelectedLift] = useState<string>("");
  const [customValue, setCustomValue] = useState<number>(0);
  const [calculatedPercentage, setCalculatedPercentage] =
    useState<string>("0.00");

  const calculateCustomPercentage = () => {
    if (selectedLift === "") return;

    const calculatedPercentage = lifts
      .filter((lift) => lift.lift.id === selectedLift)
      .map(
        (lift) =>
          (Number(
            convertWeightToLbs(Number(lift.weight), userInformations.liftsUnit)
          ) *
            customValue) /
          100
      )[0]
      .toFixed(2);

    setCalculatedPercentage(calculatedPercentage);
  };

  return (
    <div className='flex flex-col gap-4'>
      <Label className='text-lg font-bold'> Lift Calculator</Label>
      <div className='flex flex-col gap-4 bg-gradient-to-b from-neutral-800 rounded-xl p-4'>
        <Select
          value={selectedLift}
          onValueChange={(value) => setSelectedLift(value)}>
          <SelectTrigger>
            <SelectValue placeholder='Select a lift' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {lifts
                .filter((lift) => lift.lift.category === "Main Lift")
                .map((lift, index) => (
                  <SelectItem
                    value={lift.lift.id as string}
                    key={index}>
                    {lift.lift.name}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className='grid grid-cols-2 gap-2 p-4 rounded-xl bg-neutral-700/50'>
          {percentageValue.map((value, index) => (
            <div
              className='flex gap-2 items-center'
              key={index}>
              <p>{value}%</p>
              <ArrowBigRight className='text-violet-300 h-4 w-4' />
              <p>
                {selectedLift === ""
                  ? "--"
                  : lifts
                      .filter((lift) => lift.lift.id === selectedLift)
                      .map(
                        (lift) =>
                          (Number(
                            convertWeightToLbs(
                              Number(lift.weight),
                              userInformations.liftsUnit
                            )
                          ) *
                            value) /
                          100
                      )[0]
                      .toFixed(2)}{" "}
                {userInformations.liftsUnit}
              </p>
            </div>
          ))}
        </div>
        <div className='flex gap-4 items-center justify-between'>
          <Input
            defaultValue={customValue}
            onChange={(e) => setCustomValue(Number(e.target.value))}
            type='number'
          />
          <p>%</p>
          <Button
            className='rounded-xl'
            onClick={calculateCustomPercentage}>
            Calculate
          </Button>
          <div className='rounded-xl px-3 py-2.5 bg-neutral-700/50 text-violet-300 font-semibold min-w-[28%] text-center'>
            {calculatedPercentage} {userInformations.liftsUnit}
          </div>
        </div>
      </div>
    </div>
  );
}
