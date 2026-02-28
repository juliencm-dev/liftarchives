import { cn } from '@/lib/utils';
import { ThumbsDown, Minus, ThumbsUp } from 'lucide-react';

interface FeedbackSelectorProps {
    value: 'hard' | 'normal' | 'easy' | null;
    onChange: (feedback: 'hard' | 'normal' | 'easy') => void;
    disabled?: boolean;
}

const options = [
    {
        value: 'hard' as const,
        label: 'Hard',
        icon: ThumbsDown,
        color: 'text-red-400 bg-red-400/10 border-red-400/30',
        activeRing: 'ring-red-400/40',
    },
    {
        value: 'normal' as const,
        label: 'Normal',
        icon: Minus,
        color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
        activeRing: 'ring-yellow-400/40',
    },
    {
        value: 'easy' as const,
        label: 'Easy',
        icon: ThumbsUp,
        color: 'text-green-400 bg-green-400/10 border-green-400/30',
        activeRing: 'ring-green-400/40',
    },
];

export function FeedbackSelector({ value, onChange, disabled }: FeedbackSelectorProps) {
    return (
        <div className="flex flex-col items-center gap-3">
            <p className="text-sm font-medium text-muted-foreground">How hard was that?</p>
            <div className="flex gap-3">
                {options.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = value === opt.value;
                    return (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => onChange(opt.value)}
                            disabled={disabled}
                            className={cn(
                                'flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-all',
                                isSelected
                                    ? `${opt.color} ring-2 ${opt.activeRing}`
                                    : 'border-border/60 text-muted-foreground hover:border-border hover:text-foreground',
                                disabled && 'opacity-50 cursor-not-allowed'
                            )}
                        >
                            <Icon className="size-4" />
                            {opt.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
