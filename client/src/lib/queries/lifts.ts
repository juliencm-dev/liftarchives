import { queryOptions } from '@tanstack/react-query';
import { client } from '@/lib/hono';

export const liftsQueryOptions = queryOptions({
    queryKey: ['lifts'] as const,
    queryFn: async () => {
        const res = await client.api.lifts.$get();
        if (!res.ok) throw new Error('Failed to fetch lifts');
        const data = await res.json();
        return data.lifts;
    },
});

export function personalRecordsQueryOptions(liftId?: string) {
    return queryOptions({
        queryKey: ['personalRecords', liftId] as const,
        queryFn: async () => {
            const res = await client.api.lifts.records.$get({
                query: liftId ? { liftId } : {},
            });
            if (!res.ok) throw new Error('Failed to fetch records');
            const data = await res.json();
            return data.records;
        },
    });
}

export const bestRecordsQueryOptions = queryOptions({
    queryKey: ['personalRecords', 'best'] as const,
    queryFn: async () => {
        const res = await client.api.lifts.records.best.$get();
        if (!res.ok) throw new Error('Failed to fetch best records');
        const data = await res.json();
        return data.records;
    },
});

export const recentRecordsQueryOptions = queryOptions({
    queryKey: ['personalRecords', 'recent'] as const,
    queryFn: async () => {
        const res = await client.api.lifts.records.recent.$get();
        if (!res.ok) throw new Error('Failed to fetch recent records');
        const data = await res.json();
        return data.records;
    },
});
