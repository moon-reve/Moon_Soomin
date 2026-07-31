import { playBlink } from '../blink/blink';
import type { BlinkController } from '../blink/blink.types';
import { playLook } from '../look/look';
import type { LookController, LookDirection } from '../look/look.types';
import { RANDOM_IDLE_DEFAULTS } from './randomIdle.defaults';
import type {
  RandomIdleBehavior,
  RandomIdleBehaviorProbabilities,
  RandomIdleConfig,
  RandomIdleController,
  RandomIdleDebugSnapshot,
  RandomIdleOptions,
  RandomIdleState,
  RandomIdleTargets,
} from './randomIdle.types';

type BehaviorPlayback = BlinkController | LookController;

const behaviorWeights: ReadonlyArray<readonly [RandomIdleBehavior, keyof RandomIdleBehaviorProbabilities]> = [
  ['long-blink', 'longBlink'],
  ['slow-look-around', 'slowLookAround'],
  ['small-upward-glance', 'smallUpwardGlance'],
  ['small-downward-glance', 'smallDownwardGlance'],
];

function orderedInterval(first: number, second: number) {
  const minimum = Math.max(0, Math.min(first, second));
  return [minimum, Math.max(minimum, first, second)] as const;
}

function resolveConfig(options?: RandomIdleOptions): RandomIdleConfig {
  const [minInterval, maxInterval] = orderedInterval(
    options?.minInterval ?? RANDOM_IDLE_DEFAULTS.minInterval,
    options?.maxInterval ?? RANDOM_IDLE_DEFAULTS.maxInterval,
  );

  return {
    minInterval,
    maxInterval,
    behaviorProbabilities: {
      ...RANDOM_IDLE_DEFAULTS.behaviorProbabilities,
      ...options?.behaviorProbabilities,
    },
    longBlinkOptions: {
      ...RANDOM_IDLE_DEFAULTS.longBlinkOptions,
      ...options?.longBlinkOptions,
    },
    slowLookOptions: {
      ...RANDOM_IDLE_DEFAULTS.slowLookOptions,
      ...options?.slowLookOptions,
    },
    upwardGlanceOptions: {
      ...RANDOM_IDLE_DEFAULTS.upwardGlanceOptions,
      ...options?.upwardGlanceOptions,
    },
    downwardGlanceOptions: {
      ...RANDOM_IDLE_DEFAULTS.downwardGlanceOptions,
      ...options?.downwardGlanceOptions,
    },
  };
}

function chooseWeightedBehavior(
  probabilities: RandomIdleBehaviorProbabilities,
  random: () => number,
) {
  const totalWeight = behaviorWeights.reduce(
    (total, [, probabilityKey]) => total + Math.max(0, probabilities[probabilityKey]),
    0,
  );

  if (totalWeight <= 0) {
    return behaviorWeights[Math.floor(random() * behaviorWeights.length)]?.[0] ?? 'long-blink';
  }

  let weightedRoll = random() * totalWeight;
  for (const [behavior, probabilityKey] of behaviorWeights) {
    weightedRoll -= Math.max(0, probabilities[probabilityKey]);
    if (weightedRoll < 0) return behavior;
  }

  return behaviorWeights.at(-1)?.[0] ?? 'small-downward-glance';
}

function chooseBehavior(
  probabilities: RandomIdleBehaviorProbabilities,
  previousBehavior: RandomIdleBehavior | null,
  random: () => number,
) {
  let behavior = chooseWeightedBehavior(probabilities, random);

  for (let rerollCount = 0; behavior === previousBehavior && rerollCount < 12; rerollCount += 1) {
    behavior = chooseWeightedBehavior(probabilities, random);
  }

  if (behavior !== previousBehavior) return behavior;
  return behaviorWeights.find(([candidate]) => candidate !== previousBehavior)?.[0] ?? behavior;
}

