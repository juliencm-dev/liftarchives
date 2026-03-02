import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { updateUser } from '@/lib/auth';

export function useAvatarUpload() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ file }: { file: File }) => {
            // 1. Get presigned URL from server
            const res = await client.api.avatar['presigned-url'].$post({
                json: {
                    contentType: file.type as 'image/jpeg' | 'image/png' | 'image/webp',
                    fileSize: file.size,
                },
            });

            if (!res.ok) throw new Error('Failed to get upload URL');
            const { presignedUrl, publicUrl } = await res.json();

            // 2. Upload file directly to R2
            const uploadRes = await fetch(presignedUrl, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': file.type,
                },
            });

            if (!uploadRes.ok) throw new Error('Failed to upload file');

            // 3. Update user image via better-auth
            const { error } = await updateUser({ image: publicUrl });
            if (error) throw new Error(error.message || 'Failed to update avatar');

            return publicUrl;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        },
    });
}
