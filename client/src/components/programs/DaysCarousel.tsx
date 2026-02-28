import { type ReactNode } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselDots } from '@/components/ui/carousel';

interface DaysCarouselProps {
    children: ReactNode[];
}

/**
 * Renders day cards in a horizontal carousel, 3 visible at a time.
 * When there are 3 or fewer items, renders a plain 3-col grid (no carousel chrome).
 */
export function DaysCarousel({ children }: DaysCarouselProps) {
    if (children.length <= 3) {
        return <div className="hidden md:grid md:grid-cols-3 md:gap-6">{children}</div>;
    }

    return (
        <Carousel opts={{ align: 'start', slidesToScroll: 3 }} className="hidden md:block">
            <CarouselContent>
                {children.map((child, i) => (
                    <CarouselItem key={i} className="basis-1/3">
                        {child}
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselDots />
        </Carousel>
    );
}
