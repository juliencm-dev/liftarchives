import { Resend } from 'resend';
import { render } from '@react-email/render';
import { env } from '@/env';
import type { ReactElement } from 'react';

let _resend: Resend | null = null;

function getResend(): Resend {
    if (!_resend) {
        _resend = new Resend(env.RESEND_API_KEY);
    }
    return _resend;
}

const FROM_ADDRESS = 'Lift Archives <noreply@liftarchives.app>';

export type EmailType = 'verify_email' | 'reset_password';

export function getFrontendUrl() {
    if (env.NODE_ENV === 'production') {
        return env.FRONTEND_URL!;
    }
    return 'http://localhost:3000';
}

export async function sendEmail({ to, subject, react }: { to: string; subject: string; react: ReactElement }) {
    const html = await render(react);
    console.log(
        `[Email] Sending "${subject}" to ${to.replace(/^(.)(.*)(@.*)$/, (_, first: string, middle: string, domain: string) => first + '*'.repeat(middle.length) + domain)}`
    );
    const { error } = await getResend().emails.send({
        from: FROM_ADDRESS,
        to: [to],
        subject,
        html,
    });

    if (error) {
        const masked = to.replace(
            /^(.)(.*)(@.*)$/,
            (_, first: string, middle: string, domain: string) => first + '*'.repeat(middle.length) + domain
        );
        console.error(`[Email] Failed to send to ${masked}:`, error);
        throw error;
    }
}
