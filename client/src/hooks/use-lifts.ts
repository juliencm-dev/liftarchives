import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import {
    liftsQueryOptions,
    personalRecordsQueryOptions,
    bestRecordsQueryOptions,
    recentRecordsQueryOptions,
} from '@/lib/queries';
import type { AddPersonalRecordData, CreateLiftData } from '@liftarchives/shared';

export function useLifts() {
    return useQuery(liftsQueryOptions);
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
    return useQuery(personalRecordsQueryOptions(liftId));
}

export function useBestRecords() {
    return useQuery(bestRecordsQueryOptions);
}

export function useRecentRecords() {
    return useQuery(recentRecordsQueryOptions);
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
