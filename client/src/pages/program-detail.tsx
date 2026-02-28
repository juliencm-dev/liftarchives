import { useState } from 'react';
import { useParams, useNavigate, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

import { ProgramWizard } from '@/components/programs/wizard/ProgramWizard';
import { serverProgramToWizardData } from '@/components/programs/wizard/transforms';
import { ProgramDayCard } from '@/components/programs/ProgramDayCard';
import { DaysCarousel } from '@/components/programs/DaysCarousel';
import {
    useProgram,
    useActiveProgram,
    useAssignProgram,
    useUnassignProgram,
    useDeleteProgram,
} from '@/hooks/use-programs';
import type { ProgramResponse } from '@liftarchives/shared';
import { ArrowLeft, Loader2, Pencil, Play, Square, Trash2 } from 'lucide-react';

export function ProgramDetailPage() {
    const { programId } = useParams({ strict: false }) as { programId: string };
    const navigate = useNavigate();
    const { data: program, isLoading } = useProgram(programId);
    const { data: activeData } = useActiveProgram();
    const assignProgram = useAssignProgram();
    const unassignProgram = useUnassignProgram();
    const deleteProgramMutation = useDeleteProgram();
    const [editing, setEditing] = useState(false);

    const isActive = activeData?.assignment?.programId === programId;

    const handleDelete = async () => {
        await deleteProgramMutation.mutateAsync(programId);
        navigate({ to: '/programs' });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!program) {
        return (
            <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
                <p className="text-muted-foreground">Program not found.</p>
                <Button variant="ghost" asChild className="mt-4">
                    <Link to="/programs">Back to Programs</Link>
                </Button>
            </div>
        );
    }

    if (editing) {
        const transformed = serverProgramToWizardData(program as ProgramResponse);

        return (
            <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
                <ProgramWizard onClose={() => setEditing(false)} initialData={transformed} />
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
            <Button
                variant="ghost"
                asChild
                className="-ml-2 mb-2 h-auto w-fit gap-1.5 px-2 py-1 text-sm text-muted-foreground hover:text-foreground"
            >
                <Link to="/programs">
                    <ArrowLeft className="size-3.5" />
                    Back to Programs
                </Link>
            </Button>

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">{program.name}</h1>
                    {program.description && <p className="mt-1 text-sm text-muted-foreground">{program.description}</p>}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditing(true)}
                        className="gap-2 border-border text-foreground hover:border-primary/30"
                    >
                        <Pencil className="size-3.5" />
                        Edit
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            isActive ? unassignProgram.mutate(programId) : assignProgram.mutate({ programId })
                        }
                        className={`gap-2 ${isActive ? 'border-primary/40 bg-primary/10 text-primary hover:bg-primary/15' : 'border-border text-foreground hover:border-primary/30'}`}
                    >
                        {isActive ? <Square className="size-3.5" /> : <Play className="size-3.5" />}
                        {isActive ? 'Active' : 'Activate'}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDelete}
                        disabled={deleteProgramMutation.isPending}
                        className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10"
                    >
                        <Trash2 className="size-3.5" />
                        Delete
                    </Button>
                </div>
            </div>

            {/* Week / Day cards */}
            <div className="mt-8 space-y-8">
                {program.weeks.map((week) => (
                    <div key={week.id}>
                        {program.weeks.length > 1 && (
                            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                Week {week.weekNumber}
                            </h2>
                        )}
                        {/* Mobile: stacked column */}
                        <div className="flex flex-col gap-4 md:hidden">
                            {week.days.map((day) => (
                                <ProgramDayCard key={day.id} day={day} defaultOpen />
                            ))}
                        </div>
                        {/* Desktop: 3-wide carousel */}
                        <DaysCarousel>
                            {week.days.map((day) => (
                                <ProgramDayCard key={day.id} day={day} defaultOpen />
                            ))}
                        </DaysCarousel>
                    </div>
                ))}
            </div>
        </div>
    );
}
