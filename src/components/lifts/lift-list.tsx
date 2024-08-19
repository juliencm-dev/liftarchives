"use client";

import { BenchmarkLiftsDto } from "@/db/data-access/dto/lifts/types";
import { ChevronDown } from "lucide-react";
import LiftCard from "./lift-card";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { is } from "drizzle-orm";

interface LiftListProps {
  lifts: BenchmarkLiftsDto[];
  category: string;
  title: string;
  weightPreference: string;
}

export default function LiftList(props: LiftListProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn(
        "group flex flex-col gap-6 w-full p-4 bg-gradient-to-b from-neutral-800 rounded-t-xl cursor-pointer",
        isOpen
          ? "bg-gradient-to-b from-neutral-700/50"
          : "hover:bg-gradient-to-b hover:from-neutral-700/50 transition-colors"
      )}
      onClick={() => setIsOpen(!isOpen)}>
      <div className='flex justify-between'>
        <h2 className='text-2xl font-semibold'>{props.title}</h2>
        <ChevronDown
          className={cn(
            isOpen ? "rotate-180" : "",
            "transition-transform duration-300"
          )}
        />
      </div>
      <div
        ref={contentRef}
        className={cn(
          "flex flex-col gap-2 transition-all duration-300 ease-in-out overflow-hidden",
          isOpen
            ? "max-h-[1000px] opacity-100 visible"
            : "max-h-0 opacity-0 invisible"
        )}
        style={{
          maxHeight: isOpen
            ? contentRef.current?.scrollHeight
              ? `${contentRef.current.scrollHeight}px`
              : "none"
            : 0,
        }}>
        {props.lifts
          .filter(
            (benchmarkLift: BenchmarkLiftsDto) =>
              benchmarkLift.lift.category === props.category
          )
          .sort((a, b) => a.lift.name.localeCompare(b.lift.name))
          .map((benchmarkLift) => (
            <LiftCard
              key={benchmarkLift.lift.id}
              lift={benchmarkLift}
              weightPreference={props.weightPreference}
            />
          ))}
      </div>
    </div>
  );
}
