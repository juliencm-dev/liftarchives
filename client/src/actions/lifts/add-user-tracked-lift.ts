'use server';

import { addUserTrackedLift } from '@/db/data-access/lifts';
import { UserTrackedLift } from '@/db/schemas/users';
import { ServerResponseMessage } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function addUserTrackedLiftAction(data: FormData): Promise<ServerResponseMessage> {
    const liftId = data.get('liftId') as string;

    try {
        const newUserTrackedLift: UserTrackedLift = {
            liftId: liftId,
            oneRepMax: null,
            oneRepMaxDate: null,
        } as UserTrackedLift;

        await addUserTrackedLift(newUserTrackedLift);
        revalidatePath('/lifts');

        return {
            message: 'A new lift has been added to your list of tracked lifts',
            status: 200,
        };
    } catch (error: any) {
        return {
            message: error.message,
            status: 500,
        };
    }
}
