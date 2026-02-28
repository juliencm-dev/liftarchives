import type { LucideIcon } from 'lucide-react';

interface DashboardStatCardProps {
    label: string;
    value: string;
    icon: LucideIcon;
}

export function DashboardStatCard({ label, value, icon: Icon }: DashboardStatCardProps) {
    return (
        <div className="group relative flex min-w-0 items-center gap-3 overflow-hidden rounded-xl border border-border/60 bg-card p-3 transition-all hover:border-primary/30 hover:bg-card/80 md:flex-col md:items-stretch md:gap-3 md:p-4">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 md:size-10">
                <Icon className="size-4 text-primary md:size-5" />
            </div>
            <div className="flex min-w-0 flex-1 items-center justify-between md:block">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
                <p className="truncate text-base font-bold tabular-nums tracking-tight text-foreground md:mt-1 md:text-2xl">
                    {value}
                </p>
            </div>
        </div>
    );
}
