import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import type { UpdateTrainingSettingsData } from '@liftarchives/shared';

export function useTrainingSettings() {
    return useQuery({
        queryKey: ['training-settings'],
        queryFn: async () => {
            const res = await client.api.profile['training-settings'].$get();
            if (!res.ok) throw new Error('Failed to fetch training settings');
            const data = await res.json();
            return data.settings;
        },
    });
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
