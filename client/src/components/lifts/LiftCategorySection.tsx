import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface LiftCategorySectionProps {
    title: string;
    description?: string;
    icon: ReactNode;
    accentClass?: string;
    children: ReactNode;
}

export function LiftCategorySection({
    title,
    description,
    icon,
    accentClass = 'text-primary',
    children,
}: LiftCategorySectionProps) {
    return (
        <section className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
                <div
                    className={cn(
                        'flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary',
                        accentClass
                    )}
                >
                    {icon}
                </div>
                <div className="flex flex-col">
                    <h2 className="text-base font-semibold text-foreground">{title}</h2>
                    {description && <p className="text-xs text-muted-foreground">{description}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
        </section>
    );
}
