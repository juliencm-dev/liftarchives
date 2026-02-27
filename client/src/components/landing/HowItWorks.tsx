export function HowItWorks() {
    const steps = [
        {
            number: 1,
            title: 'Create Account',
            description: 'Sign up for free in under 30 seconds and set up your lifter profile',
        },
        {
            number: 2,
            title: 'Set Up Profile',
            description: 'Enter your weight category, competition division, and training preferences',
        },
        {
            number: 3,
            title: 'Start Training',
            description: 'Log sessions, track PRs, follow programs, and prepare for your next competition',
        },
    ];

    return (
        <section id="how-it-works" className="py-24 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 intersect intersect-half intersect:motion-preset-fade">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Get Started in Minutes</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Three simple steps to transform your training
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto relative">
                    {/* Connection line */}
                    <div className="hidden md:block absolute top-6 left-[16.666%] right-[16.666%] h-px bg-border" />

                    {steps.map((step) => (
                        <div
                            key={step.number}
                            className="text-center relative intersect intersect-once intersect:motion-preset-slide-up-md"
                            style={{ animationDelay: `${step.number * 150}ms` }}
                        >
                            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold mx-auto mb-6 relative z-10">
                                {step.number}
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
