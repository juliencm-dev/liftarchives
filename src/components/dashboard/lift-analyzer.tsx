"use client";

import {
  BenchmarkLiftsDto,
  EstimationLiftDto,
} from "@/db/data-access/dto/lifts/types";
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
import { ArrowBigRight, CircleAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { convertWeightToLbs } from "@/lib/utils";
import PerformanceChart from "./performance-chart";

export default function LiftAnalyzer({
  lifts,
  userInformations,
}: {
  lifts: BenchmarkLiftsDto[];
  userInformations: UserInformationDto;
}) {
  const liftDetailsRecord = useMemo(
    () => buildLiftDetailsRecord(lifts),
    [lifts]
  );

  const percentageValue = [50, 70, 60, 90, 70, 95];
  const [selectedLift, setSelectedLift] = useState<string>(
    lifts[0].lift.id as string
  );
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

  const data = [
    {
      date: "2024-01-01",
      potential: 100,
      current: 70,
    },
    {
      date: "2024-03-02",
      potential: 105,
      current: 75,
    },
    {
      date: "2024-04-03",
      potential: 110,
      current: 97.5,
    },
    {
      date: "2024-05-04",
      potential: 115,
      current: 100,
    },
  ];

  return (
    <>
      <div className='flex flex-col gap-4'>
        <Label className='text-lg font-bold'> Lift Analyzer</Label>
        <div className='flex flex-col gap-4 bg-gradient-to-b from-neutral-800 rounded-xl p-4'>
          <Select
            value={selectedLift}
            onValueChange={(value) => setSelectedLift(value)}>
            <SelectTrigger>
              <SelectValue />
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
                <p className='text-muted-foreground'>{value}%</p>
                <ArrowBigRight className='text-violet-300 h-4 w-4' />
                <p className='text-lg font-bold'>
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

          <div className='text-sm text-muted-foreground'>
            All lifts potential estimates are based on the weights entered as
            max in your benchmark lifts.
          </div>
          <div className='flex gap-4 items-center justify-between h-[150px]'>
            <div className='flex flex-col gap-2 w-[60%] bg-neutral-700/50 p-2 rounded-xl h-full'>
              <PerformanceChart data={data} />
            </div>
            <div className='flex flex-col w-[40%] justify-around bg-neutral-700/50 p-2 rounded-xl h-full'>
              <div>
                <h4 className='text-base font-semibold'>Current Max: </h4>
                <div className='flex gap-2 items-center justify-between text-red-400 font-bold'>
                  <p className='text-xl'>
                    {Number(
                      convertWeightToLbs(
                        Number(liftDetailsRecord[selectedLift][0].currentMax),
                        userInformations.liftsUnit
                      )
                    ).toFixed(2)}{" "}
                    {userInformations.liftsUnit}
                  </p>
                  <CircleAlert />
                </div>
              </div>
              <div>
                <h4 className='text-base font-semibold'>Potential Max :</h4>
                <span className='text-xl text-violet-300 font-bold'>
                  {Number(
                    convertWeightToLbs(
                      Number(liftDetailsRecord[selectedLift][0].potentialMax),
                      userInformations.liftsUnit
                    )
                  ).toFixed(2)}{" "}
                  {userInformations.liftsUnit}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

type LiftDetailsRecord = {
  currentMax: number;
  potentialMax: number;
};

const buildLiftDetailsRecord = (
  lifts: BenchmarkLiftsDto[]
): Record<string, LiftDetailsRecord[]> => {
  const liftRecord: Record<string, LiftDetailsRecord[]> = {};

  lifts.forEach((lift: BenchmarkLiftsDto) => {
    if (lift.lift.category === "Main Lift") {
      if (!liftRecord[lift.lift.id!]) {
        liftRecord[lift.lift.id!] = [];
      }

      liftRecord[lift.lift.id!].push({
        currentMax: lift.weight ?? 0,
        potentialMax: estimateLiftPotential(lift),
      });
    }
  });

  return liftRecord;
};

const estimateLiftPotential = (lift: BenchmarkLiftsDto): number => {
  const liftForEstimation: EstimationLiftDto = lift.liftForEstimation!;

  const calculatedWeight =
    liftForEstimation.weight! * liftForEstimation.percentage;

  return calculatedWeight;
};
