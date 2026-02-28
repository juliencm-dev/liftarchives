import { useState, useMemo } from 'react';
import { Flame, Dumbbell, ArrowDownUp } from 'lucide-react';
import { BackToDashboard } from '@/components/layout/BackToDashboard';
import { LiftCard } from '@/components/lifts/LiftCard';
import { LiftProgressChart } from '@/components/lifts/LiftProgressChart';
import { LiftCategorySection } from '@/components/lifts/LiftCategorySection';
import { useLifts, usePersonalRecords } from '@/hooks/use-lifts';

const categoryConfig = {
    olympic: {
        title: 'Olympic Weightlifting',
        description: 'Snatch, Clean & Jerk and power variations',
        icon: <Flame className="size-4" />,
        accentClass: 'text-primary',
        order: 0,
    },
    powerlifting: {
        title: 'Powerlifting',
        description: 'Squat, bench press and deadlift',
        icon: <Dumbbell className="size-4" />,
        accentClass: 'text-red-400',
        order: 1,
    },
    accessory: {
        title: 'Accessories',
        description: 'Accessory and supplementary lifts',
        icon: <ArrowDownUp className="size-4" />,
        accentClass: 'text-blue-400',
        order: 2,
    },
} as const;

type LiftCategory = keyof typeof categoryConfig;

export function LiftsPage() {
    const { data: lifts = [] } = useLifts();
    const { data: allRecords = [] } = usePersonalRecords();

    const [selectedLiftId, setSelectedLiftId] = useState<string | null>(null);

    // Group records by liftId
    const recordsByLift = useMemo(() => {
        const map: Record<string, typeof allRecords> = {};
        for (const record of allRecords) {
            if (!map[record.liftId]) map[record.liftId] = [];
            map[record.liftId].push(record);
        }
        return map;
    }, [allRecords]);

    // Group lifts by category
    const liftsByCategory = useMemo(() => {
        const map: Partial<Record<LiftCategory, typeof lifts>> = {};
        for (const lift of lifts) {
            const cat = lift.category as LiftCategory;
            if (!map[cat]) map[cat] = [];
            map[cat]!.push(lift);
        }
        return map;
    }, [lifts]);

    // Sorted category keys
    const sortedCategories = useMemo(() => {
        return (Object.keys(liftsByCategory) as LiftCategory[]).sort(
            (a, b) => categoryConfig[a].order - categoryConfig[b].order
        );
    }, [liftsByCategory]);

    // Auto-select first visible lift (first lift in first category section)
    const firstVisibleLiftId =
        sortedCategories.length > 0 ? (liftsByCategory[sortedCategories[0]]?.[0]?.id ?? null) : null;
    const effectiveLiftId = selectedLiftId ?? firstVisibleLiftId;
    const selectedLift = lifts.find((l) => l.id === effectiveLiftId);
    const selectedRecords = effectiveLiftId ? (recordsByLift[effectiveLiftId] ?? []) : [];

    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
            {/* Page header */}
            <div className="flex flex-col gap-1">
                <div className="hidden md:block">
                    <BackToDashboard />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Lifts</h1>
                    <p className="text-sm text-muted-foreground">
                        Track your personal records and monitor lift progression over time.
                    </p>
                </div>
            </div>

            {/* Progression Chart - Full width */}
            <div className="mt-6">
                <LiftProgressChart liftName={selectedLift?.name ?? 'Select a lift'} records={selectedRecords} />
            </div>

            {/* Lift Categories */}
            <div className="mt-8 flex flex-col gap-8">
                {sortedCategories.map((category) => {
                    const config = categoryConfig[category];
                    const categoryLifts = liftsByCategory[category] ?? [];

                    return (
                        <LiftCategorySection
                            key={category}
                            title={config.title}
                            description={config.description}
                            icon={config.icon}
                            accentClass={config.accentClass}
                        >
                            {categoryLifts.map((lift) => (
                                <LiftCard
                                    key={lift.id}
                                    lift={lift}
                                    records={recordsByLift[lift.id] ?? []}
                                    isSelected={lift.id === effectiveLiftId}
                                    onSelect={() => setSelectedLiftId(lift.id)}
                                />
                            ))}
                        </LiftCategorySection>
                    );
                })}
            </div>
        </div>
    );
}
