import { PercentageCalculatorContent } from '@/components/calculator/PercentageCalculator';

export function CalculatorPage() {
    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Calculator</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Percentage tables and rep max estimations for your lifts.
                </p>
            </div>
            <div className="max-w-md">
                <PercentageCalculatorContent />
            </div>
        </div>
    );
}
