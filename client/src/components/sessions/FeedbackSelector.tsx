import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThumbsDown, Minus, ThumbsUp } from 'lucide-react';

interface FeedbackSelectorProps {
    value: 'hard' | 'normal' | 'easy' | null;
    onChange: (feedback: 'hard' | 'normal' | 'easy' | null) => void;
    disabled?: boolean;
}

const options = [
    {
        key: 'hard' as const,
        icon: ThumbsDown,
        label: 'Hard',
        activeColor: 'text-destructive border-destructive/30 bg-destructive/10 hover:bg-destructive/10',
    },
    {
        key: 'normal' as const,
        icon: Minus,
        label: 'Normal',
        activeColor: 'text-muted-foreground border-border bg-secondary/50 hover:bg-secondary/50',
    },
    {
        key: 'easy' as const,
        icon: ThumbsUp,
        label: 'Easy',
        activeColor: 'text-green-500 border-green-500/30 bg-green-500/10 hover:bg-green-500/10',
    },
];

export function FeedbackSelector({ value, onChange, disabled }: FeedbackSelectorProps) {
    return (
        <div className="mt-6 px-4">
            <p className="mb-2.5 text-center text-xs text-muted-foreground">How hard was that?</p>
            <div className="grid grid-cols-3 gap-2">
                {options.map(({ key, icon: Icon, label, activeColor }) => (
                    <Button
                        key={key}
                        variant="outline"
                        onClick={() => onChange(value === key ? null : key)}
                        disabled={disabled}
                        className={cn(
                            'rounded-xl py-2.5 text-sm font-medium',
                            value === key
                                ? activeColor
                                : 'border-border/50 bg-transparent text-muted-foreground/60 hover:border-border hover:text-muted-foreground'
                        )}
                    >
                        <Icon className="size-4" />
                        {label}
                    </Button>
                ))}
            </div>
        </div>
    );
}
