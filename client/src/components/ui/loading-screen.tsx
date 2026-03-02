import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const PHRASES = [
    'Loading the gains...',
    'Warming up the barbell...',
    'Chalking up...',
    'Finding your one-rep max...',
    'Stretching the hamstrings...',
    'Re-racking the weights...',
    'Checking the mirror...',
    'Adjusting the belt...',
    'Rolling out the knots...',
    'Counting the plates...',
    'Ignoring the cardio section...',
    'Waiting for the squat rack...',
    'Pretending to read the program...',
    'Foam rolling aggressively...',
    'Adding 2.5 lbs to the bar...',
    'Debating sumo vs conventional...',
    'Refilling the water bottle...',
    'Looking for the other 20 kg plate...',
    'Slamming a pre-workout...',
    'Questioning life choices mid-set...',
];

function getRandomPhrase(current: string): string {
    let next = current;
    while (next === current) {
        next = PHRASES[Math.floor(Math.random() * PHRASES.length)];
    }
    return next;
}

interface LoadingScreenProps {
    className?: string;
}

export function LoadingScreen({ className }: LoadingScreenProps) {
    const [phrase, setPhrase] = useState(() => PHRASES[Math.floor(Math.random() * PHRASES.length)]);

    useEffect(() => {
        const id = setInterval(() => {
            setPhrase((prev) => getRandomPhrase(prev));
        }, 3000);
        return () => clearInterval(id);
    }, []);

    return (
        <div className={cn('flex min-h-dvh flex-col items-center justify-center gap-4 bg-background', className)}>
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="animate-pulse text-sm text-muted-foreground">{phrase}</p>
        </div>
    );
}
