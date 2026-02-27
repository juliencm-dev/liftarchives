'use client';

import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

import { SavedLiftsDto } from '@/db/data-access/dto/lifts/types';

import { ChevronDown } from 'lucide-react';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';

import LiftCard from '@/components/lifts/lift-card';
import PBCard from '@/components/lifts/pb-card';
import PBHistoryCard from '@/components/lifts/pb-history-card';
import { ScrollArea } from '@radix-ui/react-scroll-area';

interface LiftListProps {
    lifts: SavedLiftsDto[];
    category: string;
    title: string;
    weightPreference: string;
    userId: string;
    isOpen?: boolean;
}

export default function SavedLiftList(props: LiftListProps) {
    const [isOpen, setIsOpen] = useState<boolean>(props.isOpen ?? false);
    const contentRef = useRef<HTMLDivElement>(null);

    return (
        <div
            className={cn(
                'group flex flex-col gap-6 w-full p-4 bg-gradient-to-b from-neutral-800 rounded-t-xl cursor-pointer',
                isOpen
                    ? 'bg-gradient-to-b from-neutral-700/50'
                    : 'hover:bg-gradient-to-b hover:from-neutral-700/50 transition-colors'
            )}
        >
            <div className="flex justify-between" onClick={() => setIsOpen(!isOpen)}>
                <div className="flex flex-col gap-2">
                    <h2 className="text-lg font-semibold">{props.title}</h2>
                    <p className="text-xs text-muted-foreground ">
                        Filling out this section will allow you to easily calculate your percentages when following
                        along your weightlifting programs.
                    </p>
                </div>
                <ChevronDown className={cn(isOpen ? 'rotate-180' : '', 'transition-transform duration-300')} />
            </div>
            <div
                ref={contentRef}
                className={cn(
                    'flex flex-col gap-2 transition-all duration-300 ease-in-out overflow-hidden',
                    isOpen ? 'max-h-[1000px] opacity-100 visible' : 'max-h-0 opacity-0 invisible'
                )}
                style={{
                    maxHeight: isOpen
                        ? contentRef.current?.scrollHeight
                            ? `${contentRef.current.scrollHeight}px`
                            : 'none'
                        : 0,
                }}
            >
                {props.lifts
                    .sort((a, b) => a.lift.name.localeCompare(b.lift.name))
                    .map((benchmarkLift) => (
                        <Drawer key={benchmarkLift.lift.id}>
                            <DrawerTrigger>
                                <LiftCard lift={benchmarkLift} weightPreference={props.weightPreference} />
                            </DrawerTrigger>
                            <DrawerContent>
                                <ScrollArea className="overflow-y-auto">
                                    <DrawerHeader>
                                        <DrawerTitle>{benchmarkLift.lift.name}</DrawerTitle>
                                        <DrawerDescription className="mt-2">
                                            {benchmarkLift.lift.description}
                                        </DrawerDescription>
                                        <PBCard lift={benchmarkLift} weightPreference={props.weightPreference} />
                                        <PBHistoryCard
                                            userLifts={benchmarkLift.history}
                                            weightPreference={props.weightPreference}
                                        />
                                    </DrawerHeader>
                                </ScrollArea>
                            </DrawerContent>
                        </Drawer>
                    ))}
            </div>
        </div>
    );
}
