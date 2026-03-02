import { useMutation } from '@tanstack/react-query';
import type { ProgramDraft } from '@liftarchives/shared';

const API_URL = import.meta.env.PROD ? import.meta.env.VITE_API_URL : 'http://localhost:4000';

export function useProgramExtract() {
    return useMutation({
        mutationFn: async (file: File): Promise<ProgramDraft> => {
            const form = new FormData();
            form.append('image', file);

            const res = await fetch(`${API_URL}/api/agent/extract`, {
                method: 'POST',
                credentials: 'include',
                body: form,
            });

            if (!res.ok) {
                const err = await res.json().catch(() => null);
                throw new Error(err?.message ?? 'Failed to extract program from image');
            }

            const json = await res.json();
            return json.data as ProgramDraft;
        },
    });
}
