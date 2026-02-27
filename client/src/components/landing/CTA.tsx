import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';

export function CTA() {
    return (
        <section className="relative">
            <div className="text-center bg-primary py-24 px-12 md:px-16 intersect intersect-once intersect:motion-preset-blur-up">
                <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                    Ready to Level Up Your Training?
                </h2>
                <p className="text-lg text-primary-foreground/90 mb-8 max-w-xl mx-auto">
                    Join lifters who are already tracking smarter, training harder, and competing at their best with
                    LiftArchives.
                </p>
                <Link to="/signup">
                    <Button size="lg" className="bg-background text-foreground hover:bg-background/90 px-8">
                        Create Your Free Account
                    </Button>
                </Link>
                <p className="text-sm text-primary-foreground/80 mt-4">
                    No credit card required. Start training today.
                </p>
            </div>
        </section>
    );
}
