export enum AnimationState {
  Idle = 'Idle',
  Hover = 'Hover',
  ManualLook = 'ManualLook',
  RandomIdle = 'RandomIdle',
  Disabled = 'Disabled',
}

export type AnimationControllerName = 'idle' | 'hover' | 'look' | 'randomIdle';

export type AnimationOwner = AnimationControllerName | null;

export type RegisteredAnimationController = {
  enable?: () => void;
  disable?: () => void;
  pause?: () => void;
  resume?: () => void;
  reset?: () => void;
  destroy?: () => void;
};

export type AnimationStatePriorities = Record<
  Exclude<AnimationState, AnimationState.Disabled>,
  number
>;

export type AnimationTransitionSettings = {
  allowPriorityOverride: boolean;
  ignoreDuplicateTransitions: boolean;
};

export type AnimationStateManagerConfig = {
  priorityOrder: readonly Exclude<AnimationState, AnimationState.Disabled>[];
  priorities: AnimationStatePriorities;
  defaultEnabled: boolean;
  transitionSettings: AnimationTransitionSettings;
};

export type AnimationStateManagerOptions = Partial<Pick<AnimationStateManagerConfig, 'defaultEnabled'>> & {
  transitionSettings?: Partial<AnimationTransitionSettings>;
  now?: () => number;
};

export type AnimationStateSnapshot = {
  currentState: AnimationState;
  previousState: AnimationState;
  lastTransitionTime: number;
  enabled: boolean;
  currentOwner: AnimationOwner;
  registeredControllers: AnimationControllerName[];
};

export type AnimationStateChangedEvent = {
  currentState: AnimationState;
  previousState: AnimationState;
  lastTransitionTime: number;
  currentOwner: AnimationOwner;
};

export type AnimationControllerEvent = {
  name: AnimationControllerName;
  registeredControllers: AnimationControllerName[];
};

export type AnimationStateManagerEventMap = {
  onStateChanged: AnimationStateChangedEvent;
  onControllerRegistered: AnimationControllerEvent;
  onControllerRemoved: AnimationControllerEvent;
};

export type AnimationStateManagerEvent = keyof AnimationStateManagerEventMap;

export type AnimationStateManager = {
  enable: () => void;
  disable: () => void;
  destroy: () => void;
  reset: () => void;
  setState: (state: AnimationState) => boolean;
  getState: () => AnimationState;
  getPreviousState: () => AnimationState;
  getLastTransitionTime: () => number;
  getCurrentOwner: () => AnimationOwner;
  getRegisteredControllers: () => AnimationControllerName[];
  getSnapshot: () => AnimationStateSnapshot;
  isEnabled: () => boolean;
  register: (
    name: AnimationControllerName,
    controller: RegisteredAnimationController,
  ) => () => void;
  unregister: (name: AnimationControllerName) => void;
  subscribe: <Event extends AnimationStateManagerEvent>(
    event: Event,
    listener: (payload: AnimationStateManagerEventMap[Event]) => void,
  ) => () => void;
};
