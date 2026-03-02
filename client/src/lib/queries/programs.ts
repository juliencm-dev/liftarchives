import { queryOptions } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { ProgramDto } from '@liftarchives/shared';

export const programsQueryOptions = queryOptions({
    queryKey: ['programs'] as const,
    queryFn: async () => {
        const res = await client.api.programs.$get();
        if (!res.ok) throw new Error('Failed to fetch programs');
        const data = await res.json();
        return ProgramDto.fromServerList(data.programs);
    },
});

export function programQueryOptions(id: string) {
    return queryOptions({
        queryKey: ['programs', id] as const,
        queryFn: async () => {
            const res = await client.api.programs[':id'].$get({
                param: { id },
            });
            if (!res.ok) throw new Error('Failed to fetch program');
            const data = await res.json();
            return ProgramDto.fromServer(data.program);
        },
    });
}

export const activeProgramQueryOptions = queryOptions({
    queryKey: ['programs', 'active'] as const,
    queryFn: async () => {
        const res = await client.api.programs.active.$get();
        if (!res.ok) throw new Error('Failed to fetch active program');
        return res.json();
    },
});
