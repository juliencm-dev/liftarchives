import { useEffect, useState } from 'react';
import { useRouterState } from '@tanstack/react-router';

const ROUTE_TITLES: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/training': 'History',
    '/lifts': 'Lifts',
    '/programs': 'Programs',
    '/calculator': 'Calculator',
    '/profile': 'Profile',
    '/settings': 'Settings',
    '/coach': 'Coach',
    '/clubs': 'Clubs',
    '/more': 'More',
    '/billing': 'Billing',
    '/privacy': 'Privacy Policy',
    '/delete-account': 'Delete Account',
};

function getTitle(pathname: string): string {
    if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname];
    if (pathname.startsWith('/programs/')) return 'Program';
    if (pathname.startsWith('/clubs/')) return 'Club';
    if (pathname.startsWith('/training/sessions/')) return 'Session';
    if (pathname.startsWith('/coach/lifters/')) return 'Lifter';
    return '';
}

export function MobileScrollHeader() {
    const { location } = useRouterState();
    const [visible, setVisible] = useState(false);
    const title = getTitle(location.pathname);

    useEffect(() => {
        const threshold = 60;

        const onScroll = () => {
            setVisible(window.scrollY > threshold);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        // Reset on route change
        setVisible(window.scrollY > threshold);

        return () => window.removeEventListener('scroll', onScroll);
    }, [location.pathname]);

    if (!title) return null;

    return (
        <div
            className={`fixed inset-x-0 top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-xl transition-all duration-200 md:hidden ${
                visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
            }`}
        >
            <div className="flex h-11 items-center justify-center pt-[env(safe-area-inset-top)]">
                <span className="text-sm font-semibold text-foreground">{title}</span>
            </div>
        </div>
    );
}
