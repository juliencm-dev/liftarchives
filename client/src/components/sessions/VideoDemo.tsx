import { Play } from 'lucide-react';

export function VideoDemo() {
    return (
        <div className="relative mx-4 mt-3 overflow-hidden rounded-xl bg-secondary/60">
            <div className="flex aspect-[2/1] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
                        <Play className="size-5 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground">Tap to watch demo</p>
                </div>
            </div>
        </div>
    );
}
