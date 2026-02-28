import { useState } from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CollapsibleCardProps {
    icon: React.ReactNode;
    title: React.ReactNode;
    defaultOpen?: boolean;
    children: React.ReactNode;
}

export function CollapsibleCard({ icon, title, defaultOpen = false, children }: CollapsibleCardProps) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <Collapsible.Root open={open} onOpenChange={setOpen}>
            <div className="rounded-xl border border-border/60 bg-card">
                <Collapsible.Trigger asChild>
                    <button className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-secondary/30">
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                            {icon}
                            {title}
                        </div>
                        <ChevronDown
                            className={cn(
                                'size-4 text-muted-foreground transition-transform duration-200',
                                open && 'rotate-180'
                            )}
                        />
                    </button>
                </Collapsible.Trigger>
                <Collapsible.Content className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
                    <div className="border-t border-border/40 px-6 pb-6 pt-4">{children}</div>
                </Collapsible.Content>
            </div>
        </Collapsible.Root>
    );
}
