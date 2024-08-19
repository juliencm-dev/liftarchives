"use client";

import { BenchmarkLiftsDto } from "@/db/data-access/dto/lifts/types";
import { ChevronDown } from "lucide-react";
import LiftCard from "./lift-card";

interface LiftListProps {
  lifts: BenchmarkLiftsDto[];
  category: string;
  title: string;
}

export default function LiftList(props: LiftListProps) {
  return (
    <div className="flex flex-col gap-6 w-full p-4 border border-muted bg-neutral-800 rounded-xl">
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold">{props.title}</h2>
        <ChevronDown />
      </div>
      <div className="flex flex-col gap-2">
        {props.lifts
          .filter((benchmarkLift: BenchmarkLiftsDto) => benchmarkLift.lift.category === props.category)
          .sort((a, b) => a.lift.name.localeCompare(b.lift.name))
          .map(benchmarkLift => (
            <LiftCard key={benchmarkLift.lift.id} lift={benchmarkLift} />
          ))}
      </div>
    </div>
  );
}
