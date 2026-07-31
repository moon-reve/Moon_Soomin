import { gsap } from 'gsap';
import { HOVER_V2_DEFAULTS } from './hoverV2.defaults';
import type {
  HoverV2Controller,
  HoverV2DebugSnapshot,
  HoverV2Options,
  HoverV2State,
  HoverV2Targets,
} from './hoverV2.types';

type QuickToFunction = ReturnType<typeof gsap.quickTo>;

type PointerMetrics = Omit<HoverV2DebugSnapshot, 'state' | 'pointerInside' | 'pointerX' | 'pointerY'>;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(value: number) {
  return value * value * (3 - (2 * value));
}

function calculateDistanceFactor(normalizedDistance: number, options: HoverV2Options) {
  const distanceProgress = clamp(
    1 - (normalizedDistance / Math.max(options.distanceOuterLimit, 0.001)),
    0,
    1,
  );
  const easedProximity = smoothstep(distanceProgress);
  const distanceFactor = options.distanceMinFactor
    + (easedProximity * (options.distanceMaxFactor - options.distanceMinFactor));

  return clamp(
    distanceFactor,
    Math.min(options.distanceMinFactor, options.distanceMaxFactor),
    Math.max(options.distanceMinFactor, options.distanceMaxFactor),
  );
}

function createEmptySnapshot(state: HoverV2State): HoverV2DebugSnapshot {
  return {
    state,
    pointerInside: false,
    pointerX: null,
    pointerY: null,
    directionX: 0,
    directionY: 0,
    normalizedDistance: 0,
    distanceFactor: 0,
    targetEyeX: 0,
    targetEyeY: 0,
    targetBodyX: 0,
    targetBodyY: 0,
    targetBodyRotation: 0,
  };
}

