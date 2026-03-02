import { lazy, Suspense } from 'react';
import { createRoute, createRouter, Outlet, redirect, createRootRouteWithContext } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { AppHeader } from '@/components/layout/AppHeader';
import { BottomNav } from '@/components/layout/BottomNav';
import {
    currentUserQueryOptions,
    recentRecordsQueryOptions,
    activeProgramQueryOptions,
    weeklySessionCountQueryOptions,
    sessionHistoryQueryOptions,
    liftsQueryOptions,
    personalRecordsQueryOptions,
    programsQueryOptions,
    programQueryOptions,
    sessionQueryOptions,
    activeSessionQueryOptions,
    lifterProfileQueryOptions,
    coachProfileQueryOptions,
    competitionProfileQueryOptions,
    trainingSettingsQueryOptions,
    coachLiftersQueryOptions,
    coachInvitesQueryOptions,
    coachSessionsQueryOptions,
    coachProgramsQueryOptions,
    coachLifterSessionsQueryOptions,
    coachLifterRecordsQueryOptions,
    lifterInvitesQueryOptions,
    userClubsQueryOptions,
    clubDetailQueryOptions,
} from '@/lib/queries';

const LandingPage = lazy(() => import('@/pages/landing').then((m) => ({ default: m.LandingPage })));
const SignInPage = lazy(() => import('@/pages/signin').then((m) => ({ default: m.SignInPage })));
const SignUpPage = lazy(() => import('@/pages/signup').then((m) => ({ default: m.SignUpPage })));
const VerifyEmailPage = lazy(() =>
    import('@/pages/verify-email').then((m) => ({
        default: m.VerifyEmailPage,
    }))
);
const ForgotPasswordPage = lazy(() =>
    import('@/pages/forgot-password').then((m) => ({
        default: m.ForgotPasswordPage,
    }))
);
const ResetPasswordPage = lazy(() =>
    import('@/pages/reset-password').then((m) => ({
        default: m.ResetPasswordPage,
    }))
);
const DashboardPage = lazy(() => import('@/pages/dashboard').then((m) => ({ default: m.DashboardPage })));
const TrainingPage = lazy(() => import('@/pages/session-history').then((m) => ({ default: m.SessionHistoryPage })));
const LiftsPage = lazy(() => import('@/pages/lifts').then((m) => ({ default: m.LiftsPage })));
const ProgramsPage = lazy(() => import('@/pages/programs').then((m) => ({ default: m.ProgramsPage })));
const ProgramDetailPage = lazy(() => import('@/pages/program-detail').then((m) => ({ default: m.ProgramDetailPage })));
const ProfilePage = lazy(() => import('@/pages/profile').then((m) => ({ default: m.ProfilePage })));
const SettingsPage = lazy(() => import('@/pages/settings').then((m) => ({ default: m.SettingsPage })));
const ActiveSessionPage = lazy(() => import('@/pages/active-session').then((m) => ({ default: m.ActiveSessionPage })));
const SessionDetailPage = lazy(() => import('@/pages/session-detail').then((m) => ({ default: m.SessionDetailPage })));
const CalculatorPage = lazy(() => import('@/pages/calculator').then((m) => ({ default: m.CalculatorPage })));
const InstallPage = lazy(() => import('@/pages/install').then((m) => ({ default: m.InstallPage })));
const CoachDashboardPage = lazy(() =>
    import('@/pages/coach-dashboard').then((m) => ({ default: m.CoachDashboardPage }))
);
const CoachLifterDetailPage = lazy(() =>
    import('@/pages/coach-lifter-detail').then((m) => ({ default: m.CoachLifterDetailPage }))
);
const ClubsPage = lazy(() => import('@/pages/clubs').then((m) => ({ default: m.ClubsPage })));
const ClubDetailPage = lazy(() => import('@/pages/club-detail').then((m) => ({ default: m.ClubDetailPage })));

