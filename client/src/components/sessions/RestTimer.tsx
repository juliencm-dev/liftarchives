import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Pause, Play, SkipForward } from 'lucide-react';
import { useRestTimer } from '@/hooks/use-rest-timer';
import { useTrainingSettings } from '@/hooks/use-training-settings';

interface RestTimerProps {
    show: boolean;
    onClose: () => void;
}

export function RestTimer({ show, onClose }: RestTimerProps) {
    const { data: settings } = useTrainingSettings();
    const defaultRest = settings?.defaultRestSeconds ?? 120;

    const timer = useRestTimer({
        defaultDuration: defaultRest,
        onComplete: onClose,
    });

    useEffect(() => {
        if (show) {
            timer.start(defaultRest);
        }
    }, [show]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!show) return null;

    const minutes = Math.floor(timer.remaining / 60);
    const seconds = timer.remaining % 60;

    // SVG ring dimensions
    const size = 120;
    const strokeWidth = 6;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference * (1 - timer.progress);

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="relative flex flex-col items-center gap-6 rounded-2xl border border-border/60 bg-card p-8 shadow-lg">
                <Button variant="ghost" size="sm" className="absolute right-3 top-3 size-8 p-0" onClick={onClose}>
                    <X className="size-4" />
                </Button>

                <p className="text-sm font-medium text-muted-foreground">Rest Timer</p>

                {/* Countdown ring */}
                <div className="relative flex items-center justify-center">
                    <svg width={size} height={size} className="-rotate-90">
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke="hsl(var(--border))"
                            strokeWidth={strokeWidth}
                        />
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke="hsl(var(--primary))"
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={dashOffset}
                            className="transition-all duration-1000 ease-linear"
                        />
                    </svg>
                    <span className="absolute font-mono text-2xl font-bold text-foreground">
                        {minutes}:{seconds.toString().padStart(2, '0')}
                    </span>
                </div>

                {/* Controls */}
                <div className="flex gap-3">
                    {timer.isRunning ? (
                        <Button variant="outline" size="sm" className="gap-1.5" onClick={timer.pause}>
                            <Pause className="size-3.5" />
                            Pause
                        </Button>
                    ) : (
                        <Button variant="outline" size="sm" className="gap-1.5" onClick={timer.resume}>
                            <Play className="size-3.5" />
                            Resume
                        </Button>
                    )}
                    <Button
                        size="sm"
                        className="gap-1.5"
                        onClick={() => {
                            timer.skip();
                            onClose();
                        }}
                    >
                        <SkipForward className="size-3.5" />
                        Skip
                    </Button>
                </div>
            </div>
        </div>
    );
}
