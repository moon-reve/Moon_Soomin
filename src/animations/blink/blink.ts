import { gsap } from 'gsap';
import { BLINK_DEFAULTS } from './blink.defaults';
import type {
  BlinkConfig,
  BlinkController,
  BlinkOptions,
  BlinkTargets,
} from './blink.types';

let activeController: BlinkController | null = null;

function resolveConfig(options?: BlinkOptions): BlinkConfig {
  return { ...BLINK_DEFAULTS, ...options };
}

function clearBlinkProperties(targets: BlinkTargets) {
  gsap.set([targets.leftEye, targets.rightEye], {
    clearProps: 'transform,transformOrigin',
  });
}

export function createBlinkTimeline(
  targets: BlinkTargets,
  options?: BlinkOptions,
): gsap.core.Timeline {
  const config = resolveConfig(options);
  const eyeTargets = [targets.leftEye, targets.rightEye];
  const timeline = gsap.timeline();

  timeline
    .set(eyeTargets, {
      transformOrigin: '50% 50%',
    })
    .to(eyeTargets, {
      scaleY: config.closedScaleY,
      duration: config.closingDuration,
      ease: config.closingEase,
    })
    .to(eyeTargets, {
      scaleY: 1,
      duration: config.openingDuration,
      ease: config.openingEase,
    }, `+=${config.closedHoldDuration}`);

  return timeline;
}

export function playBlink(targets: BlinkTargets, options?: BlinkOptions): BlinkController {
  if (activeController) return activeController;

  clearBlinkProperties(targets);
  const timeline = createBlinkTimeline(targets, options);
  const stop = () => {
    timeline.kill();
    if (activeController?.timeline === timeline) activeController = null;
  };
  const reset = () => {
    stop();
    clearBlinkProperties(targets);
  };
  const controller: BlinkController = {
    timeline,
    targets,
    stop,
    reset,
  };

  activeController = controller;
  timeline.eventCallback('onComplete', () => {
    clearBlinkProperties(targets);
    if (activeController?.timeline === timeline) activeController = null;
  });

  return controller;
}

export function stopBlink() {
  activeController?.timeline.kill();
  activeController = null;
}

export function resetBlink(targets: BlinkTargets) {
  if (activeController?.targets.leftEye === targets.leftEye
    && activeController.targets.rightEye === targets.rightEye) {
    stopBlink();
  }

  clearBlinkProperties(targets);
}
