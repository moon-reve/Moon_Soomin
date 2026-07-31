import { gsap } from 'gsap';
import { HOVER_DEFAULTS } from './hover.defaults';
import type {
  HoverConfig,
  HoverController,
  HoverOptions,
  HoverState,
  HoverTargets,
} from './hover.types';

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function applyDeadZone(value: number, deadZone: number) {
  return Math.abs(value) < deadZone ? 0 : value;
}

function resolveConfig(options?: HoverOptions): HoverConfig {
  return {
    ...HOVER_DEFAULTS,
    ...options,
    deadZone: clamp(options?.deadZone ?? HOVER_DEFAULTS.deadZone, 0, 0.95),
  };
}

function clearHoverProperties(targets: HoverTargets) {
  gsap.set([
    targets.bodyLook,
    targets.leftEyeDirection,
    targets.rightEyeDirection,
  ], {
    clearProps: 'transform,transformOrigin',
  });
}

type QuickToFunction = ReturnType<typeof gsap.quickTo>;

export function createHoverController(
  targets: HoverTargets,
  options?: HoverOptions,
): HoverController {
  const config = resolveConfig(options);
  const eyeTargets = [targets.leftEyeDirection, targets.rightEyeDirection];
  let state: HoverState = 'disabled';
  let enabled = false;
  let destroyed = false;
  let pointerInside = false;
  let canBodyFollow = false;
  let lastClientX = 0;
  let lastClientY = 0;
  let bodyFollowTimer: ReturnType<typeof setTimeout> | null = null;
  let returnTimeline: gsap.core.Timeline | null = null;
  let eyeXTo: QuickToFunction | null = null;
  let eyeYTo: QuickToFunction | null = null;
  let bodyXTo: QuickToFunction | null = null;
  let bodyYTo: QuickToFunction | null = null;
  let bodyRotationTo: QuickToFunction | null = null;

  function disposeQuickTo() {
    eyeXTo?.tween.kill();
    eyeYTo?.tween.kill();
    bodyXTo?.tween.kill();
    bodyYTo?.tween.kill();
    bodyRotationTo?.tween.kill();
    eyeXTo = null;
    eyeYTo = null;
    bodyXTo = null;
    bodyYTo = null;
    bodyRotationTo = null;
  }

  function initializeQuickTo() {
    if (eyeXTo && eyeYTo && bodyXTo && bodyYTo && bodyRotationTo) return;

    disposeQuickTo();
    eyeXTo = gsap.quickTo(eyeTargets, 'x', {
      duration: config.eyeDuration,
      ease: config.trackingEase,
    });
    eyeYTo = gsap.quickTo(eyeTargets, 'y', {
      duration: config.eyeDuration,
      ease: config.trackingEase,
    });
    bodyXTo = gsap.quickTo(targets.bodyLook, 'x', {
      duration: config.bodyDuration,
      ease: config.trackingEase,
    });
    bodyYTo = gsap.quickTo(targets.bodyLook, 'y', {
      duration: config.bodyDuration,
      ease: config.trackingEase,
    });
    bodyRotationTo = gsap.quickTo(targets.bodyLook, 'rotation', {
      duration: config.bodyDuration,
      ease: config.trackingEase,
    });
  }

  function clearBodyFollowTimer() {
    if (bodyFollowTimer !== null) {
      clearTimeout(bodyFollowTimer);
      bodyFollowTimer = null;
    }
  }

  function killReturnTimeline() {
    returnTimeline?.kill();
    returnTimeline = null;
  }

  function getNormalizedPointer() {
    const rect = targets.hoverArea.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return { x: 0, y: 0 };

    const normalizedX = clamp((lastClientX - (rect.left + rect.width / 2)) / (rect.width / 2), -1, 1);
    const normalizedY = clamp((lastClientY - (rect.top + rect.height / 2)) / (rect.height / 2), -1, 1);

    return {
      x: applyDeadZone(normalizedX, config.deadZone),
      y: applyDeadZone(normalizedY, config.deadZone),
    };
  }

  function updateTargets() {
    if (state !== 'tracking') return;

    const eyeX = eyeXTo;
    const eyeY = eyeYTo;
    const bodyX = bodyXTo;
    const bodyY = bodyYTo;
    const bodyRotation = bodyRotationTo;
    if (!eyeX || !eyeY || !bodyX || !bodyY || !bodyRotation) return;

    const normalized = getNormalizedPointer();
    eyeX(normalized.x * config.eyeMaxX);
    eyeY(normalized.y * config.eyeMaxY);

    if (!canBodyFollow) return;
    bodyX(normalized.x * config.bodyMaxX);
    bodyY(normalized.y * config.bodyMaxY);
    bodyRotation(normalized.x * config.bodyMaxRotation);
  }

  function startBodyFollow() {
    clearBodyFollowTimer();
    canBodyFollow = false;
    bodyFollowTimer = setTimeout(() => {
      bodyFollowTimer = null;
      if (state !== 'tracking') return;
      canBodyFollow = true;
      updateTargets();
    }, config.bodyFollowDelay * 1000);
  }

  function startTracking(notifyEnter: boolean) {
    killReturnTimeline();
    initializeQuickTo();
    state = 'tracking';
    if (notifyEnter) options?.onEnter?.();
    updateTargets();
    startBodyFollow();
  }

  function returnToCenter() {
    clearBodyFollowTimer();
    killReturnTimeline();
    disposeQuickTo();
    canBodyFollow = false;
    state = 'returning';
    options?.onLeave?.();

    returnTimeline = gsap.timeline({
      onComplete: () => {
        returnTimeline = null;
        if (state !== 'returning') return;
        clearHoverProperties(targets);
        state = enabled ? 'idle' : 'disabled';
        options?.onReturnComplete?.();
      },
    });

    returnTimeline
      .to(eyeTargets, {
        x: 0,
        y: 0,
        duration: config.returnEyeDuration,
        ease: config.returnEase,
        overwrite: true,
      }, 0)
      .to(targets.bodyLook, {
        x: 0,
        y: 0,
        rotation: 0,
        duration: config.returnBodyDuration,
        ease: config.returnEase,
        overwrite: true,
      }, config.returnBodyDelay);
  }

  function handlePointerEnter(event: PointerEvent) {
    if (event.pointerType === 'touch') return;
    pointerInside = true;
    lastClientX = event.clientX;
    lastClientY = event.clientY;
    if (!enabled || state === 'suspended') return;
    startTracking(true);
  }

  function handlePointerMove(event: PointerEvent) {
    if (event.pointerType === 'touch') return;
    lastClientX = event.clientX;
    lastClientY = event.clientY;
    if (state === 'tracking') updateTargets();
  }

  function handlePointerLeave(event: PointerEvent) {
    if (event.pointerType === 'touch') return;
    pointerInside = false;
    lastClientX = event.clientX;
    lastClientY = event.clientY;
    if (!enabled || state === 'suspended') return;
    returnToCenter();
  }

  function addListeners() {
    targets.hoverArea.addEventListener('pointerenter', handlePointerEnter);
    targets.hoverArea.addEventListener('pointermove', handlePointerMove);
    targets.hoverArea.addEventListener('pointerleave', handlePointerLeave);
  }

  function removeListeners() {
    targets.hoverArea.removeEventListener('pointerenter', handlePointerEnter);
    targets.hoverArea.removeEventListener('pointermove', handlePointerMove);
    targets.hoverArea.removeEventListener('pointerleave', handlePointerLeave);
  }

  const controller: HoverController = {
    targets,
    enable() {
      if (destroyed || enabled) return;
      enabled = true;
      state = 'idle';
      initializeQuickTo();
      addListeners();
    },
    disable() {
      enabled = false;
      pointerInside = false;
      clearBodyFollowTimer();
      killReturnTimeline();
      disposeQuickTo();
      removeListeners();
      clearHoverProperties(targets);
      state = 'disabled';
    },
    suspend() {
      if (!enabled || state === 'suspended') return;
      clearBodyFollowTimer();
      killReturnTimeline();
      disposeQuickTo();
      canBodyFollow = false;
      state = 'suspended';
    },
    resume() {
      if (!enabled || state !== 'suspended') return;
      initializeQuickTo();
      if (pointerInside) startTracking(false);
      else state = 'idle';
    },
    reset() {
      enabled = false;
      clearBodyFollowTimer();
      killReturnTimeline();
      disposeQuickTo();
      removeListeners();
      pointerInside = false;
      canBodyFollow = false;
      clearHoverProperties(targets);
      state = 'disabled';
    },
    destroy() {
      if (destroyed) return;
      controller.disable();
      disposeQuickTo();
      destroyed = true;
    },
    isActive: () => state === 'tracking' || state === 'returning',
    isPointerInside: () => pointerInside,
    getState: () => state,
  };

  return controller;
}
