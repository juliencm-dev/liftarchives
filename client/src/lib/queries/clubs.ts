import { queryOptions } from '@tanstack/react-query';
import { client } from '@/lib/hono';

const CLUBS_STALE_TIME = 2 * 60_000; // 2 minutes

export const userClubsQueryOptions = queryOptions({
    queryKey: ['clubs'] as const,
    staleTime: CLUBS_STALE_TIME,
    queryFn: async () => {
        const res = await client.api.clubs.$get();
        if (!res.ok) throw new Error('Failed to fetch clubs');
        const data = await res.json();
        return data.clubs;
    },
});

export function clubDetailQueryOptions(clubId: string) {
    return queryOptions({
        queryKey: ['clubs', clubId] as const,
        staleTime: CLUBS_STALE_TIME,
        queryFn: async () => {
            const res = await client.api.clubs[':id'].$get({
                param: { id: clubId },
            });
            if (!res.ok) throw new Error('Failed to fetch club detail');
            const data = await res.json();
            return data.club;
        },
    });
}
