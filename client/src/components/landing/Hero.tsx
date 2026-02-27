import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DashedBackground from './DashedBackground';
import { Link } from '@tanstack/react-router';

export function Hero() {
    return (
        <section className="relative overflow-hidden">
            <DashedBackground />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 md:pt-24 md:pb-32">
                <div className="max-w-3xl mx-auto text-center">
                    <Badge
                        variant="secondary"
                        className="border border-primary/10 text-sm font-medium mb-4 motion-preset-slide-down motion-delay-100"
                    >
                        Olympic weightlifting platform
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6 text-balance motion-preset-fade motion-delay-200">
                        Track. Train. <span className="text-primary">Compete.</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed text-pretty motion-preset-fade motion-delay-300">
                        Log your sessions, track your PRs, connect with coaches, and prepare for competition — all in
                        one platform built for Olympic weightlifters.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center motion-preset-slide-up motion-delay-500">
                        <Link to="/signup">
                            <Button size="lg" className="px-8">
                                Get Started Free
                            </Button>
                        </Link>
                        <a href="#features">
                            <Button size="lg" variant="outline" className="px-8 bg-transparent">
                                Learn More
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
