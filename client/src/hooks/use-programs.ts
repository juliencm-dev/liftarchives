import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { programsQueryOptions, programQueryOptions, activeProgramQueryOptions } from '@/lib/queries';
import type { CreateProgramData, UpdateProgramData, AssignProgramData } from '@liftarchives/shared';

export function usePrograms() {
    return useQuery(programsQueryOptions);
}

export function useProgram(id: string | undefined) {
    return useQuery({
        ...programQueryOptions(id!),
        enabled: !!id,
    });
}

export function useActiveProgram() {
    return useQuery(activeProgramQueryOptions);
}

export function useCreateProgram() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: CreateProgramData) => {
            const res = await client.api.programs.$post({ json: data });
            if (!res.ok) throw new Error('Failed to create program');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['programs'] });
        },
    });
}

export function useUpdateProgram(id: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: UpdateProgramData) => {
            const res = await client.api.programs[':id'].$put({
                param: { id },
                json: data,
            });
            if (!res.ok) throw new Error('Failed to update program');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['programs'] });
        },
    });
}

export function useDeleteProgram() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await client.api.programs[':id'].$delete({
                param: { id },
            });
            if (!res.ok) throw new Error('Failed to delete program');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['programs'] });
        },
    });
}

export function useAssignProgram() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: AssignProgramData) => {
            const res = await client.api.programs.assign.$post({ json: data });
            if (!res.ok) throw new Error('Failed to assign program');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['programs'] });
        },
    });
}

export function useCompleteDay() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (programDayId: string) => {
            const res = await client.api.programs.active['complete-day'].$post({
                json: { programDayId },
            });
            if (!res.ok) throw new Error('Failed to complete day');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['programs', 'active'] });
        },
    });
}

export function useUnassignProgram() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (programId: string) => {
            const res = await client.api.programs.unassign[':id'].$post({
                param: { id: programId },
            });
            if (!res.ok) throw new Error('Failed to unassign program');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['programs'] });
        },
    });
}
