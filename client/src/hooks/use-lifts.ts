import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import type { AddPersonalRecordData, CreateLiftData } from '@liftarchives/shared';

export function useLifts() {
    return useQuery({
        queryKey: ['lifts'],
        queryFn: async () => {
            const res = await client.api.lifts.$get();
            if (!res.ok) throw new Error('Failed to fetch lifts');
            const data = await res.json();
            return data.lifts;
        },
    });
}

export function useAllLifts() {
    return useQuery({
        queryKey: ['lifts', 'all'],
        queryFn: async () => {
            const res = await client.api.lifts.all.$get();
            if (!res.ok) throw new Error('Failed to fetch all lifts');
            const data = await res.json();
            return data.lifts;
        },
    });
}

export function usePersonalRecords(liftId?: string) {
    return useQuery({
        queryKey: ['personalRecords', liftId],
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

export function useBestRecords() {
    return useQuery({
        queryKey: ['personalRecords', 'best'],
        queryFn: async () => {
            const res = await client.api.lifts.records.best.$get();
            if (!res.ok) throw new Error('Failed to fetch best records');
            const data = await res.json();
            return data.records;
        },
    });
}

export function useRecentRecords() {
    return useQuery({
        queryKey: ['personalRecords', 'recent'],
        queryFn: async () => {
            const res = await client.api.lifts.records.recent.$get();
            if (!res.ok) throw new Error('Failed to fetch recent records');
            const data = await res.json();
            return data.records;
        },
    });
}

export function useAddPersonalRecord() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: AddPersonalRecordData) => {
            const res = await client.api.lifts.records.$post({ json: data });
            if (!res.ok) throw new Error('Failed to add record');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['personalRecords'] });
        },
    });
}

export function useCreateLift() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: CreateLiftData) => {
            const res = await client.api.lifts.$post({ json: data });
            if (!res.ok) throw new Error('Failed to create lift');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lifts'] });
        },
    });
}

export function useDeletePersonalRecord() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (recordId: string) => {
            const res = await client.api.lifts.records[':id'].$delete({
                param: { id: recordId },
            });
            if (!res.ok) throw new Error('Failed to delete record');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['personalRecords'] });
        },
    });
}