function PageSuspense({ children }: { children: React.ReactNode }) {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-[50dvh] items-center justify-center">
                    <Loader2 className="size-8 animate-spin text-primary" />
                </div>
            }
        >
            {children}
        </Suspense>
    );
}

interface RouterContext {
    queryClient: QueryClient;
}

const isProtectedRoute = async ({ context }: { context: RouterContext }) => {
    try {
        await context.queryClient.ensureQueryData(currentUserQueryOptions);
    } catch {
        throw redirect({ to: '/signin' });
    }
    const user = context.queryClient.getQueryData(currentUserQueryOptions.queryKey);

    if (!user) {
        throw redirect({ to: '/signin' });
    }
};

const isPublicRoute = async ({ context }: { context: RouterContext }) => {
    try {
        await context.queryClient.ensureQueryData(currentUserQueryOptions);
    } catch {
        return;
    }
    const user = context.queryClient.getQueryData(currentUserQueryOptions.queryKey);

    if (user) {
        throw redirect({ to: '/dashboard' });
    }
};

function RouteErrorComponent() {
    return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-8 text-center">
            <p className="text-lg font-medium">Something went wrong</p>
            <p className="text-sm text-muted-foreground">The server might be waking up. Give it a moment.</p>
            <button
                onClick={() => window.location.reload()}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
                Retry
            </button>
        </div>
    );
}

// Root route
const _root = createRootRouteWithContext<RouterContext>()({
    component: () => <Outlet />,
    errorComponent: RouteErrorComponent,
});

// Public Layout (landing + content pages with footer)
const _publicLayout = createRoute({
    getParentRoute: () => _root,
    id: 'publicLayout',
    component: () => (
        <>
            <Navigation />
            <Outlet />
            <Footer />
        </>
    ),
});

// Auth Layout (signin/signup/verify — no footer)
const _authLayout = createRoute({
    getParentRoute: () => _root,
    id: 'authLayout',
    component: () => (
        <>
            <Navigation />
            <Outlet />
        </>
    ),
});

// App Layout (authenticated)
const _appLayout = createRoute({
    getParentRoute: () => _root,
    id: 'appLayout',
    beforeLoad: isProtectedRoute,
    component: () => (
        <div className="flex min-h-dvh w-full flex-col">
            <AppHeader />
            <main className="flex-1 overflow-x-clip pb-[calc(env(safe-area-inset-bottom))] md:pb-0">
                <Outlet />
            </main>
            <BottomNav />
        </div>
    ),
});

// Public routes
const indexRoute = createRoute({
    getParentRoute: () => _publicLayout,
    path: '/',
    component: () => (
        <PageSuspense>
            <LandingPage />
        </PageSuspense>
    ),
    beforeLoad: async (ctx) => {
        // Mobile browser users → install prompt (unless skipped or already standalone)
        const { isMobile, isStandalone, hasSkippedInstall } = await import('@/lib/pwa');
        if (isMobile() && !isStandalone() && !hasSkippedInstall()) {
            throw redirect({ to: '/install' });
        }
        // Normal public route check (redirect to dashboard if logged in)
        await isPublicRoute(ctx);
    },
});

const signInRoute = createRoute({
    getParentRoute: () => _authLayout,
    path: '/signin',
    component: () => (
        <PageSuspense>
            <SignInPage />
        </PageSuspense>
    ),
    beforeLoad: isPublicRoute,
});

const signUpRoute = createRoute({
    getParentRoute: () => _authLayout,
    path: '/signup',
    component: () => (
        <PageSuspense>
            <SignUpPage />
        </PageSuspense>
    ),
    beforeLoad: isPublicRoute,
});

const verifyEmailRoute = createRoute({
    getParentRoute: () => _authLayout,
    path: '/verify-email',
    component: () => (
        <PageSuspense>
            <VerifyEmailPage />
        </PageSuspense>
    ),
});

