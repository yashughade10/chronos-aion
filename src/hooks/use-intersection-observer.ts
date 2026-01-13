import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions {
    threshold?: number;
    triggerOnce?: boolean;
}

export function useIntersectionObserver(
    options: UseIntersectionObserverOptions = {}
) {
    const { threshold = 0.5, triggerOnce = true } = options;
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                const isIntersecting = entry.isIntersecting;

                if (isIntersecting) {
                    setIsVisible(true);

                    // If triggerOnce is true, stop observing after first intersection
                    if (triggerOnce) {
                        observer.unobserve(element);
                    }
                } else if (!triggerOnce) {
                    setIsVisible(false);
                }
            },
            {
                threshold
            }
        );

        observer.observe(element);

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, [threshold, triggerOnce]);

    return { elementRef, isVisible };
}
