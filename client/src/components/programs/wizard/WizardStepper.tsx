import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
    label: string;
    number: number;
}

const steps: Step[] = [
    { label: 'Info', number: 1 },
    { label: 'Days', number: 2 },
    { label: 'Exercises', number: 3 },
    { label: 'Review', number: 4 },
];

interface WizardStepperProps {
    currentStep: number;
}

export function WizardStepper({ currentStep }: WizardStepperProps) {
    // currentStep is 0-indexed, step.number is 1-indexed
    const displayStep = currentStep + 1;

    return (
        <nav aria-label="Program creation steps" className="mx-auto w-full max-w-md px-4">
            <ol className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const isComplete = displayStep > step.number;
                    const isCurrent = displayStep === step.number;
                    const isUpcoming = displayStep < step.number;

                    return (
                        <li key={step.number} className="flex items-center">
                            <div className="flex flex-col items-center gap-2">
                                <div
                                    className={cn(
                                        'flex size-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all',
                                        isComplete && 'border-primary bg-primary/15 text-primary',
                                        isCurrent &&
                                            'border-primary bg-primary text-primary-foreground shadow-[0_0_12px_rgba(212,168,83,0.3)]',
                                        isUpcoming && 'border-border bg-secondary text-muted-foreground'
                                    )}
                                >
                                    {isComplete ? <Check className="size-4.5" strokeWidth={2.5} /> : step.number}
                                </div>
                                <span
                                    className={cn(
                                        'text-xs font-medium',
                                        isCurrent && 'text-primary',
                                        isComplete && 'text-foreground',
                                        isUpcoming && 'text-muted-foreground'
                                    )}
                                >
                                    {step.label}
                                </span>
                            </div>

                            {index < steps.length - 1 && (
                                <div
                                    className={cn(
                                        'mx-2 mb-6 h-px w-12 sm:w-16',
                                        displayStep > step.number + 1
                                            ? 'bg-primary/50'
                                            : displayStep > step.number
                                              ? 'bg-primary/30'
                                              : 'bg-border'
                                    )}
                                />
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