export function createRandomIdleController(
  targets: RandomIdleTargets,
  options?: RandomIdleOptions,
): RandomIdleController {
  const config = resolveConfig(options);
  const canRun = options?.canRun ?? (() => true);
  const onDebugChange = options?.onDebugChange;
  const random = options?.random ?? Math.random;
  const now = options?.now ?? Date.now;
  let enabled = false;
  let paused = false;
  let destroyed = false;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let activePlayback: BehaviorPlayback | null = null;
  let currentBehavior: RandomIdleBehavior | null = null;
  let lastBehavior: RandomIdleBehavior | null = null;
  let lastSelectedBehavior: RandomIdleBehavior | null = null;
  let nextTriggerTime: number | null = null;
  let generation = 0;

  function deriveState(): RandomIdleState {
    if (destroyed) return 'destroyed';
    if (currentBehavior) return 'running';
    if (!enabled) return 'disabled';
    if (paused || !canRun()) return 'paused';
    return 'waiting';
  }

  function getDebugSnapshot(): RandomIdleDebugSnapshot {
    return {
      state: deriveState(),
      enabled,
      currentBehavior,
      nextTriggerTime,
      lastBehavior,
    };
  }

  function notifyDebugChange() {
    onDebugChange?.(getDebugSnapshot());
  }

  function clearPendingTimer() {
    if (timeoutId !== null) clearTimeout(timeoutId);
    timeoutId = null;
    nextTriggerTime = null;
  }

  function playBehavior(behavior: RandomIdleBehavior): BehaviorPlayback {
    if (behavior === 'long-blink') {
      return playBlink(targets.blink, config.longBlinkOptions);
    }

    if (behavior === 'slow-look-around') {
      const direction: LookDirection = random() < 0.5 ? 'left' : 'right';
      return playLook(targets.look, direction, config.slowLookOptions);
    }

    if (behavior === 'small-upward-glance') {
      return playLook(targets.look, 'right', config.upwardGlanceOptions);
    }

    return playLook(targets.look, 'right', config.downwardGlanceOptions);
  }

  function scheduleNext(): void {
    clearPendingTimer();
    if (destroyed || !enabled || paused || currentBehavior || !canRun()) {
      notifyDebugChange();
      return;
    }

    const delay = config.minInterval + (random() * (config.maxInterval - config.minInterval));
    const scheduleGeneration = ++generation;
    nextTriggerTime = now() + delay;
    notifyDebugChange();

    timeoutId = setTimeout(() => {
      timeoutId = null;
      nextTriggerTime = null;
      if (destroyed
        || !enabled
        || paused
        || currentBehavior
        || !canRun()
        || generation !== scheduleGeneration) {
        notifyDebugChange();
        return;
      }

      const behavior = chooseBehavior(
        config.behaviorProbabilities,
        lastSelectedBehavior,
        random,
      );
      const behaviorGeneration = ++generation;
      let settled = false;
      lastSelectedBehavior = behavior;
      currentBehavior = behavior;
      activePlayback = playBehavior(behavior);
      const playback = activePlayback;
      const timeline = playback.timeline;
      const previousInterrupt = timeline.eventCallback('onInterrupt') as (() => void) | null;
      notifyDebugChange();

      const settle = (completed: boolean) => {
        if (settled) return;
        settled = true;
        timeline.eventCallback('onInterrupt', previousInterrupt);
        if (destroyed || generation !== behaviorGeneration || activePlayback !== playback) return;
        activePlayback = null;
        currentBehavior = null;
        if (completed) lastBehavior = behavior;
        if (enabled && !paused && canRun()) scheduleNext();
        else notifyDebugChange();
      };

      timeline.eventCallback('onInterrupt', () => {
        previousInterrupt?.();
        settle(false);
      });
      void timeline.then(() => settle(true));
    }, delay);
  }

  function stopActivePlayback() {
    const playback = activePlayback;
    activePlayback = null;
    currentBehavior = null;
    if (playback) playback.reset();
  }

  const controller: RandomIdleController = {
    enable() {
      if (destroyed || enabled) return;
      enabled = true;
      paused = false;
      scheduleNext();
    },
    disable() {
      if (destroyed) return;
      enabled = false;
      paused = false;
      clearPendingTimer();
      notifyDebugChange();
    },
    pause() {
      if (destroyed || !enabled || paused) return;
      paused = true;
      clearPendingTimer();
      notifyDebugChange();
    },
    resume() {
      if (destroyed || !enabled) return;
      paused = false;
      if (!currentBehavior) scheduleNext();
      else notifyDebugChange();
    },
    reset() {
      if (destroyed) return;
      enabled = false;
      paused = false;
      generation += 1;
      clearPendingTimer();
      stopActivePlayback();
      lastBehavior = null;
      lastSelectedBehavior = null;
      notifyDebugChange();
    },
    destroy() {
      if (destroyed) return;
      enabled = false;
      paused = false;
      destroyed = true;
      generation += 1;
      clearPendingTimer();
      stopActivePlayback();
      lastBehavior = null;
      lastSelectedBehavior = null;
      notifyDebugChange();
    },
    isRunning() {
      return !destroyed && enabled && !paused && canRun();
    },
    getDebugSnapshot,
  };

  notifyDebugChange();
  return controller;
}
