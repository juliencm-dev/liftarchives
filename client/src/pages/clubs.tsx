import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { BackToDashboard } from '@/components/layout/BackToDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useUserClubs, useCreateClub } from '@/hooks/use-clubs';
import { EmptyState } from '@/components/ui/empty-state';
import { Building2, Plus, Users, Loader2, MapPin } from 'lucide-react';

export function ClubsPage() {
    const { data: clubs, isLoading } = useUserClubs();
    const createClub = useCreateClub();

    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');

    const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name.trim()) return;
        createClub.mutate(
            {
                name: name.trim(),
                location: location.trim() || undefined,
                description: description.trim() || undefined,
            },
            {
                onSuccess: () => {
                    setName('');
                    setLocation('');
                    setDescription('');
                    setShowForm(false);
                },
            }
        );
    };

    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
            <BackToDashboard />

            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Clubs</h1>
                {clubs && clubs.length > 0 && (
                    <Button className="gap-2" onClick={() => setShowForm(!showForm)}>
                        <Plus className="size-4" />
                        <span className="hidden sm:inline">New Club</span>
                    </Button>
                )}
            </div>

            {showForm && (
                <Card className="mb-6">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Create Club</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="club-name">Name</Label>
                                <Input
                                    id="club-name"
                                    placeholder="Club name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="club-location">Location (optional)</Label>
                                <Input
                                    id="club-location"
                                    placeholder="City, Country"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="club-description">Description (optional)</Label>
                                <Textarea
                                    id="club-description"
                                    placeholder="Tell people about your club"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" disabled={createClub.isPending || !name.trim()}>
                                    {createClub.isPending ? <Loader2 className="size-4 animate-spin" /> : 'Create'}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                    Cancel
                                </Button>
                            </div>
                            {createClub.isError && (
                                <p className="text-sm text-destructive">{createClub.error.message}</p>
                            )}
                        </form>
                    </CardContent>
                </Card>
            )}

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="size-8 animate-spin text-primary" />
                </div>
            ) : !clubs || clubs.length === 0 ? (
                <EmptyState
                    icon={Building2}
                    heading="No clubs yet"
                    subheading="Create a club to start training together"
                    action={{ label: 'Create Club', icon: Plus, onClick: () => setShowForm(true) }}
                />
            ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {clubs.map((club) => (
                        <Link key={club.id} to="/clubs/$clubId" params={{ clubId: club.id }}>
                            <Card className="transition-colors hover:border-primary/50">
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="min-w-0 flex-1">
                                            <h3 className="truncate font-semibold text-foreground">{club.name}</h3>
                                            {club.location && (
                                                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                                                    <MapPin className="size-3" />
                                                    {club.location}
                                                </p>
                                            )}
                                            {club.description && (
                                                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                                                    {club.description}
                                                </p>
                                            )}
                                        </div>
                                        <Badge variant="outline" className="ml-2 shrink-0">
                                            {club.userRole}
                                        </Badge>
                                    </div>
                                    <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                                        <Users className="size-3" />
                                        {club.memberCount} member{club.memberCount !== 1 ? 's' : ''}
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
