import { lazy, Suspense } from 'react';
import { createRootRoute, createRoute, createRouter, Outlet, redirect } from '@tanstack/react-router';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { AppHeader } from '@/components/layout/AppHeader';
import { BottomNav } from '@/components/layout/BottomNav';

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
const TrainingPage = lazy(() => import('@/pages/training').then((m) => ({ default: m.TrainingPage })));
const LiftsPage = lazy(() => import('@/pages/lifts').then((m) => ({ default: m.LiftsPage })));
const ProgramsPage = lazy(() => import('@/pages/programs').then((m) => ({ default: m.ProgramsPage })));
const ProgramDetailPage = lazy(() => import('@/pages/program-detail').then((m) => ({ default: m.ProgramDetailPage })));
const ProfilePage = lazy(() => import('@/pages/profile').then((m) => ({ default: m.ProfilePage })));

function PageSuspense({ children }: { children: React.ReactNode }) {
    return <Suspense fallback={null}>{children}</Suspense>;
}

const isProtectedRoute = async (ctx: any) => {
    await ctx.context.queryClient.ensureQueryData({
        queryKey: ['currentUser'],
        queryFn: async () => {
            const { getSession } = await import('@/lib/auth');
            const { data: session } = await getSession();
            return session?.user || null;
        },
    });

    const user = ctx.context.queryClient.getQueryData(['currentUser']);

    if (!user) {
        throw redirect({ to: '/signin' });
    }
};

const isPublicRoute = async (ctx: any) => {
    await ctx.context.queryClient.ensureQueryData({
        queryKey: ['currentUser'],
        queryFn: async () => {
            const { getSession } = await import('@/lib/auth');
            const { data: session } = await getSession();
            return session?.user || null;
        },
    });

    const user = ctx.context.queryClient.getQueryData(['currentUser']);

    if (user) {
        throw redirect({ to: '/dashboard' });
    }
};

// Root route
const _root = createRootRoute({
    component: () => <Outlet />,
});

// Public Layout
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

// App Layout (authenticated)
const _appLayout = createRoute({
    getParentRoute: () => _root,
    id: 'appLayout',
    beforeLoad: isProtectedRoute,
    component: () => (
        <div className="flex min-h-dvh w-full flex-col">
            <AppHeader />
            <main className="flex-1 overflow-x-hidden pb-20 md:pb-0">
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
    beforeLoad: isPublicRoute,
});

const signInRoute = createRoute({
    getParentRoute: () => _publicLayout,
    path: '/signin',
    component: () => (
        <PageSuspense>
            <SignInPage />
        </PageSuspense>
    ),
    beforeLoad: isPublicRoute,
});

const signUpRoute = createRoute({
    getParentRoute: () => _publicLayout,
    path: '/signup',
    component: () => (
        <PageSuspense>
            <SignUpPage />
        </PageSuspense>
    ),
    beforeLoad: isPublicRoute,
});

const verifyEmailRoute = createRoute({
    getParentRoute: () => _publicLayout,
    path: '/verify-email',
    component: () => (
        <PageSuspense>
            <VerifyEmailPage />
        </PageSuspense>
    ),
});

const forgotPasswordRoute = createRoute({
    getParentRoute: () => _publicLayout,
    path: '/forgot-password',
    component: () => (
        <PageSuspense>
            <ForgotPasswordPage />
        </PageSuspense>
    ),
    beforeLoad: isPublicRoute,
});

const resetPasswordRoute = createRoute({
    getParentRoute: () => _publicLayout,
    path: '/reset-password',
    component: () => (
        <PageSuspense>
            <ResetPasswordPage />
        </PageSuspense>
    ),
});

// App routes (protected via layout-level beforeLoad)
const dashboardRoute = createRoute({
    getParentRoute: () => _appLayout,
    path: '/dashboard',
    component: () => (
        <PageSuspense>
            <DashboardPage />
        </PageSuspense>
    ),
});

const trainingRoute = createRoute({
    getParentRoute: () => _appLayout,
    path: '/training',
    component: () => (
        <PageSuspense>
            <TrainingPage />
        </PageSuspense>
    ),
});

const liftsRoute = createRoute({
    getParentRoute: () => _appLayout,
    path: '/lifts',
    component: () => (
        <PageSuspense>
            <LiftsPage />
        </PageSuspense>
    ),
});

const programsRoute = createRoute({
    getParentRoute: () => _appLayout,
    path: '/programs',
    component: () => (
        <PageSuspense>
            <ProgramsPage />
        </PageSuspense>
    ),
});

const programDetailRoute = createRoute({
    getParentRoute: () => _appLayout,
    path: '/programs/$programId',
    component: () => (
        <PageSuspense>
            <ProgramDetailPage />
        </PageSuspense>
    ),
});

const profileRoute = createRoute({
    getParentRoute: () => _appLayout,
    path: '/profile',
    component: () => (
        <PageSuspense>
            <ProfilePage />
        </PageSuspense>
    ),
});

// Create the route tree
const routeTree = _root.addChildren([
    _publicLayout.addChildren([
        indexRoute,
        signInRoute,
        signUpRoute,
        verifyEmailRoute,
        forgotPasswordRoute,
        resetPasswordRoute,
    ]),
    _appLayout.addChildren([
        dashboardRoute,
        trainingRoute,
        liftsRoute,
        programsRoute,
        programDetailRoute,
        profileRoute,
    ]),
]);

// Create the router instance
export const router = createRouter({ routeTree });

// Register the router for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}
