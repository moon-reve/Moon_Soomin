import { gsap } from 'gsap';
import { LOOK_DEFAULTS } from './look.defaults';
import type {
  LookConfig,
  LookController,
  LookDirection,
  LookOptions,
  LookPlaybackOptions,
  LookTargets,
} from './look.types';

let activeController: LookController | null = null;

function resolveConfig(options?: LookOptions): LookConfig {
  return { ...LOOK_DEFAULTS, ...options };
}

function clearLookProperties(targets: LookTargets) {
  gsap.set([targets.body, targets.leftEye, targets.rightEye], {
    clearProps: 'transform,transformOrigin',
  });
}

export function createLookTimeline(
  targets: LookTargets,
  direction: LookDirection,
  options?: LookOptions,
): gsap.core.Timeline {
  const config = resolveConfig(options);
  const directionMultiplier = direction === 'left' ? -1 : 1;
  const eyeTargets = [targets.leftEye, targets.rightEye];
  const bodyOutStart = config.bodyFollowDelay;
  const holdStart = bodyOutStart + config.bodyFollowDuration;
  const eyeReturnStart = holdStart + config.directionalHoldDuration;
  const bodyReturnStart = eyeReturnStart + config.bodyReturnDelay;
  const timeline = gsap.timeline();

  timeline
    .set(eyeTargets, { transformOrigin: '50% 50%' }, 0)
    .set(targets.body, { transformOrigin: '50% 50%' }, 0)
    .to(eyeTargets, {
      x: config.eyeDistanceX * directionMultiplier,
      y: config.eyeDistanceY,
      duration: config.eyeOutDuration,
      ease: config.outwardEase,
    }, 0)
    .to(targets.body, {
      x: config.bodyDistanceX * directionMultiplier,
      rotation: config.bodyRotation * directionMultiplier,
      duration: config.bodyFollowDuration,
      ease: config.outwardEase,
    }, bodyOutStart)
    .to(eyeTargets, {
      x: 0,
      y: 0,
      duration: config.eyeReturnDuration,
      ease: config.returnEase,
    }, eyeReturnStart)
    .to(targets.body, {
      x: 0,
      rotation: 0,
      duration: config.bodyReturnDuration,
      ease: config.returnEase,
    }, bodyReturnStart);

  return timeline;
}

export function playLook(
  targets: LookTargets,
  direction: LookDirection,
  options?: LookOptions,
  playbackOptions?: LookPlaybackOptions,
): LookController {
  if (activeController) {
    activeController.timeline.kill();
    if (!playbackOptions?.preserveCurrentTransform) {
      clearLookProperties(activeController.targets);
    }
    activeController = null;
  }

  if (!playbackOptions?.preserveCurrentTransform) clearLookProperties(targets);
  const timeline = createLookTimeline(targets, direction, options);
  const stop = () => {
    timeline.kill();
    if (activeController?.timeline === timeline) activeController = null;
  };
  const reset = () => {
    stop();
    clearLookProperties(targets);
  };
  const controller: LookController = {
    timeline,
    targets,
    direction,
    stop,
    reset,
  };

  activeController = controller;
  timeline.eventCallback('onComplete', () => {
    clearLookProperties(targets);
    if (activeController?.timeline === timeline) activeController = null;
  });

  return controller;
}

export function stopLook() {
  activeController?.timeline.kill();
  activeController = null;
}

export function resetLook(targets: LookTargets) {
  if (activeController?.targets.body === targets.body
    && activeController.targets.leftEye === targets.leftEye
    && activeController.targets.rightEye === targets.rightEye) {
    stopLook();
  }

  clearLookProperties(targets);
}

export function isLookPlaying() {
  return activeController !== null;
}