const forgotPasswordRoute = createRoute({
    getParentRoute: () => _authLayout,
    path: '/forgot-password',
    component: () => (
        <PageSuspense>
            <ForgotPasswordPage />
        </PageSuspense>
    ),
    beforeLoad: isPublicRoute,
});

const resetPasswordRoute = createRoute({
    getParentRoute: () => _authLayout,
    path: '/reset-password',
    component: () => (
        <PageSuspense>
            <ResetPasswordPage />
        </PageSuspense>
    ),
});

const installRoute = createRoute({
    getParentRoute: () => _authLayout,
    path: '/install',
    component: () => (
        <PageSuspense>
            <InstallPage />
        </PageSuspense>
    ),
});

// Session Layout (authenticated, no chrome — full-screen workout)
const _sessionLayout = createRoute({
    getParentRoute: () => _root,
    id: 'sessionLayout',
    beforeLoad: isProtectedRoute,
    component: () => <Outlet />,
});

// App routes (protected via layout-level beforeLoad)
const dashboardRoute = createRoute({
    getParentRoute: () => _appLayout,
    path: '/dashboard',
    loader: ({ context }) => {
        context.queryClient.ensureQueryData(recentRecordsQueryOptions);
        context.queryClient.ensureQueryData(activeProgramQueryOptions);
        context.queryClient.ensureQueryData(weeklySessionCountQueryOptions);
        context.queryClient.ensureQueryData(lifterInvitesQueryOptions);
    },
    component: () => (
        <PageSuspense>
            <DashboardPage />
        </PageSuspense>
    ),
});

const trainingRoute = createRoute({
    getParentRoute: () => _appLayout,
    path: '/training',
    loader: ({ context }) => {
        context.queryClient.ensureQueryData(sessionHistoryQueryOptions());
    },
    component: () => (
        <PageSuspense>
            <TrainingPage />
        </PageSuspense>
    ),
});

const liftsRoute = createRoute({
    getParentRoute: () => _appLayout,
    path: '/lifts',
    loader: ({ context }) => {
        context.queryClient.ensureQueryData(liftsQueryOptions);
        context.queryClient.ensureQueryData(personalRecordsQueryOptions());
    },
    component: () => (
        <PageSuspense>
            <LiftsPage />
        </PageSuspense>
    ),
});

const programsRoute = createRoute({
    getParentRoute: () => _appLayout,
    path: '/programs',
    loader: ({ context }) => {
        context.queryClient.ensureQueryData(programsQueryOptions);
        context.queryClient.ensureQueryData(activeProgramQueryOptions);
    },
    component: () => (
        <PageSuspense>
            <ProgramsPage />
        </PageSuspense>
    ),
});

const programDetailRoute = createRoute({
    getParentRoute: () => _appLayout,
    path: '/programs/$programId',
    loader: ({ context, params }) => {
        context.queryClient.ensureQueryData(programQueryOptions(params.programId));
    },
    component: () => (
        <PageSuspense>
            <ProgramDetailPage />
        </PageSuspense>
    ),
});

const profileRoute = createRoute({
    getParentRoute: () => _appLayout,
    path: '/profile',
    loader: ({ context }) => {
        context.queryClient.ensureQueryData(lifterProfileQueryOptions);
        context.queryClient.ensureQueryData(coachProfileQueryOptions);
        context.queryClient.ensureQueryData(competitionProfileQueryOptions);
    },
    component: () => (
        <PageSuspense>
            <ProfilePage />
        </PageSuspense>
    ),
});

const settingsRoute = createRoute({
    getParentRoute: () => _appLayout,
    path: '/settings',
    loader: ({ context }) => {
        context.queryClient.ensureQueryData(trainingSettingsQueryOptions);
    },
    component: () => (
        <PageSuspense>
            <SettingsPage />
        </PageSuspense>
    ),
});

