import { accountSetupRedirect } from '@/actions/auth/account-setup-redirect';

export function withAuth(Component: React.ComponentType) {
    return async function WithAuth(props: any) {
        await accountSetupRedirect();
        return <Component {...props} />;
    };
}