export function createHoverV2Controller(
  targets: HoverV2Targets,
  options?: Partial<HoverV2Options>,
): HoverV2Controller {
  let config: HoverV2Options = { ...HOVER_V2_DEFAULTS, ...options };
  const eyeTargets = [...targets.eyeDirection];
  let state: HoverV2State = 'disabled';
  let enabled = false;
  let destroyed = false;
  let listenersAttached = false;
  let pointerInside = false;
  let lastPointerX: number | null = null;
  let lastPointerY: number | null = null;
  let lastStableDirectionX = 0;
  let lastStableDirectionY = 0;
  let canBodyFollow = false;
  let bodyFollowTimer: ReturnType<typeof setTimeout> | null = null;
  let returnTimeline: gsap.core.Timeline | null = null;
  let eyeXTo: QuickToFunction | null = null;
  let eyeYTo: QuickToFunction | null = null;
  let bodyXTo: QuickToFunction | null = null;
  let bodyYTo: QuickToFunction | null = null;
  let bodyRotationTo: QuickToFunction | null = null;
  let debugSnapshot = createEmptySnapshot(state);

  function setState(nextState: HoverV2State) {
    state = nextState;
    debugSnapshot.state = nextState;
  }

  function initializeQuickTo() {
    if (eyeXTo && eyeYTo && bodyXTo && bodyYTo && bodyRotationTo) return;
    disposeQuickTo();
    eyeXTo = gsap.quickTo(eyeTargets, 'x', {
      duration: config.eyeDuration,
      ease: 'power2.out',
    });
    eyeYTo = gsap.quickTo(eyeTargets, 'y', {
      duration: config.eyeDuration,
      ease: 'power2.out',
    });
    bodyXTo = gsap.quickTo(targets.bodyLook, 'x', {
      duration: config.bodyDuration,
      ease: 'power2.out',
    });
    bodyYTo = gsap.quickTo(targets.bodyLook, 'y', {
      duration: config.bodyDuration,
      ease: 'power2.out',
    });
    bodyRotationTo = gsap.quickTo(targets.bodyLook, 'rotation', {
      duration: config.bodyDuration,
      ease: 'power2.out',
    });
  }

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

  function cancelBodyFollowTimer() {
    if (bodyFollowTimer === null) return;
    clearTimeout(bodyFollowTimer);
    bodyFollowTimer = null;
  }

  function cancelReturnTimeline() {
    returnTimeline?.kill();
    returnTimeline = null;
  }

  function clearSharedTransforms() {
    gsap.set(eyeTargets, {
      x: 0,
      y: 0,
      clearProps: 'transform,transformOrigin',
    });
    gsap.set(targets.bodyLook, {
      x: 0,
      y: 0,
      rotation: 0,
      clearProps: 'transform,transformOrigin',
    });
  }

  function calculatePointerMetrics(pointerX: number, pointerY: number): PointerMetrics {
    const characterRect = targets.character.getBoundingClientRect();
    const centerX = characterRect.left + (characterRect.width / 2);
    const centerY = characterRect.top + (characterRect.height / 2);
    const deltaX = pointerX - centerX;
    const deltaY = pointerY - centerY;
    const reactionRadiusX = Math.max(characterRect.width * config.reactionRadiusXRatio, 1);
    const reactionRadiusY = Math.max(characterRect.height * config.reactionRadiusYRatio, 1);
    const ellipticalX = deltaX / reactionRadiusX;
    const ellipticalY = deltaY / reactionRadiusY;
    const normalizedDistance = Math.hypot(ellipticalX, ellipticalY);

    let directionX = lastStableDirectionX;
    let directionY = lastStableDirectionY;
    if (normalizedDistance > config.deadZone) {
      directionX = ellipticalX / normalizedDistance;
      directionY = ellipticalY / normalizedDistance;
      lastStableDirectionX = directionX;
      lastStableDirectionY = directionY;
    }

    const distanceFactor = calculateDistanceFactor(normalizedDistance, config);

    return {
      directionX,
      directionY,
      normalizedDistance,
      distanceFactor,
      targetEyeX: directionX * distanceFactor * config.eyeMaxX,
      targetEyeY: directionY * distanceFactor * config.eyeMaxY,
      targetBodyX: directionX * distanceFactor * config.bodyMaxX,
      targetBodyY: directionY * distanceFactor * config.bodyMaxY,
      targetBodyRotation: directionX * distanceFactor * config.bodyMaxRotation,
    };
  }

  function updateTargetsFromPointer() {
    if (state !== 'tracking' || lastPointerX === null || lastPointerY === null) return;
    const eyeX = eyeXTo;
    const eyeY = eyeYTo;
    const bodyX = bodyXTo;
    const bodyY = bodyYTo;
    const bodyRotation = bodyRotationTo;
    if (!eyeX || !eyeY || !bodyX || !bodyY || !bodyRotation) return;

    const metrics = calculatePointerMetrics(lastPointerX, lastPointerY);
    debugSnapshot = {
      ...debugSnapshot,
      ...metrics,
      pointerInside,
      pointerX: lastPointerX,
      pointerY: lastPointerY,
    };
    eyeX(metrics.targetEyeX);
    eyeY(metrics.targetEyeY);

    if (!canBodyFollow) return;
    bodyX(metrics.targetBodyX);
    bodyY(metrics.targetBodyY);
    bodyRotation(metrics.targetBodyRotation);
  }

  function beginBodyFollowDelay() {
    cancelBodyFollowTimer();
    canBodyFollow = false;
    bodyFollowTimer = setTimeout(() => {
      bodyFollowTimer = null;
      if (state !== 'tracking') return;
      canBodyFollow = true;
      updateTargetsFromPointer();
    }, config.bodyFollowDelay * 1000);
  }

  function beginTracking(notifyEnter: boolean) {
    cancelReturnTimeline();
    initializeQuickTo();
    setState('tracking');
    if (notifyEnter) config.onEnter?.();
    updateTargetsFromPointer();
    beginBodyFollowDelay();
  }

  function returnToNeutral() {
    cancelBodyFollowTimer();
    cancelReturnTimeline();
    disposeQuickTo();
    canBodyFollow = false;
    setState('returning');
    config.onLeave?.();

    returnTimeline = gsap.timeline({
      onComplete: () => {
        returnTimeline = null;
        if (state !== 'returning') return;
        clearSharedTransforms();
        setState(enabled ? 'idle' : 'disabled');
        config.onReturnComplete?.();
      },
    });

    returnTimeline
      .to(eyeTargets, {
        x: 0,
        y: 0,
        duration: config.returnEyeDuration,
        ease: 'power2.out',
        overwrite: true,
      }, 0)
      .to(targets.bodyLook, {
        x: 0,
        y: 0,
        rotation: 0,
        duration: config.returnBodyDuration,
        ease: 'power2.out',
        overwrite: true,
      }, config.returnBodyDelay);
  }

  function handlePointerEnter(event: PointerEvent) {
    if (event.pointerType === 'touch') return;
    pointerInside = true;
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
    debugSnapshot.pointerInside = true;
    debugSnapshot.pointerX = lastPointerX;
    debugSnapshot.pointerY = lastPointerY;
    if (!enabled || state === 'suspended') return;
    beginTracking(true);
  }

  function handlePointerMove(event: PointerEvent) {
    if (event.pointerType === 'touch') return;
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
    if (state === 'tracking') updateTargetsFromPointer();
  }

  function handlePointerLeave(event: PointerEvent) {
    if (event.pointerType === 'touch') return;
    pointerInside = false;
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
    debugSnapshot.pointerInside = false;
    debugSnapshot.pointerX = lastPointerX;
    debugSnapshot.pointerY = lastPointerY;
    if (!enabled || state === 'suspended') return;
    returnToNeutral();
  }

  function attachPointerListeners() {
    if (listenersAttached) return;
    targets.hoverArea.addEventListener('pointerenter', handlePointerEnter);
    targets.hoverArea.addEventListener('pointermove', handlePointerMove);
    targets.hoverArea.addEventListener('pointerleave', handlePointerLeave);
    listenersAttached = true;
  }

  function detachPointerListeners() {
    if (!listenersAttached) return;
    targets.hoverArea.removeEventListener('pointerenter', handlePointerEnter);
    targets.hoverArea.removeEventListener('pointermove', handlePointerMove);
    targets.hoverArea.removeEventListener('pointerleave', handlePointerLeave);
    listenersAttached = false;
  }

  const controller: HoverV2Controller = {
    updateOptions(nextOptions) {
      if (destroyed) return;
      config = { ...config, ...nextOptions };
      if (state === 'tracking') updateTargetsFromPointer();
    },
    enable() {
      if (destroyed || enabled) return;
      enabled = true;
      setState('idle');
      initializeQuickTo();
      attachPointerListeners();
    },
    disable() {
      if (destroyed) return;
      enabled = false;
      detachPointerListeners();
      cancelBodyFollowTimer();
      cancelReturnTimeline();
      disposeQuickTo();
      pointerInside = false;
      lastPointerX = null;
      lastPointerY = null;
      lastStableDirectionX = 0;
      lastStableDirectionY = 0;
      canBodyFollow = false;
      clearSharedTransforms();
      debugSnapshot = createEmptySnapshot('disabled');
      setState('disabled');
    },
    suspend() {
      if (destroyed || !enabled || state === 'suspended') return;
      cancelBodyFollowTimer();
      cancelReturnTimeline();
      disposeQuickTo();
      canBodyFollow = false;
      setState('suspended');
    },
    resume() {
      if (destroyed || !enabled || state !== 'suspended') return;
      initializeQuickTo();
      if (pointerInside && lastPointerX !== null && lastPointerY !== null) {
        beginTracking(false);
      } else {
        setState('idle');
      }
    },
    reset() {
      if (destroyed) return;
      cancelBodyFollowTimer();
      cancelReturnTimeline();
      disposeQuickTo();
      pointerInside = false;
      lastPointerX = null;
      lastPointerY = null;
      lastStableDirectionX = 0;
      lastStableDirectionY = 0;
      canBodyFollow = false;
      clearSharedTransforms();
      debugSnapshot = createEmptySnapshot(enabled ? 'idle' : 'disabled');
      setState(enabled ? 'idle' : 'disabled');
    },
    destroy() {
      if (destroyed) return;
      enabled = false;
      detachPointerListeners();
      cancelBodyFollowTimer();
      cancelReturnTimeline();
      disposeQuickTo();
      pointerInside = false;
      lastPointerX = null;
      lastPointerY = null;
      lastStableDirectionX = 0;
      lastStableDirectionY = 0;
      canBodyFollow = false;
      clearSharedTransforms();
      destroyed = true;
      debugSnapshot = createEmptySnapshot('destroyed');
      setState('destroyed');
    },
    isActive: () => state === 'tracking' || state === 'returning',
    isPointerInside: () => pointerInside,
    getState: () => state,
    getDebugSnapshot: () => ({ ...debugSnapshot }),
  };

  return controller;
}
