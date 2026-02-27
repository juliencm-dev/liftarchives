'use client';

import { SavedLiftsDto, UserTrackedLiftDto } from '@/db/data-access/dto/lifts/types';
import { cn, convertWeightToLbs } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerNestedRoot,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ServerResponseMessage } from '@/lib/types';
import { addUserLiftAction } from '@/actions/lifts/add-user-lift';

import { useToast } from '@/components/ui/use-toast';
import { PulseLoader } from 'react-spinners';
import { useState } from 'react';
import { addUserTrackedLiftEntryAction } from '@/actions/lifts/add-user-tracked-lift-entry';

interface PBCardProps {
    lift: SavedLiftsDto | UserTrackedLiftDto;
    weightPreference: string;
}

export default function PBCard(props: PBCardProps) {
    const [isPending, setIsPending] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const { toast } = useToast();

    const handleAddPersonnalBest = (formData: FormData) => {
        setIsPending(true);

        const newLiftFormData = new FormData();

        newLiftFormData.append('liftId', props.lift.lift.id as string);
        newLiftFormData.append('weightPreference', props.weightPreference);
        newLiftFormData.append('weight', formData.get('weight') as string);

        if (props.lift.isBenchmark) {
            addUserLiftAction(newLiftFormData).then((response: ServerResponseMessage) => {
                if (response.status !== 500) {
                    toast({
                        title: 'Success',
                        description: response.message,
                    });
                    setIsPending(false);
                    setOpen(false);
                } else {
                    toast({
                        title: 'Error',
                        variant: 'destructive',
                        description: response.message,
                    });
                }
            });
        } else {
            addUserTrackedLiftEntryAction(newLiftFormData).then((response: ServerResponseMessage) => {
                if (response.status !== 500) {
                    toast({
                        title: 'Success',
                        description: response.message,
                    });
                    setIsPending(false);
                    setOpen(false);
                } else {
                    toast({
                        title: 'Error',
                        variant: 'destructive',
                        description: response.message,
                    });
                }
            });
        }
    };

    return (
        <div className="flex justify-between bg-neutral-900 p-4 rounded-xl w-full mt-4 shadow-sm">
            <div className="flex flex-col gap-4 text-left bg-neutral-800/50 p-8 w-[70%] rounded-xl shadow-sm">
                <div className="flex flex-col gap-2">
                    <p className="text-lg font-semibold text-foreground">Personnal Best</p>
                    <p className="text-xs text-muted-foreground">
                        {props.lift.date === null
                            ? 'No data found'
                            : 'Achieved on ' + new Date(props.lift.date).toDateString()}
                    </p>
                </div>
                <p
                    className={cn(
                        props.lift.weight === null ? 'text-lg sm:text-xl' : 'text-2xl',
                        'font-semibold text-violet-300'
                    )}
                >
                    {props.lift.weight === null
                        ? 'Add a personnal best'
                        : convertWeightToLbs(props.lift.weight, props.weightPreference)}{' '}
                    {props.lift.weight !== null && props.weightPreference}
                </p>
            </div>
            <DrawerNestedRoot open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    <div className="flex justify-center items-center gap-2 bg-neutral-800/50 p-8 rounded-xl w-[calc(30%-1rem)] cursor-pointer hover:bg-violet-300/30 hover:text-foreground transition-colors shadow-sm">
                        <div className="text-6xl">+</div>
                    </div>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerClose />
                    <DrawerHeader>
                        <DrawerTitle>New Lift Entry</DrawerTitle>
                        <DrawerDescription className="mt-2">
                            Enter the value of your latest lift for the {props.lift.lift.name}.
                        </DrawerDescription>
                        <form action={handleAddPersonnalBest}>
                            <div className="flex flex-col gap-4 p-4 mt-6 bg-neutral-900 rounded-xl w-full">
                                <div className="flex items-center gap-4 bg-neutral-800/50 rounded-xl p-4">
                                    <Label htmlFor="weight" className="text-right">
                                        Weight
                                    </Label>
                                    <Input name="weight" />
                                </div>
                                <Button className="rounded-xl" type="submit" disabled={isPending}>
                                    {isPending ? <PulseLoader size={4} /> : 'Add Lift'}
                                </Button>
                            </div>
                        </form>
                    </DrawerHeader>
                </DrawerContent>
            </DrawerNestedRoot>
        </div>
    );
}
