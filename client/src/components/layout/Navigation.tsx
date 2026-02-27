import { Button } from '@/components/ui/button';
import { Link, useNavigate } from '@tanstack/react-router';
import { Dumbbell, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export function Navigation() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);

    const handleSignOut = async () => {
        setShowMenu(false);
        await signOut();
        navigate({ to: '/' });
    };

    return (
        <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group cursor-pointer">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Dumbbell className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <span className="text-2xl font-bold">LiftArchives</span>
                    </Link>

                    {/* Desktop Navigation */}
                    {!user && (
                        <div className="hidden md:flex items-center gap-1">
                            <a
                                href="#features"
                                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Features
                            </a>
                            <a
                                href="#how-it-works"
                                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                How It Works
                            </a>
                            <a
                                href="#pricing"
                                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Pricing
                            </a>
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowMenu(!showMenu)}
                                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                                >
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                        <User className="h-5 w-5 text-primary" />
                                    </div>
                                    <span className="font-medium text-foreground hidden sm:block">
                                        {(user as { name?: string }).name ?? 'Account'}
                                    </span>
                                </button>

                                {showMenu && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                                        <div className="absolute right-0 mt-2 w-56 rounded-lg bg-card border shadow-lg z-50">
                                            <div className="p-2">
                                                <Link
                                                    to="/dashboard"
                                                    onClick={() => setShowMenu(false)}
                                                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition-colors text-foreground"
                                                >
                                                    <LayoutDashboard className="h-4 w-4" />
                                                    Dashboard
                                                </Link>
                                                <Link
                                                    to="/"
                                                    onClick={() => setShowMenu(false)}
                                                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition-colors text-foreground"
                                                >
                                                    <User className="h-4 w-4" />
                                                    Profile
                                                </Link>
                                                <div className="border-t my-1" />
                                                <button
                                                    onClick={handleSignOut}
                                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition-colors text-foreground"
                                                >
                                                    <LogOut className="h-4 w-4" />
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <Link to="/signin">
                                    <Button
                                        variant="ghost"
                                        className="hover:bg-primary/10 hover:text-primary font-medium"
                                    >
                                        Sign In
                                    </Button>
                                </Link>
                                <Link to="/signup">
                                    <Button variant="default">Get Started</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
