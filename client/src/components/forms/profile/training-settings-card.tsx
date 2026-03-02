import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Settings, Check } from 'lucide-react';
import { useTrainingSettings, useUpdateTrainingSettings } from '@/hooks/use-training-settings';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function TrainingSettingsCard() {
    const { data: settings, isLoading } = useTrainingSettings();
    const updateSettings = useUpdateTrainingSettings();

    const [barWeight, setBarWeight] = useState('20');
    const [snatchIncrement, setSnatchIncrement] = useState('5');
    const [cleanAndJerkIncrement, setCleanAndJerkIncrement] = useState('10');
    const [powerliftingIncrement, setPowerliftingIncrement] = useState('2.5');
    const [accessoryIncrement, setAccessoryIncrement] = useState('2.5');
    const [defaultRestSeconds, setDefaultRestSeconds] = useState('120');
    const [defaultBlockRestSeconds, setDefaultBlockRestSeconds] = useState('180');
    const [intensityMode, setIntensityMode] = useState<'percent' | 'rpe'>('percent');

    useEffect(() => {
        if (settings) {
            setBarWeight(String(settings.barWeight));
            setSnatchIncrement(String(settings.snatchIncrement));
            setCleanAndJerkIncrement(String(settings.cleanAndJerkIncrement));
            setPowerliftingIncrement(String(settings.powerliftingIncrement));
            setAccessoryIncrement(String(settings.accessoryIncrement));
            setDefaultRestSeconds(String(settings.defaultRestSeconds));
            setDefaultBlockRestSeconds(String(settings.defaultBlockRestSeconds));
            setIntensityMode(settings.intensityMode === 'rpe' ? 'rpe' : 'percent');
        }
    }, [settings]);

    const handleSave = () => {
        updateSettings.mutate(
            {
                barWeight: parseFloat(barWeight),
                snatchIncrement: parseFloat(snatchIncrement),
                cleanAndJerkIncrement: parseFloat(cleanAndJerkIncrement),
                powerliftingIncrement: parseFloat(powerliftingIncrement),
                accessoryIncrement: parseFloat(accessoryIncrement),
                defaultRestSeconds: parseInt(defaultRestSeconds, 10),
                defaultBlockRestSeconds: parseInt(defaultBlockRestSeconds, 10),
                intensityMode,
            },
            {
                onSuccess: () => {
                    toast.success('Training settings updated');
                },
            }
        );
    };

    if (isLoading) {
        return (
            <Card className="border-border/60">
                <CardContent className="flex items-center justify-center py-8">
                    <Loader2 className="size-6 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-border/60">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <Settings className="size-4 text-primary" />
                    Training Settings
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                        <Label>Bar Weight (kg)</Label>
                        <Input
                            type="number"
                            value={barWeight}
                            onChange={(e) => setBarWeight(e.target.value)}
                            min={0}
                            step={0.5}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Snatch Increment (kg)</Label>
                        <Input
                            type="number"
                            value={snatchIncrement}
                            onChange={(e) => setSnatchIncrement(e.target.value)}
                            min={0.25}
                            step={0.25}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Clean & Jerk Increment (kg)</Label>
                        <Input
                            type="number"
                            value={cleanAndJerkIncrement}
                            onChange={(e) => setCleanAndJerkIncrement(e.target.value)}
                            min={0.25}
                            step={0.25}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Powerlifting Increment (kg)</Label>
                        <Input
                            type="number"
                            value={powerliftingIncrement}
                            onChange={(e) => setPowerliftingIncrement(e.target.value)}
                            min={0.5}
                            step={0.5}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Accessory Increment (kg)</Label>
                        <Input
                            type="number"
                            value={accessoryIncrement}
                            onChange={(e) => setAccessoryIncrement(e.target.value)}
                            min={0.5}
                            step={0.5}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Default Rest (seconds)</Label>
                        <Input
                            type="number"
                            value={defaultRestSeconds}
                            onChange={(e) => setDefaultRestSeconds(e.target.value)}
                            min={0}
                            step={15}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Block Rest (seconds)</Label>
                        <Input
                            type="number"
                            value={defaultBlockRestSeconds}
                            onChange={(e) => setDefaultBlockRestSeconds(e.target.value)}
                            min={0}
                            step={15}
                        />
                    </div>
                </div>
                <div className="mt-4 space-y-1.5">
                    <Label>Intensity Mode</Label>
                    <div className="inline-flex rounded-lg border border-border bg-secondary p-0.5">
                        <button
                            type="button"
                            onClick={() => setIntensityMode('percent')}
                            className={cn(
                                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                                intensityMode === 'percent'
                                    ? 'bg-card text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            Percentage (%)
                        </button>
                        <button
                            type="button"
                            onClick={() => setIntensityMode('rpe')}
                            className={cn(
                                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                                intensityMode === 'rpe'
                                    ? 'bg-card text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            RPE
                        </button>
                    </div>
                </div>
                <Button className="mt-4 gap-2" onClick={handleSave} disabled={updateSettings.isPending}>
                    {updateSettings.isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        <Check className="size-4" />
                    )}
                    Save Settings
                </Button>
            </CardContent>
        </Card>
    );
}
