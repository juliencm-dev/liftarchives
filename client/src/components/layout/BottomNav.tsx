import { Link } from '@tanstack/react-router';
import { Home, Dumbbell, TrendingUp, Calendar, User } from 'lucide-react';

const navItems = [
    { label: 'Home', icon: Home, to: '/dashboard' as const },
    { label: 'Training', icon: Dumbbell, to: '/training' as const },
    { label: 'Lifts', icon: TrendingUp, to: '/lifts' as const },
    { label: 'Programs', icon: Calendar, to: '/programs' as const },
    { label: 'Profile', icon: User, to: '/profile' as const },
];

export function BottomNav() {
    return (
        <nav className="fixed bottom-0 inset-x-0 z-50 border-t bg-background/95 backdrop-blur-sm md:hidden">
            <div className="flex items-center justify-around h-16">
                {navItems.map((item) => (
                    <Link
                        key={item.to}
                        to={item.to}
                        className="flex flex-col items-center justify-center gap-1 flex-1 h-full text-muted-foreground"
                        activeProps={{ className: 'text-primary' }}
                    >
                        <item.icon className="h-5 w-5" />
                        <span className="text-xs">{item.label}</span>
                    </Link>
                ))}
            </div>
        </nav>
    );
}
