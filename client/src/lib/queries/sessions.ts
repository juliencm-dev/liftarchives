import { queryOptions } from '@tanstack/react-query';
import { client } from '@/lib/hono';

export function sessionHistoryQueryOptions(options?: { limit?: number; offset?: number }) {
    return queryOptions({
        queryKey: ['sessions', 'history', options?.limit, options?.offset] as const,
        queryFn: async () => {
            const res = await client.api.sessions.$get({
                query: {
                    limit: String(options?.limit ?? 20),
                    offset: String(options?.offset ?? 0),
                },
            });
            if (!res.ok) throw new Error('Failed to fetch session history');
            return res.json();
        },
    });
}

export const weeklySessionCountQueryOptions = queryOptions({
    queryKey: ['sessions', 'weekly-count'] as const,
    queryFn: async () => {
        const res = await client.api.sessions['weekly-count'].$get();
        if (!res.ok) throw new Error('Failed to fetch weekly count');
        return res.json();
    },
});

export function sessionQueryOptions(id: string) {
    return queryOptions({
        queryKey: ['sessions', id] as const,
        queryFn: async () => {
            const res = await client.api.sessions[':id'].$get({
                param: { id },
            });
            if (!res.ok) throw new Error('Failed to fetch session');
            return res.json();
        },
    });
}

export const activeSessionQueryOptions = queryOptions({
    queryKey: ['sessions', 'active'] as const,
    staleTime: 30_000, // 30s — live session state needs to stay fresh
    queryFn: async () => {
        const res = await client.api.sessions.active.$get();
        if (!res.ok) throw new Error('Failed to fetch active session');
        return res.json();
    },
});
