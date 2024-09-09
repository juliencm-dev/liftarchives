"use client";

import { SavedLiftsDto, EstimationLiftDto } from "@/db/data-access/dto/lifts/types";
import { UserInformationDto } from "@/db/data-access/dto/users/types";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import { ArrowBigRight, CircleAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { use, useEffect, useMemo, useState } from "react";
import { cn, convertWeightToLbs } from "@/lib/utils";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export default function LiftAnalyzer({ lifts, userInformations, defaultLiftId }: { lifts: SavedLiftsDto[]; userInformations: UserInformationDto; defaultLiftId: string }) {
  const liftDetailsRecord = useMemo(() => buildLiftDetailsRecord(lifts), [lifts]);

  const percentageValue = [50, 80, 60, 90, 70, 95];

  const [selectedLift, setSelectedLift] = useState<string>(defaultLiftId);
  const [customValue, setCustomValue] = useState<number>(0);
  const [calculatedPercentage, setCalculatedPercentage] = useState<string>("0.00");

  useEffect(() => {
    if (customValue > 100) setCustomValue(100);
    if (customValue < 0) setCustomValue(0);
  }, [customValue]);

  const calculateCustomPercentage = () => {
    if (selectedLift === "") return;

    const calculatedPercentage = lifts
      .filter(lift => lift.lift.id === selectedLift)
      .map(lift => (Number(convertWeightToLbs(Number(lift.weight), userInformations.liftsUnit)) * customValue) / 100)[0]
      .toFixed(2);

    setCalculatedPercentage(calculatedPercentage);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <Label className="text-lg font-bold"> Lift Analyzer</Label>
        <div className="flex flex-col gap-4 bg-gradient-to-b from-neutral-800 rounded-xl p-4">
          <Select value={selectedLift} onValueChange={value => setSelectedLift(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {lifts
                  .filter(lift => lift.lift.category === "Main Lift")
                  .map((lift, index) => (
                    <SelectItem value={lift.lift.id as string} key={index}>
                      {lift.lift.name}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="grid grid-cols-2 gap-2 p-4 rounded-xl bg-neutral-700/50">
            {percentageValue.map((value, index) => (
              <div className="flex gap-2 items-center" key={index}>
                <p className="text-xs text-muted-foreground ">{value}%</p>
                <ArrowBigRight className="text-violet-300 h-3 w-3" />
                <p className="text-xs font-bold">
                  {selectedLift === ""
                    ? "--"
                    : lifts
                        .filter(lift => lift.lift.id === selectedLift)
                        .map(lift => (Number(convertWeightToLbs(Number(lift.weight), userInformations.liftsUnit)) * value) / 100)[0]
                        .toFixed(2)}{" "}
                  {userInformations.liftsUnit}
                </p>
              </div>
            ))}
          </div>
          <div className="flex gap-2 items-center justify-between">
            <Input defaultValue={customValue} max={100} onChange={e => setCustomValue(Number(e.target.value))} type="number" />
            <p>%</p>
            <Button className="rounded-xl text-xs" onClick={calculateCustomPercentage}>
              Calculate
            </Button>
            <div className="rounded-xl px-3 py-2.5 bg-neutral-700/50 text-violet-300 font-semibold min-w-[32%] text-center text-xs">
              {calculatedPercentage} {userInformations.liftsUnit}
            </div>
          </div>

          <div className="text-xs text-muted-foreground">All lifts potential estimates are based on the weights entered as max in your benchmark lifts.</div>
          <div className="flex flex-col gap-4 items-center justify-between">
            <div className="flex justify-around bg-neutral-700/50 p-2 rounded-xl w-full">
              <div>
                <h4 className="text-sm font-semibold">Current Max: </h4>
                <div className={cn(liftDetailsRecord[selectedLift][0].isGreater ? "text-green-400" : "text-red-400", "flex gap-2 items-center justify-between font-bold")}>
                  <p className="text-xl">
                    {Number(convertWeightToLbs(Number(liftDetailsRecord[selectedLift][0].current), userInformations.liftsUnit)).toFixed(2)} {userInformations.liftsUnit}
                  </p>
                  {!liftDetailsRecord[selectedLift][0].isGreater && (
                    <Popover>
                      <PopoverTrigger>
                        <CircleAlert className="text-red-400 h-5 w-5" />
                      </PopoverTrigger>
                      <PopoverContent side="top" align="center" sideOffset={8} className="text-red-400 border-red-400 font-semibold text-xs">
                        <p>{liftDetailsRecord[selectedLift][0].description}</p>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold">Potential Max :</h4>
                <span className="text-xl text-violet-300 font-bold">
                  {Number(convertWeightToLbs(Number(liftDetailsRecord[selectedLift][0].potential), userInformations.liftsUnit)).toFixed(2)} {userInformations.liftsUnit}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export type LiftDetailsRecord = {
  current: number;
  potential: number;
  description: string;
  isGreater: boolean;
};

const buildLiftDetailsRecord = (lifts: SavedLiftsDto[]): Record<string, LiftDetailsRecord[]> => {
  const liftRecord: Record<string, LiftDetailsRecord[]> = {};

  lifts.forEach((lift: SavedLiftsDto) => {
    if (lift.lift.category === "Main Lift") {
      if (!liftRecord[lift.lift.id!]) {
        liftRecord[lift.lift.id!] = [];
      }

      const potential = estimateLiftPotential(lift);

      liftRecord[lift.lift.id!].push({
        current: lift.weight || 0,
        potential: potential,
        description: lift.liftForEstimation!.description,
        isGreater: (lift.weight || 0) > potential,
      });
    }
  });

  return liftRecord;
};

const estimateLiftPotential = (lift: SavedLiftsDto): number => {
  const liftForEstimation: EstimationLiftDto = lift.liftForEstimation!;

  const calculatedWeight = liftForEstimation.weight! * liftForEstimation.percentage;

  return calculatedWeight;
};
