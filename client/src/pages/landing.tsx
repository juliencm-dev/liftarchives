import { Hero, Features, HowItWorks, Pricing, CTA } from '@/components/landing';

export function LandingPage() {
    return (
        <main className="gradient-bg">
            <Hero />
            <Features />
            <HowItWorks />
            <Pricing />
            <CTA />
        </main>
    );
}
