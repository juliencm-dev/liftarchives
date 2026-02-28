export function isMobile(): boolean {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function isStandalone(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true;
}

export function isIOS(): boolean {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function isAndroid(): boolean {
    return /Android/i.test(navigator.userAgent);
}

// Session-based skip for "Continue in browser"
const INSTALL_SKIPPED_KEY = 'pwa-install-skipped';

export function hasSkippedInstall(): boolean {
    return sessionStorage.getItem(INSTALL_SKIPPED_KEY) === 'true';
}

export function skipInstall(): void {
    sessionStorage.setItem(INSTALL_SKIPPED_KEY, 'true');
}

// Store the deferred prompt for Android native install
let deferredPrompt: BeforeInstallPromptEvent | null = null;

interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function getDeferredPrompt(): BeforeInstallPromptEvent | null {
    return deferredPrompt;
}

export function clearDeferredPrompt(): void {
    deferredPrompt = null;
}

// Listen for the beforeinstallprompt event (Android/Chrome)
if (typeof window !== 'undefined') {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e as BeforeInstallPromptEvent;
    });
}
