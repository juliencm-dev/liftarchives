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
    onStepClick?: (step: number) => void;
    isEdit?: boolean;
}

export function WizardStepper({ currentStep, onStepClick, isEdit }: WizardStepperProps) {
    // currentStep is 0-indexed, step.number is 1-indexed
    const displayStep = currentStep + 1;

    return (
        <nav
            aria-label="Program creation steps"
            className="sticky top-[6.5rem] z-20 -mx-4 shrink-0 bg-background px-4 py-3 md:top-16 lg:-mx-6 lg:px-6"
        >
            <ol className="mx-auto flex max-w-md items-center justify-between">
                {steps.map((step, index) => {
                    const isComplete = isEdit ? displayStep !== step.number : displayStep > step.number;
                    const isCurrent = displayStep === step.number;
                    const isUpcoming = isEdit ? false : displayStep < step.number;
                    const canClick = !isCurrent && (isComplete || isEdit) && onStepClick;

                    return (
                        <li key={step.number} className="flex items-center">
                            <button
                                type="button"
                                disabled={!canClick}
                                onClick={() => canClick && onStepClick(step.number - 1)}
                                className={cn(
                                    'flex flex-col items-center gap-2',
                                    canClick && 'cursor-pointer',
                                    !canClick && 'cursor-default'
                                )}
                            >
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
                            </button>

                            {index < steps.length - 1 && (
                                <div
                                    className={cn(
                                        'mx-2 mb-6 h-px w-12 sm:w-16',
                                        isEdit
                                            ? 'bg-primary/50'
                                            : displayStep > step.number + 1
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
