import { AnimationState, type AnimationStateManagerConfig } from './animationStateManager.types';

export const ANIMATION_STATE_MANAGER_DEFAULTS = {
  priorityOrder: [
    AnimationState.ManualLook,
    AnimationState.Hover,
    AnimationState.RandomIdle,
    AnimationState.Idle,
  ],
  priorities: {
    [AnimationState.ManualLook]: 4,
    [AnimationState.Hover]: 3,
    [AnimationState.RandomIdle]: 2,
    [AnimationState.Idle]: 1,
  },
  defaultEnabled: true,
  transitionSettings: {
    allowPriorityOverride: true,
    ignoreDuplicateTransitions: true,
  },
} satisfies AnimationStateManagerConfig;
