"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

import { LiftDto, SavedLiftsDto } from "@/db/data-access/dto/lifts/types";

import { ChevronDown, PlusCircle } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import LiftCard from "@/components/lifts/lift-card";
import PBCard from "@/components/lifts/pb-card";
import PBHistoryCard from "@/components/lifts/pb-history-card";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { PulseLoader } from "react-spinners";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface LiftListProps {
  userLifts: SavedLiftsDto[];
  lifts: LiftDto[];
  title: string;
  weightPreference: string;
  userId: string;
  isOpen?: boolean;
}

export default function UserTrackedLiftList(props: LiftListProps) {
  const [isOpen, setIsOpen] = useState<boolean>(props.isOpen ?? false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleAddTrackedLift = (formData: FormData) => {
    setIsPending(true);

    const newLiftFormData = new FormData();
    newLiftFormData.append("userId", props.userId);
    newLiftFormData.append("liftId", formData.get("liftId") as string);

    console.log(formData.get("liftId") as string);

    setIsPending(false);
  };

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-2'>
        <div className='flex gap-4 items-center'>
          <h2 className='text-lg font-bold'>User Tracked Lifts</h2>
          <Drawer>
            <DrawerTrigger>
              <PlusCircle className='text-violet-300' />
            </DrawerTrigger>
            <DrawerContent>
              <ScrollArea className='overflow-y-auto'>
                <DrawerHeader>
                  <DrawerTitle> Track Additionnal Lifts</DrawerTitle>
                  <DrawerDescription className='mt-2'>
                    Select the lift you want to track from the list below to add
                    it to your personal list of tracked lifts.
                  </DrawerDescription>
                  <form action={handleAddTrackedLift}>
                    <div className='flex flex-col gap-4 p-4 mt-6 bg-neutral-900 rounded-xl w-full'>
                      <div className='flex items-center gap-4 bg-neutral-800/50 rounded-xl p-4'>
                        <Select name='liftId'>
                          <SelectTrigger>
                            <SelectValue placeholder='Select a lift' />
                          </SelectTrigger>
                          <SelectContent className='z-[1100]'>
                            <SelectGroup>
                              {props.lifts.map((lift, index) => (
                                <SelectItem
                                  value={lift.id as string}
                                  key={index}>
                                  {lift.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        className='rounded-xl'
                        type='submit'
                        disabled={isPending}>
                        {isPending ? <PulseLoader size={4} /> : "Add Lift"}
                      </Button>
                    </div>
                  </form>
                </DrawerHeader>
              </ScrollArea>
            </DrawerContent>
          </Drawer>
        </div>
        <p className='text-xs text-muted-foreground '>
          Here you can track additional lifts that may be useful for your
          personnal progression and goals.
        </p>
      </div>
      <div
        className={cn(
          "group flex flex-col gap-6 w-full p-4 bg-gradient-to-b from-neutral-800 rounded-t-xl cursor-pointer",
          isOpen
            ? "bg-gradient-to-b from-neutral-700/50"
            : "hover:bg-gradient-to-b hover:from-neutral-700/50 transition-colors"
        )}>
        <div
          className='flex justify-between'
          onClick={() => setIsOpen(!isOpen)}>
          <h2 className='text-lg font-semibold'>{props.title}</h2>
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
          {props.userLifts
            .sort((a, b) => a.lift.name.localeCompare(b.lift.name))
            .map((userTrackedLift) => (
              <Drawer key={userTrackedLift.lift.id}>
                <DrawerTrigger>
                  <LiftCard
                    lift={userTrackedLift}
                    weightPreference={props.weightPreference}
                  />
                </DrawerTrigger>
                <DrawerContent>
                  <ScrollArea className='overflow-y-auto'>
                    <DrawerHeader>
                      <DrawerTitle>{userTrackedLift.lift.name}</DrawerTitle>
                      <DrawerDescription className='mt-2'>
                        {userTrackedLift.lift.description}
                      </DrawerDescription>
                      <PBCard
                        lift={userTrackedLift}
                        userId={props.userId}
                        weightPreference={props.weightPreference}
                      />
                      <PBHistoryCard
                        userLifts={userTrackedLift.history}
                        weightPreference={props.weightPreference}
                      />
                    </DrawerHeader>
                  </ScrollArea>
                </DrawerContent>
              </Drawer>
            ))}
        </div>
      </div>
    </div>
  );
}
