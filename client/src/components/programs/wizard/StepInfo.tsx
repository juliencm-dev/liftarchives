import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface StepInfoProps {
    name: string;
    description: string;
    durationWeeks: number;
    onNameChange: (name: string) => void;
    onDescriptionChange: (description: string) => void;
    onDurationWeeksChange: (weeks: number) => void;
}

export function StepInfo({
    name,
    description,
    durationWeeks,
    onNameChange,
    onDescriptionChange,
    onDurationWeeksChange,
}: StepInfoProps) {
    return (
        <div className="mx-auto w-full max-w-xl space-y-6">
            <div className="space-y-2">
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

            <div className="space-y-2">
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

            <div className="space-y-2">
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
