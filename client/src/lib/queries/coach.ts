import { queryOptions } from '@tanstack/react-query';
import { client } from '@/lib/hono';

const COACH_STALE_TIME = 2 * 60_000; // 2 minutes

export const coachLiftersQueryOptions = queryOptions({
    queryKey: ['coach', 'lifters'] as const,
    staleTime: COACH_STALE_TIME,
    queryFn: async () => {
        const res = await client.api.coach.lifters.$get();
        if (!res.ok) throw new Error('Failed to fetch coach lifters');
        const data = await res.json();
        return data.lifters;
    },
});

export const coachInvitesQueryOptions = queryOptions({
    queryKey: ['coach', 'invites'] as const,
    staleTime: COACH_STALE_TIME,
    queryFn: async () => {
        const res = await client.api.coach.invites.$get();
        if (!res.ok) throw new Error('Failed to fetch coach invites');
        const data = await res.json();
        return data.invites;
    },
});

export const coachSessionsQueryOptions = queryOptions({
    queryKey: ['coach', 'sessions'] as const,
    staleTime: COACH_STALE_TIME,
    queryFn: async () => {
        const res = await client.api.coach.sessions.$get();
        if (!res.ok) throw new Error('Failed to fetch coach sessions');
        const data = await res.json();
        return data.sessions;
    },
});

export const coachProgramsQueryOptions = queryOptions({
    queryKey: ['coach', 'programs'] as const,
    staleTime: COACH_STALE_TIME,
    queryFn: async () => {
        const res = await client.api.coach.programs.$get();
        if (!res.ok) throw new Error('Failed to fetch coach programs');
        const data = await res.json();
        return data.programs;
    },
});

export function coachLifterSessionsQueryOptions(lifterId: string) {
    return queryOptions({
        queryKey: ['coach', 'lifters', lifterId, 'sessions'] as const,
        staleTime: COACH_STALE_TIME,
        queryFn: async () => {
            const res = await client.api.coach.lifters[':lifterId'].sessions.$get({
                param: { lifterId },
            });
            if (!res.ok) throw new Error('Failed to fetch lifter sessions');
            const data = await res.json();
            return data.sessions;
        },
    });
}

export function coachLifterRecordsQueryOptions(lifterId: string) {
    return queryOptions({
        queryKey: ['coach', 'lifters', lifterId, 'records'] as const,
        staleTime: COACH_STALE_TIME,
        queryFn: async () => {
            const res = await client.api.coach.lifters[':lifterId'].records.$get({
                param: { lifterId },
            });
            if (!res.ok) throw new Error('Failed to fetch lifter records');
            const data = await res.json();
            return data.records;
        },
    });
}

export const lifterInvitesQueryOptions = queryOptions({
    queryKey: ['invites'] as const,
    staleTime: COACH_STALE_TIME,
    queryFn: async () => {
        const res = await client.api.invites.$get();
        if (!res.ok) throw new Error('Failed to fetch invites');
        const data = await res.json();
        return data.invites;
    },
});
