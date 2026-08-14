import { useEffect } from 'react';
import Lenis from 'lenis';
import { useReducedMotion } from './useReducedMotion';

let activeLenis: Lenis | null = null;
let smoothScrollLockDepth = 0;

export function setSmoothScrollLocked(isLocked: boolean) {
  smoothScrollLockDepth = Math.max(
    0,
    smoothScrollLockDepth + (isLocked ? 1 : -1),
  );

  if (smoothScrollLockDepth > 0) {
    activeLenis?.stop();
    return;
  }

  // A guided tour moves the native window while Lenis is stopped. Sync its
  // internal position before restarting so it cannot pull the page back to
  // the stale pre-tour target (usually the hero).
  activeLenis?.scrollTo(window.scrollY, {
    force: true,
    immediate: true,
  });
  activeLenis?.start();
}

export function setPageScrollPosition(scrollY: number) {
  const nextScrollY = Math.max(0, scrollY);

  // While Guided Tour owns the page, Lenis must not receive destinations at
  // all. Its old target can otherwise resume between section transitions and
  // pull the document back toward the hero.
  if (smoothScrollLockDepth > 0) {
    window.scrollTo({ top: nextScrollY, left: 0, behavior: 'auto' });
    return;
  }

  if (activeLenis) {
    activeLenis.scrollTo(nextScrollY, {
      force: true,
      immediate: true,
    });
    return;
  }

  window.scrollTo(0, nextScrollY);
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
    if (smoothScrollLockDepth > 0) lenis.stop();

    return () => {
      if (activeLenis === lenis) activeLenis = null;
      lenis.destroy();
    };
  }, [prefersReducedMotion]);
}
