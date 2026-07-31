import { AUTO_LOOK_DEFAULTS } from './look.defaults';
import { isLookPlaying, playLook, resetLook } from './look';
import type {
  AutoLookConfig,
  AutoLookController,
  AutoLookOptions,
  AutoLookTargets,
  LookController,
  LookDirection,
} from './look.types';

type AutoLookState = {
  controller: AutoLookController;
  config: AutoLookConfig;
  running: boolean;
  timeoutId: ReturnType<typeof setTimeout> | null;
  waitingLook: LookController | null;
  suspended: boolean;
  generation: number;
  lastDirection: LookDirection | null;
  consecutiveDirectionCount: number;
};

let activeState: AutoLookState | null = null;

function orderedRange(first: number, second: number) {
  const lower = Math.max(0, Math.min(first, second));
  return [lower, Math.max(lower, first, second)] as const;
}

function resolveConfig(options?: AutoLookOptions): AutoLookConfig {
  const config = { ...AUTO_LOOK_DEFAULTS, ...options };
  const [minInterval, maxInterval] = orderedRange(config.minInterval, config.maxInterval);
  const [initialDelayMin, initialDelayMax] = orderedRange(
    config.initialDelayMin,
    config.initialDelayMax,
  );

  return {
    minInterval,
    maxInterval,
    initialDelayMin,
    initialDelayMax,
    leftWeight: Math.max(0, config.leftWeight),
    rightWeight: Math.max(0, config.rightWeight),
    preventThirdRepeat: config.preventThirdRepeat,
  };
}

function randomBetween(min: number, max: number) {
  return min + (Math.random() * (max - min));
}

function clearPendingTimeout(state: AutoLookState) {
  if (state.timeoutId !== null) {
    clearTimeout(state.timeoutId);
    state.timeoutId = null;
  }
}

function targetsAreValid(targets: AutoLookTargets) {
  return targets.body.isConnected
    && targets.leftEye.isConnected
    && targets.rightEye.isConnected;
}

function chooseDirection(state: AutoLookState): LookDirection {
  if (state.config.preventThirdRepeat && state.consecutiveDirectionCount >= 2) {
    return state.lastDirection === 'left' ? 'right' : 'left';
  }

  const totalWeight = state.config.leftWeight + state.config.rightWeight;
  if (totalWeight <= 0) return Math.random() < 0.5 ? 'left' : 'right';

  return Math.random() * totalWeight < state.config.leftWeight ? 'left' : 'right';
}

function recordDirection(state: AutoLookState, direction: LookDirection) {
  if (state.lastDirection === direction) state.consecutiveDirectionCount += 1;
  else {
    state.lastDirection = direction;
    state.consecutiveDirectionCount = 1;
  }
}

function scheduleAfterLook(state: AutoLookState, look: LookController): void {
  clearPendingTimeout(state);
  state.waitingLook = look;
  const generation = ++state.generation;

  void look.timeline.then(() => {
    if (activeState !== state
      || !state.running
      || state.suspended
      || state.generation !== generation) return;
    state.waitingLook = null;
    scheduleNext(state, false);
  });
}

function scheduleNext(state: AutoLookState, useInitialDelay: boolean): void {
  if (state.suspended) return;
  clearPendingTimeout(state);
  state.waitingLook = null;
  const generation = ++state.generation;
  const delay = useInitialDelay
    ? randomBetween(state.config.initialDelayMin, state.config.initialDelayMax)
    : randomBetween(state.config.minInterval, state.config.maxInterval);

  state.timeoutId = setTimeout(() => {
    state.timeoutId = null;
    if (activeState !== state
      || !state.running
      || state.suspended
      || state.generation !== generation) return;

    if (!targetsAreValid(state.controller.targets) || isLookPlaying()) {
      scheduleNext(state, false);
      return;
    }

    const direction = chooseDirection(state);
    recordDirection(state, direction);
    const look = playLook(state.controller.targets, direction);
    scheduleAfterLook(state, look);
  }, delay * 1000);
}

export function startAutoLook(
  targets: AutoLookTargets,
  options?: AutoLookOptions,
): AutoLookController {
  if (activeState) {
    if (activeState.controller.targets.body === targets.body
      && activeState.controller.targets.leftEye === targets.leftEye
      && activeState.controller.targets.rightEye === targets.rightEye) {
      updateAutoLookOptions(options ?? {});
      return activeState.controller;
    }

    stopAutoLook();
  }

  const controller: AutoLookController = {
    targets,
    getConfig: () => activeState?.controller === controller
      ? activeState.config
      : resolveConfig(options),
    isRunning: () => activeState?.controller === controller
      && activeState.running
      && !activeState.suspended,
    stop: () => {
      if (activeState?.controller === controller) stopAutoLook();
    },
    reset: () => {
      if (activeState?.controller === controller) resetAutoLook(targets);
    },
    updateOptions: (nextOptions) => {
      if (activeState?.controller === controller) updateAutoLookOptions(nextOptions);
    },
    rescheduleAfter: (look, direction) => {
      if (activeState?.controller === controller) {
        rescheduleAutoLookAfter(look, direction);
      }
    },
    suspend: () => {
      if (activeState?.controller === controller) suspendAutoLook();
    },
    resume: () => {
      if (activeState?.controller === controller) resumeAutoLook();
    },
  };

  const state: AutoLookState = {
    controller,
    config: resolveConfig(options),
    running: true,
    timeoutId: null,
    waitingLook: null,
    suspended: false,
    generation: 0,
    lastDirection: null,
    consecutiveDirectionCount: 0,
  };

  activeState = state;
  scheduleNext(state, true);
  return controller;
}

export function stopAutoLook() {
  if (!activeState) return;

  const state = activeState;
  state.running = false;
  state.generation += 1;
  state.waitingLook = null;
  clearPendingTimeout(state);
  activeState = null;
}

export function resetAutoLook(targets: AutoLookTargets) {
  stopAutoLook();
  resetLook(targets);
}

export function updateAutoLookOptions(options: AutoLookOptions) {
  if (!activeState) return;

  activeState.config = resolveConfig({ ...activeState.config, ...options });
  if (activeState.suspended) return;
  if (activeState.waitingLook) scheduleAfterLook(activeState, activeState.waitingLook);
  else scheduleNext(activeState, false);
}

export function rescheduleAutoLookAfter(
  look: LookController,
  direction: LookDirection = look.direction,
) {
  if (!activeState?.running) return;

  recordDirection(activeState, direction);
  if (activeState.suspended) return;
  scheduleAfterLook(activeState, look);
}

export function suspendAutoLook() {
  if (!activeState?.running || activeState.suspended) return;

  activeState.suspended = true;
  activeState.generation += 1;
  clearPendingTimeout(activeState);
  activeState.waitingLook?.stop();
  activeState.waitingLook = null;
}

export function resumeAutoLook() {
  if (!activeState?.running || !activeState.suspended) return;

  activeState.suspended = false;
  scheduleNext(activeState, false);
}
