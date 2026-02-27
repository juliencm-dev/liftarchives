import { Link, useNavigate } from '@tanstack/react-router';
import { Dumbbell, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export function AppHeader() {
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
                    <Link to="/dashboard" className="flex items-center gap-2 group cursor-pointer">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Dumbbell className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <span className="text-2xl font-bold">LiftArchives</span>
                    </Link>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                        >
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                <User className="h-5 w-5 text-primary" />
                            </div>
                            <span className="font-medium text-foreground hidden sm:block">
                                {(user as { name?: string })?.name ?? 'Account'}
                            </span>
                        </button>

                        {showMenu && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                                <div className="absolute right-0 mt-2 w-56 rounded-lg bg-card border shadow-lg z-50">
                                    <div className="p-2">
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
                </div>
            </div>
        </nav>
    );
}
