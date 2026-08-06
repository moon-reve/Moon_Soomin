import { useEffect } from 'react';
import Lenis from 'lenis';
import { useReducedMotion } from './useReducedMotion';

let activeLenis: Lenis | null = null;
let isSmoothScrollLocked = false;

export function setSmoothScrollLocked(isLocked: boolean) {
  isSmoothScrollLocked = isLocked;

  if (isLocked) {
    activeLenis?.stop();
    return;
  }

  activeLenis?.start();
}

export function scrollToPageTarget(target: HTMLElement, immediate = false) {
  if (activeLenis) {
    activeLenis.scrollTo(target, {
      force: true,
      immediate,
      duration: immediate ? undefined : 1.2,
    });
    return;
  }

  target.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' });
}

export function useSmoothScroll() {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return undefined;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.08,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.9,
      anchors: {
        lerp: 0.08,
      },
      stopInertiaOnNavigate: true,
      prevent: (node) => node instanceof Element && Boolean(node.closest('[data-lenis-prevent]')),
    });

    activeLenis = lenis;
    if (isSmoothScrollLocked) lenis.stop();

    return () => {
      if (activeLenis === lenis) activeLenis = null;
      lenis.destroy();
    };
  }, [prefersReducedMotion]);
}
