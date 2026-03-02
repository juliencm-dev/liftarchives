import { Link, useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/contexts/AuthContext';
import { useCoachProfile } from '@/hooks/use-profile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Calculator,
    Building2,
    GraduationCap,
    Settings,
    LogOut,
    ChevronRight,
    Shield,
    CreditCard,
    Trash2,
} from 'lucide-react';

interface MenuItemProps {
    to: string;
    icon: React.ReactNode;
    label: string;
}

function MenuItem({ to, icon, label }: MenuItemProps) {
    return (
        <Link to={to} className="flex items-center gap-4 rounded-xl px-4 py-3 transition-colors active:bg-muted/80">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">{icon}</div>
            <p className="flex-1 text-sm font-medium text-foreground">{label}</p>
            <ChevronRight className="size-4 text-muted-foreground" />
        </Link>
    );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <p className="px-4 pb-1 pt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {children}
        </p>
    );
}

export function MorePage() {
    const { user, signOut } = useAuth();
    const { data: coachProfile } = useCoachProfile();
    const navigate = useNavigate();

    const name = (user as { name?: string })?.name ?? 'Account';
    const email = (user as { email?: string })?.email ?? '';
    const image = (user as { image?: string | null })?.image ?? null;
    const initial = name.charAt(0).toUpperCase();

    const handleSignOut = async () => {
        await signOut();
        navigate({ to: '/' });
    };

    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
            <h1 className="mb-6 text-2xl font-bold tracking-tight text-foreground">More</h1>

            {/* Profile card */}
            <Link
                to="/profile"
                className="mb-4 flex items-center gap-4 rounded-xl border border-border/50 p-4 transition-colors active:bg-muted/80"
            >
                <Avatar className="size-12 border border-primary/30">
                    <AvatarImage src={image ?? undefined} alt={name} />
                    <AvatarFallback className="bg-primary/15 text-base font-semibold text-primary">
                        {initial}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <p className="font-semibold text-foreground">{name}</p>
                    <p className="text-xs text-muted-foreground">{email}</p>
                </div>
                <ChevronRight className="size-4 text-muted-foreground" />
            </Link>

            {/* Tools */}
            <SectionLabel>Tools</SectionLabel>
            <div className="space-y-1">
                <MenuItem
                    to="/calculator"
                    icon={<Calculator className="size-5 text-muted-foreground" />}
                    label="Calculator"
                />
                <MenuItem to="/clubs" icon={<Building2 className="size-5 text-muted-foreground" />} label="Clubs" />
                {coachProfile && (
                    <MenuItem
                        to="/coach"
                        icon={<GraduationCap className="size-5 text-muted-foreground" />}
                        label="Coach Dashboard"
                    />
                )}
            </div>

            {/* Account */}
            <SectionLabel>Account</SectionLabel>
            <div className="space-y-1">
                <MenuItem
                    to="/settings"
                    icon={<Settings className="size-5 text-muted-foreground" />}
                    label="Settings"
                />
                <MenuItem
                    to="/billing"
                    icon={<CreditCard className="size-5 text-muted-foreground" />}
                    label="Billing"
                />
                <MenuItem
                    to="/privacy"
                    icon={<Shield className="size-5 text-muted-foreground" />}
                    label="Privacy Policy"
                />
                <MenuItem
                    to="/delete-account"
                    icon={<Trash2 className="size-5 text-destructive/70" />}
                    label="Delete Account"
                />
            </div>

            {/* Sign out */}
            <div className="mt-6">
                <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-4 rounded-xl px-4 py-3 transition-colors active:bg-muted/80"
                >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
                        <LogOut className="size-5 text-destructive" />
                    </div>
                    <p className="text-sm font-medium text-destructive">Sign Out</p>
                </button>
            </div>
        </div>
    );
}
