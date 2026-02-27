import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ArrowRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';

const plans = [
    {
        id: 'free',
        name: 'Free',
        price: 0,
        description: 'Perfect for getting started',
        features: ['Log training sessions', 'Track personal records', 'Basic analytics'],
    },
    {
        id: 'plus',
        name: 'Plus',
        price: 7,
        description: 'For dedicated lifters',
        popular: true,
        features: ['Everything in Free', 'Advanced analytics', 'Competition tracking', 'Program library access'],
    },
    {
        id: 'pro',
        name: 'Pro',
        price: 15,
        description: 'For serious competitors',
        features: [
            'Everything in Plus',
            'Video uploads & review',
            'Connect with a coach',
            'Custom program assignments',
            'Priority support',
        ],
    },
];

export function Pricing() {
    return (
        <section id="pricing" className="py-20 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-14 intersect intersect-once intersect:motion-preset-fade">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Choose the plan that fits your training needs. Start free and upgrade as you grow.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
                    {plans.map((plan, index) => (
                        <Card
                            key={plan.id}
                            className={`relative flex flex-col intersect intersect-once intersect:motion-preset-slide-up-md ${
                                plan.popular ? 'border-primary shadow-lg ring-1 ring-primary/20' : 'border-border'
                            }`}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                                    Popular
                                </div>
                            )}

                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg font-semibold text-foreground">{plan.name}</CardTitle>
                                <p className="text-sm text-muted-foreground">{plan.description}</p>
                                <div className="pt-2">
                                    <span className="text-3xl font-bold text-foreground">
                                        {plan.price === 0 ? 'Free' : `$${plan.price}`}
                                    </span>
                                    {plan.price > 0 && <span className="text-muted-foreground text-sm">/month</span>}
                                </div>
                            </CardHeader>

                            <CardContent className="flex-1 flex flex-col">
                                <ul className="space-y-3 flex-1">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-2.5">
                                            <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                            <span className="text-sm text-muted-foreground">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link to="/signup" className="mt-6 block">
                                    <Button variant={plan.popular ? 'default' : 'outline'} className="w-full">
                                        {plan.price === 0 ? 'Get Started' : 'Subscribe'}
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Coaching CTA */}
                <div className="mt-12 max-w-2xl mx-auto text-center intersect intersect-once intersect:motion-preset-fade">
                    <Card className="border-border bg-card/50 p-8">
                        <h3 className="text-xl font-bold text-foreground mb-2">Are you a coach?</h3>
                        <p className="text-muted-foreground mb-6">
                            Manage your athletes, assign programs, and review training — all from one platform. Get in
                            touch to learn about coaching plans.
                        </p>
                        <a href="mailto:contact@liftarchives.com">
                            <Button variant="outline" className="gap-2">
                                Contact Us <ArrowRight className="h-4 w-4" />
                            </Button>
                        </a>
                    </Card>
                </div>
            </div>
        </section>
    );
}
