import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { BackToDashboard } from '@/components/layout/BackToDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    useCoachLifters,
    useCoachInvites,
    useCoachSessions,
    useInviteLifter,
    useRemoveLifter,
} from '@/hooks/use-coach';
import { Users, Mail, Activity, Loader2, UserMinus, Send, Clock } from 'lucide-react';

export function CoachDashboardPage() {
    const { data: lifters, isLoading: liftersLoading } = useCoachLifters();
    const { data: invites } = useCoachInvites();
    const { data: sessions, isLoading: sessionsLoading } = useCoachSessions();
    const inviteLifter = useInviteLifter();
    const removeLifter = useRemoveLifter();

    const [email, setEmail] = useState('');

    const handleInvite = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email.trim()) return;
        inviteLifter.mutate(
            { lifterEmail: email.trim() },
            {
                onSuccess: () => setEmail(''),
            }
        );
    };

    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
            <BackToDashboard />

            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Coach Dashboard</h1>
                <p className="mt-1 text-sm text-muted-foreground">Manage your lifters and track their progress</p>
            </div>

            {/* Stats */}
            <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3">
                <Card>
                    <CardContent className="flex items-center gap-3 p-4">
                        <Users className="size-5 text-primary" />
                        <div>
                            <p className="text-2xl font-bold">{lifters?.length ?? 0}</p>
                            <p className="text-xs text-muted-foreground">Lifters</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center gap-3 p-4">
                        <Mail className="size-5 text-primary" />
                        <div>
                            <p className="text-2xl font-bold">{invites?.length ?? 0}</p>
                            <p className="text-xs text-muted-foreground">Pending Invites</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-2 md:col-span-1">
                    <CardContent className="flex items-center gap-3 p-4">
                        <Activity className="size-5 text-primary" />
                        <div>
                            <p className="text-2xl font-bold">{sessions?.length ?? 0}</p>
                            <p className="text-xs text-muted-foreground">Recent Sessions</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                {/* Invite Lifter */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Send className="size-4" />
                            Invite Lifter
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleInvite} className="flex gap-2">
                            <Input
                                type="email"
                                placeholder="lifter@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1"
                            />
                            <Button type="submit" disabled={inviteLifter.isPending || !email.trim()}>
                                {inviteLifter.isPending ? <Loader2 className="size-4 animate-spin" /> : 'Invite'}
                            </Button>
                        </form>
                        {inviteLifter.isError && (
                            <p className="mt-2 text-sm text-destructive">{inviteLifter.error.message}</p>
                        )}
                        {inviteLifter.isSuccess && <p className="mt-2 text-sm text-primary">Invitation sent!</p>}
                    </CardContent>
                </Card>

                {/* Pending Invites */}
                {invites && invites.length > 0 && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Clock className="size-4" />
                                Pending Invites
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {invites.map((invite) => (
                                    <div
                                        key={invite.id}
                                        className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2"
                                    >
                                        <span className="text-sm">{invite.lifterEmail}</span>
                                        <Badge variant="secondary">Pending</Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Lifter Roster */}
            <Card className="mt-4">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Users className="size-4" />
                        Your Lifters
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {liftersLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="size-6 animate-spin text-primary" />
                        </div>
                    ) : !lifters || lifters.length === 0 ? (
                        <p className="py-4 text-center text-sm text-muted-foreground">
                            No lifters yet. Send an invite to get started.
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {lifters.map((entry) => (
                                <div key={entry.id} className="flex items-center justify-between rounded-lg border p-3">
                                    <Link
                                        to="/coach/lifters/$lifterId"
                                        params={{ lifterId: entry.lifterId }}
                                        className="flex-1"
                                    >
                                        <p className="font-medium text-foreground hover:text-primary">
                                            {entry.lifter.user.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">{entry.lifter.user.email}</p>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-muted-foreground hover:text-destructive"
                                        onClick={() => removeLifter.mutate(entry.lifterId)}
                                        disabled={removeLifter.isPending}
                                    >
                                        <UserMinus className="size-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Recent Sessions Feed */}
            <Card className="mt-4">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Activity className="size-4" />
                        Recent Lifter Sessions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {sessionsLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="size-6 animate-spin text-primary" />
                        </div>
                    ) : !sessions || sessions.length === 0 ? (
                        <p className="py-4 text-center text-sm text-muted-foreground">
                            No shared sessions yet. Lifters can share sessions with you from their settings.
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {sessions.slice(0, 10).map((session) => (
                                <div
                                    key={session.id}
                                    className="flex items-center justify-between rounded-lg border p-3"
                                >
                                    <div>
                                        <p className="text-sm font-medium">
                                            {session.title ?? `Session on ${session.date}`}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {session.date}
                                            {session.durationMinutes ? ` · ${session.durationMinutes} min` : ''}
                                            {' · '}
                                            {session.exercises.length} exercise
                                            {session.exercises.length !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                    <Badge variant="outline">{session.exercises.length} exercises</Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
