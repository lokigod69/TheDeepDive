'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

interface UseLenisOptions {
  orientation?: 'vertical' | 'horizontal';
  gestureOrientation?: 'vertical' | 'horizontal' | 'both';
  smoothWheel?: boolean;
  lerp?: number;
  wrapper?: HTMLElement | null;
  content?: HTMLElement | null;
}

export function useLenis(options: UseLenisOptions = {}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const {
      orientation = 'vertical',
      gestureOrientation = 'both',
      smoothWheel = true,
      lerp = 0.1,
      wrapper,
      content,
    } = options;

    // Initialize Lenis
    lenisRef.current = new Lenis({
      orientation,
      gestureOrientation,
      smoothWheel,
      lerp,
      wrapper: wrapper ?? undefined,
      content: content ?? undefined,
    });

    // Animation frame loop
    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, [options.wrapper, options.content]);

  return lenisRef;
}

export default useLenis;
