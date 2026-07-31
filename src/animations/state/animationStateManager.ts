import { ANIMATION_STATE_MANAGER_DEFAULTS } from './animationStateManager.defaults';
import {
  AnimationState,
  type AnimationControllerName,
  type AnimationOwner,
  type AnimationStateManager,
  type AnimationStateManagerEvent,
  type AnimationStateManagerEventMap,
  type AnimationStateManagerOptions,
  type AnimationStateSnapshot,
  type RegisteredAnimationController,
} from './animationStateManager.types';

const controllerOrder: readonly AnimationControllerName[] = [
  'idle',
  'hover',
  'look',
  'randomIdle',
];

const allowedTransitions: Readonly<Record<AnimationState, readonly AnimationState[]>> = {
  [AnimationState.Idle]: [AnimationState.Hover, AnimationState.RandomIdle],
  [AnimationState.Hover]: [
    AnimationState.Idle,
    AnimationState.ManualLook,
    AnimationState.RandomIdle,
  ],
  [AnimationState.ManualLook]: [AnimationState.Hover, AnimationState.Idle],
  [AnimationState.RandomIdle]: [AnimationState.Idle, AnimationState.Hover],
  [AnimationState.Disabled]: [
    AnimationState.Idle,
    AnimationState.Hover,
    AnimationState.ManualLook,
    AnimationState.RandomIdle,
  ],
};

function ownerForState(state: AnimationState): AnimationOwner {
  if (state === AnimationState.Idle) return 'idle';
  if (state === AnimationState.Hover) return 'hover';
  if (state === AnimationState.ManualLook) return 'look';
  if (state === AnimationState.RandomIdle) return 'randomIdle';
  return null;
}

export function createAnimationStateManager(
  options?: AnimationStateManagerOptions,
): AnimationStateManager {
  const defaultEnabled = options?.defaultEnabled
    ?? ANIMATION_STATE_MANAGER_DEFAULTS.defaultEnabled;
  const transitionSettings = {
    ...ANIMATION_STATE_MANAGER_DEFAULTS.transitionSettings,
    ...options?.transitionSettings,
  };
  const now = options?.now ?? Date.now;
  const controllers = new Map<AnimationControllerName, RegisteredAnimationController>();
  const listeners: {
    [Event in AnimationStateManagerEvent]: Set<
      (payload: AnimationStateManagerEventMap[Event]) => void
    >;
  } = {
    onStateChanged: new Set(),
    onControllerRegistered: new Set(),
    onControllerRemoved: new Set(),
  };
  let enabled = defaultEnabled;
  let destroyed = false;
  let currentState = enabled ? AnimationState.Idle : AnimationState.Disabled;
  let previousState = AnimationState.Disabled;
  let lastTransitionTime = now();

  function registeredControllerNames() {
    return controllerOrder.filter((name) => controllers.has(name));
  }

  function emit<Event extends AnimationStateManagerEvent>(
    event: Event,
    payload: AnimationStateManagerEventMap[Event],
  ) {
    for (const listener of listeners[event]) listener(payload);
  }

  function pauseController(controller: RegisteredAnimationController) {
    if (controller.pause) controller.pause();
    else controller.disable?.();
  }

  function resumeController(controller: RegisteredAnimationController) {
    controller.enable?.();
    controller.resume?.();
  }

  function reconcileOwnership() {
    const idleController = controllers.get('idle');
    if (!enabled || currentState === AnimationState.Disabled) {
      idleController?.reset?.();
      for (const [name, controller] of controllers) {
        if (name !== 'idle') pauseController(controller);
      }
      return;
    }

    if (idleController) resumeController(idleController);
    const owner = ownerForState(currentState);
    for (const [name, controller] of controllers) {
      if (name === 'idle') continue;
      if (name === 'hover' && name !== owner) controller.enable?.();
      if (name === owner) resumeController(controller);
      else pauseController(controller);
    }
  }

  function canTransition(nextState: AnimationState) {
    if (nextState === AnimationState.Disabled) return true;
    if (allowedTransitions[currentState].includes(nextState)) return true;
    if (!transitionSettings.allowPriorityOverride
      || currentState === AnimationState.Disabled) return false;

    const currentPriority = ANIMATION_STATE_MANAGER_DEFAULTS.priorities[currentState];
    const nextPriority = ANIMATION_STATE_MANAGER_DEFAULTS.priorities[nextState];
    return nextPriority > currentPriority;
  }

  function transitionTo(nextState: AnimationState, force = false) {
    if (destroyed) return false;
    if (currentState === nextState && transitionSettings.ignoreDuplicateTransitions && !force) {
      reconcileOwnership();
      return true;
    }
    if (!force && !canTransition(nextState)) return false;

    previousState = currentState;
    currentState = nextState;
    lastTransitionTime = now();
    reconcileOwnership();
    emit('onStateChanged', {
      currentState,
      previousState,
      lastTransitionTime,
      currentOwner: ownerForState(currentState),
    });
    return true;
  }

  function unregister(name: AnimationControllerName) {
    if (destroyed || !controllers.has(name)) return;
    controllers.delete(name);
    emit('onControllerRemoved', {
      name,
      registeredControllers: registeredControllerNames(),
    });
  }

  function getSnapshot(): AnimationStateSnapshot {
    return {
      currentState,
      previousState,
      lastTransitionTime,
      enabled,
      currentOwner: ownerForState(currentState),
      registeredControllers: registeredControllerNames(),
    };
  }

  const manager: AnimationStateManager = {
    enable() {
      if (destroyed || enabled) return;
      enabled = true;
      transitionTo(AnimationState.Idle, true);
    },
    disable() {
      if (destroyed || !enabled) return;
      enabled = false;
      transitionTo(AnimationState.Disabled, true);
    },
    reset() {
      if (destroyed) return;
      for (const controller of controllers.values()) controller.reset?.();
      enabled = defaultEnabled;
      transitionTo(enabled ? AnimationState.Idle : AnimationState.Disabled, true);
    },
    destroy() {
      if (destroyed) return;
      enabled = false;
      if (currentState === AnimationState.Disabled) reconcileOwnership();
      else transitionTo(AnimationState.Disabled, true);
      for (const name of registeredControllerNames()) {
        const controller = controllers.get(name);
        controller?.destroy?.();
        controllers.delete(name);
        emit('onControllerRemoved', {
          name,
          registeredControllers: registeredControllerNames(),
        });
      }
      destroyed = true;
      for (const eventListeners of Object.values(listeners)) eventListeners.clear();
    },
    setState(nextState) {
      if (destroyed) return false;
      if (nextState === AnimationState.Disabled) {
        manager.disable();
        return currentState === AnimationState.Disabled;
      }
      if (!enabled) enabled = true;
      return transitionTo(nextState);
    },
    getState: () => currentState,
    getPreviousState: () => previousState,
    getLastTransitionTime: () => lastTransitionTime,
    getCurrentOwner: () => ownerForState(currentState),
    getRegisteredControllers: registeredControllerNames,
    getSnapshot,
    isEnabled: () => enabled && !destroyed,
    register(name, controller) {
      if (destroyed) return () => {};
      if (controllers.has(name)) unregister(name);
      controllers.set(name, controller);
      reconcileOwnership();
      emit('onControllerRegistered', {
        name,
        registeredControllers: registeredControllerNames(),
      });
      return () => {
        if (controllers.get(name) === controller) unregister(name);
      };
    },
    unregister,
    subscribe(event, listener) {
      if (destroyed) return () => {};
      listeners[event].add(listener);
      return () => listeners[event].delete(listener);
    },
  };

  return manager;
}
