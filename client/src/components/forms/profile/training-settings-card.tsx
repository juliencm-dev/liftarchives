import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Settings, Check } from 'lucide-react';
import { useTrainingSettings, useUpdateTrainingSettings } from '@/hooks/use-training-settings';
import { toast } from 'sonner';

export function TrainingSettingsCard() {
    const { data: settings, isLoading } = useTrainingSettings();
    const updateSettings = useUpdateTrainingSettings();

    const [barWeight, setBarWeight] = useState('20');
    const [olympicIncrement, setOlympicIncrement] = useState('1');
    const [powerliftingIncrement, setPowerliftingIncrement] = useState('2.5');
    const [accessoryIncrement, setAccessoryIncrement] = useState('2.5');
    const [defaultRestSeconds, setDefaultRestSeconds] = useState('120');
    const [defaultBlockRestSeconds, setDefaultBlockRestSeconds] = useState('180');

    useEffect(() => {
        if (settings) {
            setBarWeight(String(settings.barWeight));
            setOlympicIncrement(String(settings.olympicIncrement));
            setPowerliftingIncrement(String(settings.powerliftingIncrement));
            setAccessoryIncrement(String(settings.accessoryIncrement));
            setDefaultRestSeconds(String(settings.defaultRestSeconds));
            setDefaultBlockRestSeconds(String(settings.defaultBlockRestSeconds));
        }
    }, [settings]);

    const handleSave = () => {
        updateSettings.mutate(
            {
                barWeight: parseFloat(barWeight),
                olympicIncrement: parseFloat(olympicIncrement),
                powerliftingIncrement: parseFloat(powerliftingIncrement),
                accessoryIncrement: parseFloat(accessoryIncrement),
                defaultRestSeconds: parseInt(defaultRestSeconds, 10),
                defaultBlockRestSeconds: parseInt(defaultBlockRestSeconds, 10),
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
                        <Label>Olympic Increment (kg)</Label>
                        <Input
                            type="number"
                            value={olympicIncrement}
                            onChange={(e) => setOlympicIncrement(e.target.value)}
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
