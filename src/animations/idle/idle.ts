import { gsap } from 'gsap';
import { IDLE_DEFAULTS } from './idle.defaults';
import type { IdleConfig, IdleController, IdleOptions, IdleTargets } from './idle.types';

let activeController: IdleController | null = null;

function resolveConfig(options?: IdleOptions): IdleConfig {
  return { ...IDLE_DEFAULTS, ...options };
}

function clearIdleProperties(targets: IdleTargets) {
  gsap.set([targets.characterWrapper, targets.shadow], {
    clearProps: 'transform,transformOrigin,opacity',
  });
}

export function createIdleTimeline(
  targets: IdleTargets,
  options?: IdleOptions,
): gsap.core.Timeline {
  const config = resolveConfig(options);
  const timeline = gsap.timeline({
    repeat: -1,
    yoyo: true,
    defaults: {
      duration: config.floatSpeed,
      ease: 'sine.inOut',
    },
  });

  timeline
    .set(targets.characterWrapper, {
      y: 0,
      scaleX: config.bodyScaleXDown,
      scaleY: config.bodyScaleYDown,
      transformOrigin: '50% 50%',
    }, 0)
    .set(targets.shadow, {
      scaleX: config.shadowScaleMax,
      opacity: config.shadowOpacityMax,
      transformOrigin: '50% 50%',
    }, 0)
    .to(targets.characterWrapper, {
      y: -config.floatHeight,
      scaleX: config.bodyScaleXUp,
      scaleY: config.bodyScaleYUp,
    }, 0)
    .to(targets.shadow, {
      scaleX: config.shadowScaleMin,
      opacity: config.shadowOpacityMin,
    }, 0);

  return timeline;
}

export function playIdle(targets: IdleTargets, options?: IdleOptions): IdleController {
  if (activeController?.targets.characterWrapper === targets.characterWrapper
    && activeController.targets.shadow === targets.shadow) {
    return activeController;
  }

  if (activeController) {
    activeController.timeline.kill();
    clearIdleProperties(activeController.targets);
  }

  const timeline = createIdleTimeline(targets, options);
  const stop = () => {
    timeline.kill();
    if (activeController?.timeline === timeline) activeController = null;
  };
  const reset = () => {
    stop();
    clearIdleProperties(targets);
  };
  const controller: IdleController = {
    timeline,
    targets,
    stop,
    reset,
  };

  activeController = controller;
  return controller;
}

export function stopIdle() {
  activeController?.timeline.kill();
  activeController = null;
}

export function resetIdle(targets: IdleTargets) {
  if (activeController?.targets.characterWrapper === targets.characterWrapper
    && activeController.targets.shadow === targets.shadow) {
    stopIdle();
  }

  clearIdleProperties(targets);
}
