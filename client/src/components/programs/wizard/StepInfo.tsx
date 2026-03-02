import { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Camera, ImagePlus, Sparkles } from 'lucide-react';

interface StepInfoProps {
    name: string;
    description: string;
    durationWeeks: number;
    onNameChange: (name: string) => void;
    onDescriptionChange: (description: string) => void;
    onDurationWeeksChange: (weeks: number) => void;
    onImageExtract: (file: File) => void;
    isExtracting: boolean;
}

export function StepInfo({
    name,
    description,
    durationWeeks,
    onNameChange,
    onDescriptionChange,
    onDurationWeeksChange,
    onImageExtract,
    isExtracting,
}: StepInfoProps) {
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onImageExtract(file);
            e.target.value = '';
        }
    };

    return (
        <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
            {/* Import with AI */}
            <div className="flex flex-col gap-4 rounded-xl border border-primary/25 bg-primary/5 p-5">
                <div className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15">
                        <Sparkles className="size-5 text-primary" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-semibold text-foreground">Import with AI</p>
                        <p className="text-sm text-muted-foreground">
                            Snap a photo of your whiteboard or printed program and we'll extract everything
                            automatically.
                        </p>
                    </div>
                </div>

                <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/heic"
                    capture="environment"
                    onChange={handleFileChange}
                    className="hidden"
                />
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/heic"
                    onChange={handleFileChange}
                    className="hidden"
                />

                <div className="flex items-center gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isExtracting}
                        onClick={() => cameraInputRef.current?.click()}
                    >
                        <Camera className="size-4" />
                        Take photo
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        disabled={isExtracting}
                        onClick={() => fileInputRef.current?.click()}
                        className="text-muted-foreground"
                    >
                        <ImagePlus className="size-4" />
                        Choose file
                    </Button>
                </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-border/60" />
                <span className="text-xs font-medium tracking-widest text-muted-foreground">OR ENTER MANUALLY</span>
                <div className="h-px flex-1 bg-border/60" />
            </div>

            {/* Manual form */}
            <div className="flex flex-col gap-2">
                <Label htmlFor="program-name" className="text-sm font-medium text-foreground">
                    Program Name <span className="text-primary">*</span>
                </Label>
                <Input
                    id="program-name"
                    placeholder="e.g. Strength Block 1"
                    value={name}
                    onChange={(e) => onNameChange(e.target.value)}
                    className="h-12 border-border bg-input text-foreground placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:ring-primary/20"
                />
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="program-description" className="text-sm font-medium text-foreground">
                    Description
                </Label>
                <Textarea
                    id="program-description"
                    placeholder="Optional description for this program..."
                    value={description}
                    onChange={(e) => onDescriptionChange(e.target.value)}
                    rows={4}
                    className="resize-y border-border bg-input text-foreground placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:ring-primary/20"
                />
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="program-duration" className="text-sm font-medium text-foreground">
                    Duration (weeks)
                </Label>
                <Input
                    id="program-duration"
                    type="number"
                    min={1}
                    max={52}
                    value={durationWeeks}
                    onChange={(e) => onDurationWeeksChange(Math.max(1, Math.min(52, parseInt(e.target.value) || 1)))}
                    className="h-12 border-border bg-input text-foreground placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:ring-primary/20"
                />
            </div>
        </div>
    );
}
