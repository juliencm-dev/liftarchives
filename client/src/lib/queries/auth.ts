import { queryOptions } from '@tanstack/react-query';
import { getSession } from '@/lib/auth';

export const currentUserQueryOptions = queryOptions({
    queryKey: ['currentUser'] as const,
    staleTime: 2 * 60_000, // 2 minutes
    queryFn: async () => {
        const { data: session } = await getSession();
        return session?.user || null;
    },
});
