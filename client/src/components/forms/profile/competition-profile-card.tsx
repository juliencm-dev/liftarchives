import { Trophy, User, Building2, Weight, Target, Loader2 } from 'lucide-react';

import { useCompetitionProfile } from '@/hooks/use-profile';
import { CollapsibleCard } from '@/components/ui/collapsible-card';
import { Label } from '@/components/ui/label';

function InfoRow({
    icon,
    label,
    value,
    highlight,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | null;
    highlight?: boolean;
}) {
    return (
        <div className="flex items-center justify-between rounded-lg bg-secondary/30 px-3 py-2.5">
            <div className="flex items-center gap-2">
                {icon}
                <Label className="text-sm text-muted-foreground">{label}</Label>
            </div>
            <span className={`text-sm font-medium ${highlight ? 'text-primary' : 'text-foreground'}`}>
                {value ?? '—'}
            </span>
        </div>
    );
}

export function ChangeCompetitionProfile() {
    const { data: profile, isLoading } = useCompetitionProfile();

    if (isLoading) {
        return (
            <CollapsibleCard icon={<Trophy className="size-4 text-primary" />} title="Competition Profile">
                <div className="flex items-center justify-center py-6">
                    <Loader2 className="size-5 animate-spin text-muted-foreground" />
                </div>
            </CollapsibleCard>
        );
    }

    if (!profile) {
        return (
            <CollapsibleCard icon={<Trophy className="size-4 text-primary" />} title="Competition Profile">
                <div className="flex flex-col items-center gap-2 py-4 text-center">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                        <Trophy className="size-5 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Set up your lifter profile first to see your competition details.
                    </p>
                </div>
            </CollapsibleCard>
        );
    }

    const unit = profile.liftUnit ?? 'kg';

    // Determine which total to show and whether they qualify
    const currentTotal = profile.competitionTotal ?? profile.trainingBestTotal;
    const isCompetitionTotal = profile.competitionTotal !== null;
    const qualifyingTotal = profile.category?.qualifyingTotal ?? null;
    const isQualified = currentTotal !== null && qualifyingTotal !== null && currentTotal >= qualifyingTotal;

    return (
        <CollapsibleCard icon={<Trophy className="size-4 text-primary" />} title="Competition Profile" defaultOpen>
            <div className="flex flex-col gap-2">
                <InfoRow
                    icon={<User className="size-3.5 text-muted-foreground" />}
                    label="Coach"
                    value={profile.coachName}
                />
                <InfoRow
                    icon={<Building2 className="size-3.5 text-muted-foreground" />}
                    label="Club"
                    value={profile.clubName}
                />
                <InfoRow
                    icon={<Weight className="size-3.5 text-muted-foreground" />}
                    label="Category"
                    value={profile.category?.name ?? null}
                />

                {qualifyingTotal !== null && (
                    <InfoRow
                        icon={<Target className="size-3.5 text-muted-foreground" />}
                        label="Qualifying Total"
                        value={`${qualifyingTotal} ${unit}`}
                        highlight={isQualified}
                    />
                )}

                <InfoRow
                    icon={<Trophy className="size-3.5 text-muted-foreground" />}
                    label={isCompetitionTotal ? 'Competition Total' : 'Training Best Total'}
                    value={currentTotal !== null ? `${currentTotal} ${unit}` : null}
                    highlight={isQualified}
                />

                {currentTotal !== null && qualifyingTotal !== null && !isQualified && (
                    <div className="mt-1 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-center">
                        <p className="text-xs text-muted-foreground">
                            <span className="font-medium text-primary">
                                {qualifyingTotal - currentTotal} {unit}
                            </span>{' '}
                            needed to qualify
                        </p>
                    </div>
                )}
            </div>
        </CollapsibleCard>
    );
}
