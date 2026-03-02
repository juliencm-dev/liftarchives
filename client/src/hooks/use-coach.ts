import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import {
    coachLiftersQueryOptions,
    coachInvitesQueryOptions,
    coachSessionsQueryOptions,
    coachProgramsQueryOptions,
    coachLifterSessionsQueryOptions,
    coachLifterRecordsQueryOptions,
    lifterInvitesQueryOptions,
} from '@/lib/queries';
import type { InviteLifterData, AssignProgramToLifterData } from '@liftarchives/shared';

// ── Coach Queries ──

export function useCoachLifters() {
    return useQuery(coachLiftersQueryOptions);
}

export function useCoachInvites() {
    return useQuery(coachInvitesQueryOptions);
}

export function useCoachSessions() {
    return useQuery(coachSessionsQueryOptions);
}

export function useCoachPrograms() {
    return useQuery(coachProgramsQueryOptions);
}

export function useCoachLifterSessions(lifterId: string) {
    return useQuery(coachLifterSessionsQueryOptions(lifterId));
}

export function useCoachLifterRecords(lifterId: string) {
    return useQuery(coachLifterRecordsQueryOptions(lifterId));
}

// ── Lifter Queries ──

export function useLifterInvites() {
    return useQuery(lifterInvitesQueryOptions);
}

// ── Coach Mutations ──

export function useRegisterCoach() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: { bio?: string }) => {
            const res = await client.api.coach.register.$post({ json: data });
            if (!res.ok) {
                const err = await res.json();
                throw new Error((err as { message?: string }).message ?? 'Failed to register as coach');
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['coachProfile'] });
        },
    });
}

export function useInviteLifter() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: InviteLifterData) => {
            const res = await client.api.coach.invite.$post({ json: data });
            if (!res.ok) {
                const err = await res.json();
                throw new Error((err as { message?: string }).message ?? 'Failed to invite lifter');
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['coach', 'invites'] });
            queryClient.invalidateQueries({ queryKey: ['coach', 'lifters'] });
        },
    });
}

export function useRemoveLifter() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (lifterId: string) => {
            const res = await client.api.coach.lifters[':lifterId'].$delete({
                param: { lifterId },
            });
            if (!res.ok) throw new Error('Failed to remove lifter');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['coach', 'lifters'] });
        },
    });
}

export function useAssignProgramToLifter(lifterId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: AssignProgramToLifterData) => {
            const res = await client.api.coach.lifters[':lifterId']['assign-program'].$post({
                param: { lifterId },
                json: data,
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error((err as { message?: string }).message ?? 'Failed to assign program');
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['coach', 'lifters'] });
            queryClient.invalidateQueries({ queryKey: ['coach', 'lifters', lifterId] });
        },
    });
}

// ── Lifter Mutations ──

export function useAcceptInvite() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (inviteId: string) => {
            const res = await client.api.invites[':id'].accept.$post({
                param: { id: inviteId },
            });
            if (!res.ok) throw new Error('Failed to accept invite');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invites'] });
        },
    });
}

export function useDeclineInvite() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (inviteId: string) => {
            const res = await client.api.invites[':id'].decline.$post({
                param: { id: inviteId },
            });
            if (!res.ok) throw new Error('Failed to decline invite');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invites'] });
        },
    });
}
