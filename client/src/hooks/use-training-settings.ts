import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { trainingSettingsQueryOptions } from '@/lib/queries';
import type { UpdateTrainingSettingsData } from '@liftarchives/shared';

export function useTrainingSettings() {
    return useQuery(trainingSettingsQueryOptions);
}

export function useIntensityMode(): 'percent' | 'rpe' {
    const { data } = useTrainingSettings();
    return data?.intensityMode === 'rpe' ? 'rpe' : 'percent';
}

export function useUpdateTrainingSettings() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: UpdateTrainingSettingsData) => {
            const res = await client.api.profile['training-settings'].$put({
                json: data,
            });
            if (!res.ok) throw new Error('Failed to update training settings');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['training-settings'] });
        },
    });
}
