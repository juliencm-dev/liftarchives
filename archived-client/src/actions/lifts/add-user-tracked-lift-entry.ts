'use server';

import { addUserTrackedLift } from '@/db/data-access/lifts';
import { UserTrackedLift } from '@/db/schemas/users';
import { ServerResponseMessage } from '@/lib/types';
import { convertWeightToKg } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

export async function addUserTrackedLiftEntryAction(data: FormData): Promise<ServerResponseMessage> {
    const weightPreference = data.get('weightPreference') as string;
    const convertedWeight = convertWeightToKg(Number(data.get('weight') as string), weightPreference);

    const newUserLift: UserTrackedLift = {
        liftId: data.get('liftId') as string,
        oneRepMax: Number(convertedWeight),
        oneRepMaxDate: new Date(),
    } as UserTrackedLift;

    try {
        await addUserTrackedLift(newUserLift);
        revalidatePath('/lifts');

        return {
            message: 'New personnal best added successfully',
            status: 200,
        };
    } catch (error: any) {
        return {
            message: error.message,
            status: 500,
        };
    }
}