const calculatorRoute = createRoute({
    getParentRoute: () => _appLayout,
    path: '/calculator',
    loader: ({ context }) => {
        context.queryClient.ensureQueryData(liftsQueryOptions);
        context.queryClient.ensureQueryData(personalRecordsQueryOptions());
    },
    component: () => (
        <PageSuspense>
            <CalculatorPage />
        </PageSuspense>
    ),
});

const activeSessionRoute = createRoute({
    getParentRoute: () => _sessionLayout,
    path: '/training/session',
    loader: ({ context }) => {
        context.queryClient.ensureQueryData(activeSessionQueryOptions);
        context.queryClient.ensureQueryData(lifterProfileQueryOptions);
        context.queryClient.ensureQueryData(trainingSettingsQueryOptions);
    },
    component: () => (
        <PageSuspense>
            <ActiveSessionPage />
        </PageSuspense>
    ),
});

const coachDashboardRoute = createRoute({
    getParentRoute: () => _appLayout,
    path: '/coach',
    loader: ({ context }) => {
        context.queryClient.ensureQueryData(coachLiftersQueryOptions);
        context.queryClient.ensureQueryData(coachInvitesQueryOptions);
        context.queryClient.ensureQueryData(coachSessionsQueryOptions);
    },
    component: () => (
        <PageSuspense>
            <CoachDashboardPage />
        </PageSuspense>
    ),
});

const coachLifterDetailRoute = createRoute({
    getParentRoute: () => _appLayout,
    path: '/coach/lifters/$lifterId',
    loader: ({ context, params }) => {
        context.queryClient.ensureQueryData(coachLiftersQueryOptions);
        context.queryClient.ensureQueryData(coachLifterSessionsQueryOptions(params.lifterId));
        context.queryClient.ensureQueryData(coachLifterRecordsQueryOptions(params.lifterId));
        context.queryClient.ensureQueryData(coachProgramsQueryOptions);
    },
    component: () => (
        <PageSuspense>
            <CoachLifterDetailPage />
        </PageSuspense>
    ),
});

const clubsRoute = createRoute({
    getParentRoute: () => _appLayout,
    path: '/clubs',
    loader: ({ context }) => {
        context.queryClient.ensureQueryData(userClubsQueryOptions);
    },
    component: () => (
        <PageSuspense>
            <ClubsPage />
        </PageSuspense>
    ),
});

const clubDetailRoute = createRoute({
    getParentRoute: () => _appLayout,
    path: '/clubs/$clubId',
    loader: ({ context, params }) => {
        context.queryClient.ensureQueryData(clubDetailQueryOptions(params.clubId));
    },
    component: () => (
        <PageSuspense>
            <ClubDetailPage />
        </PageSuspense>
    ),
});

const sessionDetailRoute = createRoute({
    getParentRoute: () => _appLayout,
    path: '/training/sessions/$sessionId',
    loader: ({ context, params }) => {
        context.queryClient.ensureQueryData(sessionQueryOptions(params.sessionId));
    },
    component: () => (
        <PageSuspense>
            <SessionDetailPage />
        </PageSuspense>
    ),
});

// Create the route tree
const routeTree = _root.addChildren([
    _publicLayout.addChildren([indexRoute]),
    _authLayout.addChildren([
        signInRoute,
        signUpRoute,
        verifyEmailRoute,
        forgotPasswordRoute,
        resetPasswordRoute,
        installRoute,
    ]),
    _appLayout.addChildren([
        dashboardRoute,
        trainingRoute,
        sessionDetailRoute,
        liftsRoute,
        programsRoute,
        programDetailRoute,
        profileRoute,
        settingsRoute,
        calculatorRoute,
        coachDashboardRoute,
        coachLifterDetailRoute,
        clubsRoute,
        clubDetailRoute,
    ]),
    _sessionLayout.addChildren([activeSessionRoute]),
]);

// Create the router instance
export const router = createRouter({
    routeTree,
    context: { queryClient: undefined! },
});

// Register the router for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}
