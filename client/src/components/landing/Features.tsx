import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FEATURES } from '@/configs/landing';

export function Features() {
    return (
        <section id="features" className="py-24 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 intersect intersect-once intersect:motion-preset-fade">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Everything You Need to Excel
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Powerful tools designed for Olympic weightlifters who want to train smarter and compete at their
                        best
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {FEATURES.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <Card
                                key={index}
                                className="border bg-card hover:shadow-lg transition-all duration-300 intersect intersect-once intersect:motion-preset-slide-up-md"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                        <Icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                                    <CardDescription className="text-sm leading-relaxed">
                                        {feature.description}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
