import { useState } from 'react';
import { BackToDashboard } from '@/components/layout/BackToDashboard';
import { Button } from '@/components/ui/button';
import { ProgramCard } from '@/components/programs/ProgramCard';
import { ProgramsEmptyState } from '@/components/programs/ProgramsEmptyState';
import { ProgramWizard } from '@/components/programs/wizard/ProgramWizard';
import type { WizardDay, WeekBlocks } from '@/components/programs/wizard/ProgramWizard';
import { serverProgramToWizardData } from '@/components/programs/wizard/transforms';
import {
    usePrograms,
    useProgram,
    useActiveProgram,
    useAssignProgram,
    useUnassignProgram,
    useDeleteProgram,
} from '@/hooks/use-programs';
import type { ProgramResponse } from '@liftarchives/shared';
import { Plus, Loader2 } from 'lucide-react';

export function ProgramsPage() {
    const { data: programs, isLoading } = usePrograms();
    const { data: activeData } = useActiveProgram();
    const assignProgram = useAssignProgram();
    const unassignProgram = useUnassignProgram();
    const deleteProgramMutation = useDeleteProgram();

    const [wizardOpen, setWizardOpen] = useState(false);
    const [editData, setEditData] = useState<
        | {
              id: string;
              name: string;
              description: string;
              days: WizardDay[];
              weekBlocks: WeekBlocks[];
          }
        | undefined
    >(undefined);
    const [editProgramId, setEditProgramId] = useState<string | undefined>(undefined);

    // Fetch full program data when editing
    const { data: editProgram } = useProgram(editProgramId);

    const activeProgramId = activeData?.assignment?.programId;

    const handleEdit = (programId: string) => {
        setEditProgramId(programId);
    };

    // When editProgram data loads, transform and open wizard
    if (editProgramId && editProgram && !wizardOpen && !editData) {
        const transformed = serverProgramToWizardData(editProgram as ProgramResponse);
        setEditData(transformed);
        setWizardOpen(true);
        setEditProgramId(undefined);
    }

    const handleCloseWizard = () => {
        setWizardOpen(false);
        setEditData(undefined);
    };

    if (wizardOpen) {
        return (
            <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
                <ProgramWizard onClose={handleCloseWizard} initialData={editData} />
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
            <BackToDashboard />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Programs</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Create and manage your training programs</p>
                </div>
                <Button className="gap-2" onClick={() => setWizardOpen(true)}>
                    <Plus className="size-4" />
                    New Program
                </Button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="size-6 animate-spin text-muted-foreground" />
                </div>
            ) : !programs || programs.length === 0 ? (
                <ProgramsEmptyState onCreateProgram={() => setWizardOpen(true)} />
            ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {programs.map((program) => (
                        <ProgramCard
                            key={program.id}
                            program={program}
                            isActive={program.id === activeProgramId}
                            onEdit={() => handleEdit(program.id)}
                            onActivate={() => assignProgram.mutate({ programId: program.id })}
                            onDeactivate={() => unassignProgram.mutate(program.id)}
                            onDelete={() => deleteProgramMutation.mutate(program.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
