import { queryOptions } from '@tanstack/react-query';
import { client } from '@/lib/hono';

// Profile data rarely changes — only on explicit user edits
const PROFILE_STALE_TIME = 5 * 60_000; // 5 minutes

export const lifterProfileQueryOptions = queryOptions({
    queryKey: ['lifterProfile'] as const,
    staleTime: PROFILE_STALE_TIME,
    queryFn: async () => {
        const res = await client.api.profile.lifter.$get();
        if (!res.ok) throw new Error('Failed to fetch lifter profile');
        const data = await res.json();
        return data.profile;
    },
});

export const coachProfileQueryOptions = queryOptions({
    queryKey: ['coachProfile'] as const,
    staleTime: PROFILE_STALE_TIME,
    queryFn: async () => {
        const res = await client.api.profile.coach.$get();
        if (!res.ok) throw new Error('Failed to fetch coach profile');
        const data = await res.json();
        return data.profile;
    },
});

export const competitionProfileQueryOptions = queryOptions({
    queryKey: ['competitionProfile'] as const,
    staleTime: PROFILE_STALE_TIME,
    queryFn: async () => {
        const res = await client.api.profile.competition.$get();
        if (!res.ok) throw new Error('Failed to fetch competition profile');
        const data = await res.json();
        return data.profile;
    },
});

export const trainingSettingsQueryOptions = queryOptions({
    queryKey: ['training-settings'] as const,
    staleTime: PROFILE_STALE_TIME,
    queryFn: async () => {
        const res = await client.api.profile['training-settings'].$get();
        if (!res.ok) throw new Error('Failed to fetch training settings');
        const data = await res.json();
        return data.settings;
    },
});
