import { Button } from '@/components/ui/button';
import { Play, Trash2, Loader2 } from 'lucide-react';
import { useActiveSession, useDiscardSession } from '@/hooks/use-sessions';
import { useNavigate } from '@tanstack/react-router';
import { clearLocalSession } from '@/lib/session-store';

export function ActiveSessionBanner() {
    const { data } = useActiveSession();
    const discardSession = useDiscardSession();
    const navigate = useNavigate();

    const session = data?.session;
    if (!session) return null;

    const elapsed = session.startedAt ? Math.round((Date.now() - new Date(session.startedAt).getTime()) / 60000) : 0;

    return (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Session in progress</p>
                <p className="text-xs text-muted-foreground">
                    {session.title ?? 'Untitled'} &middot; {elapsed} min
                </p>
            </div>
            <div className="flex gap-2">
                <Button
                    size="sm"
                    variant="destructive"
                    className="gap-1.5"
                    onClick={() => {
                        clearLocalSession();
                        discardSession.mutate(session.id);
                    }}
                    disabled={discardSession.isPending}
                >
                    {discardSession.isPending ? (
                        <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                        <Trash2 className="size-3.5" />
                    )}
                    Discard
                </Button>
                <Button size="sm" className="gap-1.5" onClick={() => navigate({ to: '/training/session' })}>
                    <Play className="size-3.5" />
                    Resume
                </Button>
            </div>
        </div>
    );
}
