import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/contexts/AuthContext';
import { BackToDashboard } from '@/components/layout/BackToDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useClubDetail, useUpdateClub, useDeleteClub, useAddClubMember, useRemoveClubMember } from '@/hooks/use-clubs';
import { Building2, Users, Loader2, MapPin, Pencil, Trash2, UserPlus, UserMinus, Save, X } from 'lucide-react';

export function ClubDetailPage() {
    const { clubId } = useParams({ strict: false }) as { clubId: string };
    const navigate = useNavigate();
    const { user } = useAuth();
    const { data: club, isLoading } = useClubDetail(clubId);
    const updateClub = useUpdateClub(clubId);
    const deleteClub = useDeleteClub();
    const addMember = useAddClubMember(clubId);
    const removeMember = useRemoveClubMember(clubId);

    const [editing, setEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editLocation, setEditLocation] = useState('');
    const [editDescription, setEditDescription] = useState('');

    const [addUserId, setAddUserId] = useState('');

    const isClubOwner = !!user && !!club && club.ownerId === user.id;

    const startEditing = () => {
        if (!club) return;
        setEditName(club.name);
        setEditLocation(club.location ?? '');
        setEditDescription(club.description ?? '');
        setEditing(true);
    };

    const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        updateClub.mutate(
            {
                name: editName.trim() || undefined,
                location: editLocation.trim() || undefined,
                description: editDescription.trim() || undefined,
            },
            { onSuccess: () => setEditing(false) }
        );
    };

    const handleDelete = () => {
        if (!confirm('Are you sure you want to delete this club? This cannot be undone.')) return;
        deleteClub.mutate(clubId, {
            onSuccess: () => navigate({ to: '/clubs' }),
        });
    };

    const handleAddMember = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!addUserId.trim()) return;
        addMember.mutate({ userId: addUserId.trim(), role: 'member' }, { onSuccess: () => setAddUserId('') });
    };

    if (isLoading) {
        return (
            <div className="flex min-h-[50dvh] items-center justify-center">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!club) {
        return (
            <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
                <BackToDashboard />
                <p className="py-12 text-center text-muted-foreground">Club not found</p>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
            <BackToDashboard />

            {/* Club Info */}
            <Card className="mb-6">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <Building2 className="size-6 text-primary" />
                            {editing ? (
                                <span className="text-lg font-semibold">Edit Club</span>
                            ) : (
                                <div>
                                    <CardTitle className="text-xl">{club.name}</CardTitle>
                                    {club.location && (
                                        <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
                                            <MapPin className="size-3" />
                                            {club.location}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                        {isClubOwner && !editing && (
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={startEditing}>
                                    <Pencil className="size-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:text-destructive"
                                    onClick={handleDelete}
                                    disabled={deleteClub.isPending}
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    {editing ? (
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Name</Label>
                                <Input
                                    id="edit-name"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-location">Location</Label>
                                <Input
                                    id="edit-location"
                                    value={editLocation}
                                    onChange={(e) => setEditLocation(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-description">Description</Label>
                                <Textarea
                                    id="edit-description"
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    rows={3}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" disabled={updateClub.isPending}>
                                    {updateClub.isPending ? (
                                        <Loader2 className="size-4 animate-spin" />
                                    ) : (
                                        <>
                                            <Save className="mr-1 size-4" />
                                            Save
                                        </>
                                    )}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setEditing(false)}>
                                    <X className="mr-1 size-4" />
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <>
                            {club.description && <p className="text-sm text-muted-foreground">{club.description}</p>}
                            <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Users className="size-4" />
                                    {club.memberships.length} member{club.memberships.length !== 1 ? 's' : ''}
                                </span>
                                <span>Owner: {club.owner.name}</span>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Add Member (owner only) */}
            {isClubOwner && (
                <Card className="mb-4">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <UserPlus className="size-4" />
                            Add Member
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddMember} className="flex gap-2">
                            <Input
                                placeholder="User ID"
                                value={addUserId}
                                onChange={(e) => setAddUserId(e.target.value)}
                                className="flex-1"
                            />
                            <Button type="submit" disabled={addMember.isPending || !addUserId.trim()}>
                                {addMember.isPending ? <Loader2 className="size-4 animate-spin" /> : 'Add'}
                            </Button>
                        </form>
                        {addMember.isError && (
                            <p className="mt-2 text-sm text-destructive">{addMember.error.message}</p>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Members List */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Users className="size-4" />
                        Members
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {club.memberships.map((membership) => (
                            <div
                                key={membership.id}
                                className="flex items-center justify-between rounded-lg border p-3"
                            >
                                <div>
                                    <p className="font-medium text-foreground">{membership.user.name}</p>
                                    <p className="text-xs text-muted-foreground">{membership.user.email}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant={membership.role === 'owner' ? 'default' : 'outline'}>
                                        {membership.role}
                                    </Badge>
                                    {isClubOwner && membership.role !== 'owner' && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-muted-foreground hover:text-destructive"
                                            onClick={() => removeMember.mutate(membership.user.id)}
                                            disabled={removeMember.isPending}
                                        >
                                            <UserMinus className="size-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
