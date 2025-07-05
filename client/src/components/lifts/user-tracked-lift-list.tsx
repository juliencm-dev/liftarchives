'use client';

import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

import { LiftDto, UserTrackedLiftDto } from '@/db/data-access/dto/lifts/types';

import { Check, ChevronDown, ChevronsUpDown, PlusCircle } from 'lucide-react';
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

import { Button } from '../ui/button';
import { PulseLoader } from 'react-spinners';

import { addUserTrackedLiftAction } from '@/actions/lifts/add-user-tracked-lift';
import { useToast } from '../ui/use-toast';
import { ServerResponseMessage } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';

interface LiftListProps {
    userLifts: UserTrackedLiftDto[];
    lifts: LiftDto[];
    title: string;
    weightPreference: string;
    userId: string;
    isOpen?: boolean;
}

export default function UserTrackedLiftList(props: LiftListProps) {
    const { toast } = useToast();
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const [openAccordion, setOpenAccordion] = useState<boolean>(props.isOpen ?? false);
    const [openCombobox, setOpenCombobox] = useState<boolean>(false);
    const [selectedLift, setSelectedLift] = useState<string>('');

    const [isPending, setIsPending] = useState<boolean>(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleAddTrackedLift = () => {
        setIsPending(true);

        const selectedLiftId = props.lifts.find((lift) => lift.name === selectedLift)?.id;

        const newLiftFormData = new FormData();
        newLiftFormData.append('liftId', selectedLiftId as string);

        addUserTrackedLiftAction(newLiftFormData).then((response: ServerResponseMessage) => {
            if (response.status !== 500) {
                toast({
                    title: 'Success',
                    description: response.message,
                });
                setIsPending(false);
            } else {
                toast({
                    title: 'Error',
                    variant: 'destructive',
                    description: response.message,
                });
            }
        });
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex gap-4 items-center justify-between">
                <div className="flex flex-col gap-2">
                    <h2 className="text-lg font-bold">User Tracked Lifts</h2>
                    <p className="text-xs text-muted-foreground ">
                        Here you can track additional lifts that may be useful for your personnal progression and goals.
                    </p>
                </div>
                <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
                    <DrawerTrigger>
                        <div className="flex justify-center items-center gap-2 bg-neutral-800/50 p-4 rounded-xl cursor-pointer hover:bg-violet-300/30 hover:text-foreground transition-colors shadow-sm">
                            <div className="text-4xl">+</div>
                        </div>
                    </DrawerTrigger>
                    <DrawerContent>
                        <ScrollArea className="overflow-y-auto">
                            <DrawerHeader>
                                <DrawerTitle> Track Additionnal Lifts</DrawerTitle>
                                <DrawerDescription className="mt-2">
                                    Select the lift you want to track from the list below to add it to your personal
                                    list of tracked lifts.
                                </DrawerDescription>
                                <form action={handleAddTrackedLift}>
                                    <div className="flex flex-col gap-4 p-4 mt-6 bg-neutral-900 rounded-xl w-full">
                                        <div className="flex items-center gap-4 bg-neutral-800/50 rounded-xl p-4">
                                            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={openCombobox}
                                                        className="w-full justify-between rounded-xl border-muted hover:bg-muted/20 transition-colors"
                                                    >
                                                        {selectedLift
                                                            ? props.lifts.find((lift) => lift.name === selectedLift)
                                                                  ?.name
                                                            : 'Select lift...'}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="z-[1200] p-0 popover-content-width-same-as-its-trigger">
                                                    <Command>
                                                        <CommandInput placeholder="Search lift..." />
                                                        <CommandList>
                                                            <ScrollArea className="overflow-y-auto">
                                                                <CommandEmpty>No lift found.</CommandEmpty>
                                                                <CommandGroup>
                                                                    {props.lifts
                                                                        .filter(
                                                                            (lift) =>
                                                                                props.userLifts.findIndex(
                                                                                    (userLift) =>
                                                                                        userLift.lift.id === lift.id
                                                                                ) === -1
                                                                        )
                                                                        .map((lift) => (
                                                                            <CommandItem
                                                                                key={lift.id}
                                                                                value={lift.name}
                                                                                onSelect={(currentValue) => {
                                                                                    setSelectedLift(currentValue);
                                                                                    setOpenCombobox(false);
                                                                                }}
                                                                            >
                                                                                <Check
                                                                                    className={cn(
                                                                                        'mr-2 h-4 w-4 text-violet-300',
                                                                                        selectedLift === lift.name
                                                                                            ? 'opacity-100'
                                                                                            : 'opacity-0'
                                                                                    )}
                                                                                />
                                                                                {lift.name}
                                                                            </CommandItem>
                                                                        ))}
                                                                </CommandGroup>
                                                            </ScrollArea>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                        <Button className="rounded-xl" type="submit" disabled={isPending}>
                                            {isPending ? <PulseLoader size={4} /> : 'Add Lift'}
                                        </Button>
                                    </div>
                                </form>
                            </DrawerHeader>
                        </ScrollArea>
                    </DrawerContent>
                </Drawer>
            </div>
            <div
                className={cn(
                    'group flex flex-col gap-6 w-full p-4 bg-gradient-to-b from-neutral-800 rounded-t-xl cursor-pointer',
                    openAccordion
                        ? 'bg-gradient-to-b from-neutral-700/50'
                        : 'hover:bg-gradient-to-b hover:from-neutral-700/50 transition-colors'
                )}
            >
                <div className="flex justify-between" onClick={() => setOpenAccordion(!openAccordion)}>
                    <h2 className="text-lg font-semibold">{props.title}</h2>
                    <ChevronDown
                        className={cn(openAccordion ? 'rotate-180' : '', 'transition-transform duration-300')}
                    />
                </div>
                <div
                    ref={contentRef}
                    className={cn(
                        'flex flex-col gap-2 transition-all duration-300 ease-in-out overflow-hidden',
                        openAccordion ? 'max-h-[1000px] opacity-100 visible' : 'max-h-0 opacity-0 invisible'
                    )}
                    style={{
                        maxHeight: openAccordion
                            ? contentRef.current?.scrollHeight
                                ? `${contentRef.current.scrollHeight}px`
                                : 'none'
                            : 0,
                    }}
                >
                    {props.userLifts
                        .sort((a, b) => a.lift.name.localeCompare(b.lift.name))
                        .map((userTrackedLift) => (
                            <Drawer key={userTrackedLift.lift.id}>
                                <DrawerTrigger>
                                    <LiftCard lift={userTrackedLift} weightPreference={props.weightPreference} />
                                </DrawerTrigger>
                                <DrawerContent>
                                    <ScrollArea className="overflow-y-auto">
                                        <DrawerHeader>
                                            <DrawerTitle>{userTrackedLift.lift.name}</DrawerTitle>
                                            <DrawerDescription className="mt-2">
                                                {userTrackedLift.lift.description}
                                            </DrawerDescription>
                                            <PBCard lift={userTrackedLift} weightPreference={props.weightPreference} />
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
