import { useLifterInvites, useAcceptInvite, useDeclineInvite } from '@/hooks/use-coach';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCheck, X, Loader2 } from 'lucide-react';

export function CoachInviteBanner() {
    const { data: invites } = useLifterInvites();
    const acceptInvite = useAcceptInvite();
    const declineInvite = useDeclineInvite();

    if (!invites || invites.length === 0) return null;

    return (
        <div className="mb-4 space-y-2">
            {invites.map((invite) => (
                <Card key={invite.id} className="border-primary/30 bg-primary/5">
                    <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <UserCheck className="size-5 text-primary" />
                            <div>
                                <p className="text-sm font-medium">Coach Invitation</p>
                                <p className="text-xs text-muted-foreground">
                                    <span className="font-medium text-foreground">{invite.coach.user.name}</span> wants
                                    to coach you
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                onClick={() => acceptInvite.mutate(invite.id)}
                                disabled={acceptInvite.isPending || declineInvite.isPending}
                            >
                                {acceptInvite.isPending ? <Loader2 className="size-3 animate-spin" /> : 'Accept'}
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => declineInvite.mutate(invite.id)}
                                disabled={acceptInvite.isPending || declineInvite.isPending}
                            >
                                <X className="size-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
