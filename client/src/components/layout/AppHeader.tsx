import { Link, useNavigate } from '@tanstack/react-router';
import { Calculator, Dumbbell, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PercentageCalculatorDialog } from '@/components/calculator/PercentageCalculator';

export function AppHeader() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const name = (user as { name?: string })?.name ?? 'Account';
    const initial = name.charAt(0).toUpperCase();

    const handleSignOut = async () => {
        await signOut();
        navigate({ to: '/' });
    };

    return (
        <header className="sticky top-0 z-50 border-b border-border/50 bg-transparent backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-6">
                <Link to="/dashboard" className="flex items-center gap-3 group">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary/15 group-hover:scale-110 transition-transform md:size-9">
                        <Dumbbell className="size-4 text-primary md:size-5" />
                    </div>
                    <span className="text-base font-semibold tracking-tight text-foreground md:text-lg">
                        LiftArchives
                    </span>
                </Link>

                <div className="flex items-center gap-2">
                    {/* Calculator — desktop only */}
                    <div className="hidden md:block">
                        <PercentageCalculatorDialog
                            trigger={
                                <Button variant="ghost" size="icon">
                                    <Calculator className="size-5" />
                                    <span className="sr-only">Percentage Calculator</span>
                                </Button>
                            }
                        />
                    </div>

                    {/* Avatar dropdown — all breakpoints */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-3 rounded-full p-1 md:pr-3 transition-colors hover:bg-secondary">
                                <Avatar className="size-8 border border-primary/30">
                                    <AvatarFallback className="bg-primary/15 text-sm font-semibold text-primary">
                                        {initial}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="hidden text-sm font-medium text-foreground md:inline">{name}</span>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem asChild>
                                <Link to="/profile">
                                    <User className="mr-2 size-4" />
                                    Profile
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
