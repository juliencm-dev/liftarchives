import { CalendarDays, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProgramsEmptyStateProps {
    onCreateProgram: () => void;
}

export function ProgramsEmptyState({ onCreateProgram }: ProgramsEmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-secondary">
                <CalendarDays className="size-7 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No programs yet</h3>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                Create your first training program to get started
            </p>
            <Button onClick={onCreateProgram} className="mt-6 gap-2">
                <Plus className="size-4" />
                Create Program
            </Button>
        </div>
    );
}
