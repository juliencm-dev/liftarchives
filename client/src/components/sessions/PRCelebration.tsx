import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PRCelebrationProps {
    show: boolean;
    liftName: string;
    weight: number;
    reps: number;
    unit: string;
    previousBest: number | null;
    onDone: () => void;
}

export function PRCelebration({ show, liftName, weight, reps, unit, previousBest, onDone }: PRCelebrationProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (show) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
                onDone();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [show, onDone]);

    if (!visible) return null;

    return (
        <div
            className={cn(
                'fixed inset-x-4 top-20 z-50 mx-auto max-w-sm animate-in fade-in slide-in-from-top-4 duration-300',
                !show && 'animate-out fade-out slide-out-to-top-4'
            )}
        >
            <div className="flex items-center gap-3 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 shadow-lg backdrop-blur-sm">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-yellow-500/20">
                    <Trophy className="size-5 text-yellow-500" />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-bold text-yellow-500">New PR!</p>
                    <p className="text-xs text-foreground">
                        {liftName}: {weight} {unit} × {reps}
                    </p>
                    {previousBest !== null && (
                        <p className="text-xs text-muted-foreground">
                            Previous best: {previousBest} {unit}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
