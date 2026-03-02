import { CalendarDays, Plus } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';

interface ProgramsEmptyStateProps {
    onCreateProgram: () => void;
}

export function ProgramsEmptyState({ onCreateProgram }: ProgramsEmptyStateProps) {
    return (
        <EmptyState
            icon={CalendarDays}
            heading="No programs yet"
            subheading="Create your first training program to get started"
            action={{ label: 'Create Program', icon: Plus, onClick: onCreateProgram }}
            className="py-24"
        />
    );
}
