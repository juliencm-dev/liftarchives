import { useState, useEffect, useCallback, useRef } from 'react';

interface UseRestTimerOptions {
    defaultDuration?: number; // seconds
    onComplete?: () => void;
}

export function useRestTimer(options: UseRestTimerOptions = {}) {
    const { defaultDuration = 120, onComplete } = options;
    const [duration, setDuration] = useState(defaultDuration);
    const [remaining, setRemaining] = useState(defaultDuration);
    const [isRunning, setIsRunning] = useState(false);
    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;

    useEffect(() => {
        if (!isRunning || remaining <= 0) return;

        const interval = setInterval(() => {
            setRemaining((prev) => {
                if (prev <= 1) {
                    setIsRunning(false);
                    onCompleteRef.current?.();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, remaining]);

    const start = useCallback(
        (seconds?: number) => {
            const dur = seconds ?? duration;
            setDuration(dur);
            setRemaining(dur);
            setIsRunning(true);
        },
        [duration]
    );

    const pause = useCallback(() => setIsRunning(false), []);
    const resume = useCallback(() => setIsRunning(true), []);
    const skip = useCallback(() => {
        setIsRunning(false);
        setRemaining(0);
        onCompleteRef.current?.();
    }, []);

    const reset = useCallback(() => {
        setIsRunning(false);
        setRemaining(duration);
    }, [duration]);

    const adjust = useCallback((delta: number) => {
        setRemaining((prev) => Math.max(0, prev + delta));
        setDuration((prev) => Math.max(0, prev + delta));
    }, []);

    const progress = duration > 0 ? (duration - remaining) / duration : 0;

    return {
        remaining,
        duration,
        isRunning,
        progress,
        start,
        pause,
        resume,
        skip,
        reset,
        adjust,
    };
}
