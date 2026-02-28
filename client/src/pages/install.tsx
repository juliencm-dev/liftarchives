import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Dumbbell, Share, PlusSquare, MoreVertical, Download, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isIOS, isAndroid, getDeferredPrompt, clearDeferredPrompt, skipInstall } from '@/lib/pwa';

export function InstallPage() {
    const navigate = useNavigate();
    const [promptFailed, setPromptFailed] = useState(false);

    const handleInstallClick = async () => {
        const prompt = getDeferredPrompt();
        if (prompt) {
            await prompt.prompt();
            const { outcome } = await prompt.userChoice;
            clearDeferredPrompt();
            if (outcome === 'accepted') {
                navigate({ to: '/' });
            }
        } else {
            setPromptFailed(true);
        }
    };

    const handleContinueInBrowser = () => {
        skipInstall();
        navigate({ to: '/' });
    };

    return (
        <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 text-center">
            <div className="mb-8 flex items-center gap-3">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                    <Dumbbell className="size-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">Lift Archives</h1>
            </div>

            <p className="mb-10 max-w-xs text-muted-foreground">
                This app works best when installed on your device. Add it to your home screen for the full experience.
            </p>

            {isIOS() && <IOSInstructions />}

            {isAndroid() && <AndroidInstructions onInstallClick={handleInstallClick} showFallback={promptFailed} />}

            {!isIOS() && !isAndroid() && <GenericInstructions />}

            <button
                onClick={handleContinueInBrowser}
                className="mt-10 text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
            >
                Continue in browser
            </button>
        </div>
    );
}

function IOSInstructions() {
    return (
        <div className="w-full max-w-xs space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">To install</h2>
            <ol className="space-y-4 text-left">
                <li className="flex items-start gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-medium">
                        1
                    </span>
                    <span className="pt-1 text-sm text-foreground">
                        Tap the <Share className="mb-0.5 inline size-4 text-primary" /> Share button in your browser
                        toolbar
                    </span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-medium">
                        2
                    </span>
                    <span className="pt-1 text-sm text-foreground">
                        Tap the <ChevronDown className="mb-0.5 inline size-4 text-primary" /> chevron to view more
                        options
                    </span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-medium">
                        3
                    </span>
                    <span className="pt-1 text-sm text-foreground">
                        Tap{' '}
                        <span className="inline-flex items-center gap-1">
                            <PlusSquare className="mb-0.5 inline size-4 text-primary" />
                            <strong>Add to Home Screen</strong>
                        </span>
                    </span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-medium">
                        4
                    </span>
                    <span className="pt-1 text-sm text-foreground">
                        Tap <strong>Add</strong> to confirm
                    </span>
                </li>
            </ol>
        </div>
    );
}

function AndroidInstructions({ onInstallClick, showFallback }: { onInstallClick: () => void; showFallback: boolean }) {
    if (!showFallback) {
        return (
            <Button onClick={onInstallClick} size="lg" className="w-full max-w-xs">
                <Download className="mr-2 size-4" />
                Install App
            </Button>
        );
    }

    return (
        <div className="w-full max-w-xs space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">To install</h2>
            <ol className="space-y-4 text-left">
                <li className="flex items-start gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-medium">
                        1
                    </span>
                    <span className="pt-1 text-sm text-foreground">
                        Tap the <MoreVertical className="mb-0.5 inline size-4 text-primary" /> menu in your browser
                    </span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-medium">
                        2
                    </span>
                    <span className="pt-1 text-sm text-foreground">
                        Tap <strong>Install app</strong> or <strong>Add to Home screen</strong>
                    </span>
                </li>
            </ol>
        </div>
    );
}

function GenericInstructions() {
    return (
        <div className="w-full max-w-xs space-y-4">
            <p className="text-sm text-muted-foreground">
                Look for an install option in your browser's menu to add this app to your home screen.
            </p>
        </div>
    );
}
