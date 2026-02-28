import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { updateUser, changePassword } from '@/lib/auth';
import type { LifterProfileData, UpdateCoachProfileData } from '@liftarchives/shared';

export function useLifterProfile() {
    return useQuery({
        queryKey: ['lifterProfile'],
        queryFn: async () => {
            const res = await client.api.profile.lifter.$get();
            if (!res.ok) throw new Error('Failed to fetch lifter profile');
            const data = await res.json();
            return data.profile;
        },
    });
}

export function useCreateLifterProfile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: LifterProfileData) => {
            const res = await client.api.profile.lifter.$post({ json: data });
            if (!res.ok) throw new Error('Failed to create lifter profile');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lifterProfile'] });
        },
    });
}

export function useUpdateLifterProfile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: LifterProfileData) => {
            const res = await client.api.profile.lifter.$put({ json: data });
            if (!res.ok) throw new Error('Failed to update lifter profile');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lifterProfile'] });
        },
    });
}

export function useCoachProfile() {
    return useQuery({
        queryKey: ['coachProfile'],
        queryFn: async () => {
            const res = await client.api.profile.coach.$get();
            if (!res.ok) throw new Error('Failed to fetch coach profile');
            const data = await res.json();
            return data.profile;
        },
    });
}

export function useUpdateCoachProfile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: UpdateCoachProfileData) => {
            const res = await client.api.profile.coach.$put({ json: data });
            if (!res.ok) throw new Error('Failed to update coach profile');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['coachProfile'] });
        },
    });
}

export function useCompetitionProfile() {
    return useQuery({
        queryKey: ['competitionProfile'],
        queryFn: async () => {
            const res = await client.api.profile.competition.$get();
            if (!res.ok) throw new Error('Failed to fetch competition profile');
            const data = await res.json();
            return data.profile;
        },
    });
}

export function useUpdateAccount() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: { name: string }) => {
            const { error } = await updateUser({ name: data.name });
            if (error) throw new Error(error.message || 'Failed to update account');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        },
    });
}

export function useChangePassword() {
    return useMutation({
        mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
            const { error } = await changePassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            });
            if (error) throw new Error(error.message || 'Failed to change password');
        },
    });
}
