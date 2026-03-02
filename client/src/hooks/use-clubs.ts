import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { userClubsQueryOptions, clubDetailQueryOptions } from '@/lib/queries';
import type { CreateClubData, UpdateClubData, AddClubMemberData } from '@liftarchives/shared';

// ── Queries ──

export function useUserClubs() {
    return useQuery(userClubsQueryOptions);
}

export function useClubDetail(clubId: string) {
    return useQuery(clubDetailQueryOptions(clubId));
}

// ── Mutations ──

export function useCreateClub() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: CreateClubData) => {
            const res = await client.api.clubs.$post({ json: data });
            if (!res.ok) {
                const err = await res.json();
                throw new Error((err as { message?: string }).message ?? 'Failed to create club');
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clubs'] });
        },
    });
}

export function useUpdateClub(clubId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: UpdateClubData) => {
            const res = await client.api.clubs[':id'].$put({
                param: { id: clubId },
                json: data,
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error((err as { message?: string }).message ?? 'Failed to update club');
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clubs'] });
            queryClient.invalidateQueries({ queryKey: ['clubs', clubId] });
        },
    });
}

export function useDeleteClub() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (clubId: string) => {
            const res = await client.api.clubs[':id'].$delete({
                param: { id: clubId },
            });
            if (!res.ok) throw new Error('Failed to delete club');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clubs'] });
        },
    });
}

export function useAddClubMember(clubId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: AddClubMemberData) => {
            const res = await client.api.clubs[':id'].members.$post({
                param: { id: clubId },
                json: data,
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error((err as { message?: string }).message ?? 'Failed to add member');
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clubs', clubId] });
        },
    });
}

export function useRemoveClubMember(clubId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (userId: string) => {
            const res = await client.api.clubs[':id'].members[':userId'].$delete({
                param: { id: clubId, userId },
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error((err as { message?: string }).message ?? 'Failed to remove member');
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clubs', clubId] });
            queryClient.invalidateQueries({ queryKey: ['clubs'] });
        },
    });
}
