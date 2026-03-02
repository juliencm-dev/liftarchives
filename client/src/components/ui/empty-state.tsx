import { type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateAction {
    label: string;
    icon?: LucideIcon;
    onClick: () => void;
}

interface EmptyStateProps {
    icon: LucideIcon;
    heading: string;
    subheading?: string;
    action?: EmptyStateAction;
    className?: string;
}

export function EmptyState({ icon: Icon, heading, subheading, action, className }: EmptyStateProps) {
    return (
        <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
            <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-secondary">
                <Icon className="size-7 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">{heading}</h3>
            {subheading && <p className="mt-1 max-w-xs text-sm text-muted-foreground">{subheading}</p>}
            {action && (
                <Button onClick={action.onClick} className="mt-6 gap-2">
                    {action.icon && <action.icon className="size-4" />}
                    {action.label}
                </Button>
            )}
        </div>
    );
}
