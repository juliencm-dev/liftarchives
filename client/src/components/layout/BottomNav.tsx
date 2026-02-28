import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Home, Calculator, Dumbbell, TrendingUp, CalendarDays } from 'lucide-react';
import { PercentageCalculatorDialog } from '@/components/calculator/PercentageCalculator';

export function BottomNav() {
    const [calcOpen, setCalcOpen] = useState(false);

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/95 backdrop-blur-xl md:hidden">
            <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
                {/* Home */}
                <Link
                    to="/dashboard"
                    className="flex flex-1 flex-col items-center gap-1 py-2 text-muted-foreground transition-colors hover:text-foreground"
                    activeProps={{ className: 'text-primary' }}
                >
                    <Home className="size-5" />
                    <span className="text-[10px] font-medium">Home</span>
                </Link>

                {/* Calculator */}
                <button
                    onClick={() => setCalcOpen(true)}
                    className="flex flex-1 flex-col items-center gap-1 py-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                    <Calculator className="size-5" />
                    <span className="text-[10px] font-medium">Calculator</span>
                </button>

                {/* Training — central raised button */}
                <div className="flex flex-1 items-center justify-center">
                    <Link
                        to="/training"
                        className="-mt-5 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 ring-4 ring-background transition-transform hover:scale-105 active:scale-95"
                        activeProps={{ className: 'ring-primary/30' }}
                    >
                        <Dumbbell className="size-6" />
                    </Link>
                </div>

                {/* Lifts */}
                <Link
                    to="/lifts"
                    className="flex flex-1 flex-col items-center gap-1 py-2 text-muted-foreground transition-colors hover:text-foreground"
                    activeProps={{ className: 'text-primary' }}
                >
                    <TrendingUp className="size-5" />
                    <span className="text-[10px] font-medium">Lifts</span>
                </Link>

                {/* Programs */}
                <Link
                    to="/programs"
                    className="flex flex-1 flex-col items-center gap-1 py-2 text-muted-foreground transition-colors hover:text-foreground"
                    activeProps={{ className: 'text-primary' }}
                >
                    <CalendarDays className="size-5" />
                    <span className="text-[10px] font-medium">Programs</span>
                </Link>
            </div>
            {/* Safe area padding for iOS */}
            <div className="h-[env(safe-area-inset-bottom)]" />

            {/* Calculator dialog — controlled */}
            <PercentageCalculatorDialog
                trigger={<span className="hidden" />}
                open={calcOpen}
                onOpenChange={setCalcOpen}
            />
        </nav>
    );
}
