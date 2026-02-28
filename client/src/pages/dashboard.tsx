import { useAuth } from '@/contexts/AuthContext';
import { useRecentRecords } from '@/hooks/use-lifts';
import { useActiveProgram } from '@/hooks/use-programs';
import { useWeeklySessionCount } from '@/hooks/use-sessions';
import { Button } from '@/components/ui/button';
import { DashboardStatCard } from '@/components/dashboard/DashboardStatCard';
import { RecentActivityCard } from '@/components/dashboard/RecentActivityCard';
import { TodaysTrainingCard } from '@/components/dashboard/TodaysTrainingCard';
import { ActiveSessionBanner } from '@/components/sessions/ActiveSessionBanner';
import { Link } from '@tanstack/react-router';
import { Activity, CalendarDays, Target, Plus, TrendingUp } from 'lucide-react';

export function DashboardPage() {
    const { user } = useAuth();
    const firstName = (user as { name?: string })?.name?.split(' ')[0] ?? 'Lifter';
    const { data: recentRecords } = useRecentRecords();
    const { data: activeData } = useActiveProgram();
    const { data: weeklyCount } = useWeeklySessionCount();

    const activeProgram = activeData?.program ?? null;
    const activeProgramName = activeProgram?.name ?? 'None';
    const currentWeek = activeData?.currentWeek ?? null;
    const upNextDayId = activeData?.upNextDay?.id ?? null;

    return (
        <div className="mx-auto w-full max-w-7xl overflow-hidden px-4 py-6 lg:px-6 lg:py-8">
            {/* Welcome */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    Welcome back, <span className="text-primary">{firstName}</span>
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">Here's your training overview</p>
            </div>

            {/* Active session resume banner */}
            <ActiveSessionBanner />

            {/* Stats Grid */}
            <div className="mb-6 flex flex-col gap-3 md:grid md:grid-cols-4 md:gap-4">
                {activeProgram ? (
                    <Link to="/programs/$programId" params={{ programId: activeProgram.id }} className="md:col-span-2">
                        <DashboardStatCard label="Active Program" value={activeProgramName} icon={CalendarDays} />
                    </Link>
                ) : (
                    <div className="md:col-span-2">
                        <DashboardStatCard label="Active Program" value={activeProgramName} icon={CalendarDays} />
                    </div>
                )}
                <DashboardStatCard label="Sessions This Week" value={String(weeklyCount?.count ?? 0)} icon={Activity} />
                <DashboardStatCard label="Next Competition" value="—" icon={Target} />
            </div>

            {/* Quick Actions */}
            <div className="mb-8 hidden gap-3 md:flex">
                <Button className="h-11 flex-1 gap-2 rounded-xl font-semibold shadow-[0_0_20px_rgba(212,168,83,0.15)] hover:shadow-[0_0_30px_rgba(212,168,83,0.25)]">
                    <Plus className="size-4" />
                    Log Session
                </Button>
                <Button variant="outline-primary" className="h-11 flex-1 gap-2 rounded-xl" asChild>
                    <Link to="/lifts">
                        <TrendingUp className="size-4" />
                        View Progress
                    </Link>
                </Button>
                <Button variant="outline-primary" className="h-11 flex-1 gap-2 rounded-xl" asChild>
                    <Link to="/programs">
                        <CalendarDays className="size-4" />
                        Browse Programs
                    </Link>
                </Button>
            </div>

            {/* Content Grid */}
            <div className="grid gap-4 lg:grid-cols-2">
                <TodaysTrainingCard
                    currentWeek={currentWeek}
                    upNextDayId={upNextDayId}
                    hasActiveAssignment={!!activeData?.assignment}
                />
                <RecentActivityCard recentRecords={recentRecords} />
            </div>
        </div>
    );
}
