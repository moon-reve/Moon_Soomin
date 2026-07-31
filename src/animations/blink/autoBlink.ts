import { AUTO_BLINK_DEFAULTS } from './blink.defaults';
import { playBlink, resetBlink } from './blink';
import type {
  AutoBlinkConfig,
  AutoBlinkController,
  AutoBlinkOptions,
  AutoBlinkTargets,
  BlinkController,
} from './blink.types';

type AutoBlinkState = {
  controller: AutoBlinkController;
  config: AutoBlinkConfig;
  running: boolean;
  timeoutId: ReturnType<typeof setTimeout> | null;
  waitingBlink: BlinkController | null;
  generation: number;
};

let activeState: AutoBlinkState | null = null;

function resolveConfig(options?: AutoBlinkOptions): AutoBlinkConfig {
  const config = { ...AUTO_BLINK_DEFAULTS, ...options };
  const minInterval = Math.max(0, Math.min(config.minInterval, config.maxInterval));
  const maxInterval = Math.max(minInterval, Math.max(config.minInterval, config.maxInterval));

  return {
    minInterval,
    maxInterval,
    initialDelay: config.initialDelay,
  };
}

function randomDelay(config: AutoBlinkConfig) {
  return config.minInterval + (Math.random() * (config.maxInterval - config.minInterval));
}

function clearPendingTimeout(state: AutoBlinkState) {
  if (state.timeoutId !== null) {
    clearTimeout(state.timeoutId);
    state.timeoutId = null;
  }
}

function scheduleAfterBlink(state: AutoBlinkState, blink: BlinkController): void {
  clearPendingTimeout(state);
  state.waitingBlink = blink;
  const generation = ++state.generation;

  void blink.timeline.then(() => {
    if (activeState !== state || !state.running || state.generation !== generation) return;
    state.waitingBlink = null;
    scheduleNext(state, false);
  });
}

function scheduleNext(state: AutoBlinkState, useInitialDelay: boolean): void {
  clearPendingTimeout(state);
  state.waitingBlink = null;
  const generation = ++state.generation;
  const delay = useInitialDelay && state.config.initialDelay !== undefined
    ? state.config.initialDelay
    : randomDelay(state.config);

  state.timeoutId = setTimeout(() => {
    state.timeoutId = null;
    if (activeState !== state || !state.running || state.generation !== generation) return;

    const blink = playBlink(state.controller.targets);
    scheduleAfterBlink(state, blink);
  }, delay * 1000);
}

export function startAutoBlink(
  targets: AutoBlinkTargets,
  options?: AutoBlinkOptions,
): AutoBlinkController {
  if (activeState) {
    if (activeState.controller.targets.leftEye === targets.leftEye
      && activeState.controller.targets.rightEye === targets.rightEye) {
      updateAutoBlinkOptions(options ?? {});
      return activeState.controller;
    }

    stopAutoBlink();
  }

  const controller: AutoBlinkController = {
    targets,
    getConfig: () => activeState?.controller === controller
      ? activeState.config
      : resolveConfig(options),
    isRunning: () => activeState?.controller === controller && activeState.running,
    stop: () => {
      if (activeState?.controller === controller) stopAutoBlink();
    },
    reset: () => {
      if (activeState?.controller === controller) resetAutoBlink(targets);
    },
    updateOptions: (nextOptions) => {
      if (activeState?.controller === controller) updateAutoBlinkOptions(nextOptions);
    },
    rescheduleAfter: (blink) => {
      if (activeState?.controller === controller) rescheduleAutoBlinkAfter(blink);
    },
  };

  const state: AutoBlinkState = {
    controller,
    config: resolveConfig(options),
    running: true,
    timeoutId: null,
    waitingBlink: null,
    generation: 0,
  };

  activeState = state;
  scheduleNext(state, true);
  return controller;
}

export function stopAutoBlink() {
  if (!activeState) return;

  const state = activeState;
  state.running = false;
  state.generation += 1;
  state.waitingBlink = null;
  clearPendingTimeout(state);
  activeState = null;
}

export function resetAutoBlink(targets: AutoBlinkTargets) {
  stopAutoBlink();
  resetBlink(targets);
}

export function updateAutoBlinkOptions(options: AutoBlinkOptions) {
  if (!activeState) return;

  activeState.config = resolveConfig({ ...activeState.config, ...options });
  if (activeState.waitingBlink) scheduleAfterBlink(activeState, activeState.waitingBlink);
  else scheduleNext(activeState, false);
}

export function rescheduleAutoBlinkAfter(blink: BlinkController) {
  if (!activeState?.running) return;
  scheduleAfterBlink(activeState, blink);
}
