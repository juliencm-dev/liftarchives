import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import type {
    StartSessionData,
    LogSetData,
    UpdateSetData,
    UpdateSessionData,
    AddExerciseData,
    BatchSetsData,
} from '@liftarchives/shared';

export function useActiveSession() {
    return useQuery({
        queryKey: ['sessions', 'active'],
        queryFn: async () => {
            const res = await client.api.sessions.active.$get();
            if (!res.ok) throw new Error('Failed to fetch active session');
            return res.json();
        },
    });
}

export function useSession(id: string | undefined) {
    return useQuery({
        queryKey: ['sessions', id],
        enabled: !!id,
        queryFn: async () => {
            const res = await client.api.sessions[':id'].$get({
                param: { id: id! },
            });
            if (!res.ok) throw new Error('Failed to fetch session');
            return res.json();
        },
    });
}

export function useSessionHistory(options?: { limit?: number; offset?: number }) {
    return useQuery({
        queryKey: ['sessions', 'history', options?.limit, options?.offset],
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

export function useWeeklySessionCount() {
    return useQuery({
        queryKey: ['sessions', 'weekly-count'],
        queryFn: async () => {
            const res = await client.api.sessions['weekly-count'].$get();
            if (!res.ok) throw new Error('Failed to fetch weekly count');
            return res.json();
        },
    });
}

export function useStartSession() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: StartSessionData) => {
            const res = await client.api.sessions.start.$post({ json: data });
            if (!res.ok) throw new Error('Failed to start session');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
            queryClient.invalidateQueries({ queryKey: ['programs', 'active'] });
        },
    });
}

export function useCompleteSession() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (sessionId: string) => {
            const res = await client.api.sessions[':id'].complete.$post({
                param: { id: sessionId },
            });
            if (!res.ok) throw new Error('Failed to complete session');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
            queryClient.invalidateQueries({ queryKey: ['programs', 'active'] });
            queryClient.invalidateQueries({ queryKey: ['records'] });
        },
    });
}

export function useDiscardSession() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (sessionId: string) => {
            const res = await client.api.sessions[':id'].$delete({
                param: { id: sessionId },
            });
            if (!res.ok) throw new Error('Failed to discard session');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
        },
    });
}

export function useUpdateSession(sessionId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: UpdateSessionData) => {
            const res = await client.api.sessions[':id'].$put({
                param: { id: sessionId },
                json: data,
            });
            if (!res.ok) throw new Error('Failed to update session');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
        },
    });
}

export function useAddExercise() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ sessionId, data }: { sessionId: string; data: AddExerciseData }) => {
            const res = await client.api.sessions[':id'].exercises.$post({
                param: { id: sessionId },
                json: data,
            });
            if (!res.ok) throw new Error('Failed to add exercise');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
        },
    });
}

export function useLogSet() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ sessionId, data }: { sessionId: string; data: LogSetData }) => {
            const res = await client.api.sessions[':id'].sets.$post({
                param: { id: sessionId },
                json: data,
            });
            if (!res.ok) throw new Error('Failed to log set');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
            queryClient.invalidateQueries({ queryKey: ['records'] });
        },
    });
}

export function useUpdateSet(sessionId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ setId, data }: { setId: string; data: UpdateSetData }) => {
            const res = await client.api.sessions[':id'].sets[':setId'].$put({
                param: { id: sessionId, setId },
                json: data,
            });
            if (!res.ok) throw new Error('Failed to update set');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
        },
    });
}

export function useDeleteSet(sessionId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (setId: string) => {
            const res = await client.api.sessions[':id'].sets[':setId'].$delete({
                param: { id: sessionId, setId },
            });
            if (!res.ok) throw new Error('Failed to delete set');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
        },
    });
}

export function useWeightSuggestions(sessionId: string | undefined, exerciseId: string | undefined) {
    return useQuery({
        queryKey: ['sessions', sessionId, 'suggestions', exerciseId],
        enabled: !!sessionId && !!exerciseId,
        queryFn: async () => {
            const res = await client.api.sessions[':id'].suggestions[':exerciseId'].$get({
                param: { id: sessionId!, exerciseId: exerciseId! },
            });
            if (!res.ok) throw new Error('Failed to fetch suggestions');
            return res.json();
        },
    });
}

export function useBatchUploadSets() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ sessionId, data }: { sessionId: string; data: BatchSetsData }) => {
            const res = await client.api.sessions[':id']['batch-upload'].$post({
                param: { id: sessionId },
                json: data,
            });
            if (!res.ok) throw new Error('Failed to batch upload sets');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
            queryClient.invalidateQueries({ queryKey: ['records'] });
        },
    });
}

export function usePreviousPerformance(sessionId: string | undefined, exerciseId: string | undefined) {
    return useQuery({
        queryKey: ['sessions', sessionId, 'previous-performance', exerciseId],
        enabled: !!sessionId && !!exerciseId,
        queryFn: async () => {
            const res = await client.api.sessions[':id']['previous-performance'][':exerciseId'].$get({
                param: { id: sessionId!, exerciseId: exerciseId! },
            });
            if (!res.ok) throw new Error('Failed to fetch previous performance');
            return res.json();
        },
    });
}
