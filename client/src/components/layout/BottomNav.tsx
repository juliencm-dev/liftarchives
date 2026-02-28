import { Link } from '@tanstack/react-router';
import { Home, Calculator, TrendingUp, CalendarDays, History } from 'lucide-react';

export function BottomNav() {
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
                <Link
                    to="/calculator"
                    className="flex flex-1 flex-col items-center gap-1 py-2 text-muted-foreground transition-colors hover:text-foreground"
                    activeProps={{ className: 'text-primary' }}
                >
                    <Calculator className="size-5" />
                    <span className="text-[10px] font-medium">Calculator</span>
                </Link>

                {/* Progression — central raised button */}
                <div className="flex flex-1 items-center justify-center">
                    <Link
                        to="/lifts"
                        className="-mt-5 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 ring-4 ring-background transition-transform hover:scale-105 active:scale-95"
                        activeProps={{ className: 'ring-primary/30' }}
                    >
                        <TrendingUp className="size-6" />
                    </Link>
                </div>

                {/* History */}
                <Link
                    to="/training"
                    className="flex flex-1 flex-col items-center gap-1 py-2 text-muted-foreground transition-colors hover:text-foreground"
                    activeProps={{ className: 'text-primary' }}
                >
                    <History className="size-5" />
                    <span className="text-[10px] font-medium">History</span>
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
        </nav>
    );
}
