import type { gsap } from 'gsap';

export type LookDirection = 'left' | 'right';

export type LookTargets = {
  body: HTMLElement;
  leftEye: HTMLElement;
  rightEye: HTMLElement;
};

export type LookConfig = {
  eyeDistanceX: number;
  eyeDistanceY: number;
  eyeOutDuration: number;
  bodyFollowDelay: number;
  bodyDistanceX: number;
  bodyRotation: number;
  bodyFollowDuration: number;
  directionalHoldDuration: number;
  eyeReturnDuration: number;
  bodyReturnDelay: number;
  bodyReturnDuration: number;
  outwardEase: string;
  returnEase: string;
};

export type LookOptions = Partial<LookConfig>;

export type LookPlaybackOptions = {
  preserveCurrentTransform?: boolean;
};

export type LookController = {
  timeline: gsap.core.Timeline;
  targets: LookTargets;
  direction: LookDirection;
  stop: () => void;
  reset: () => void;
};

export type AutoLookTargets = LookTargets;

export type AutoLookConfig = {
  minInterval: number;
  maxInterval: number;
  initialDelayMin: number;
  initialDelayMax: number;
  leftWeight: number;
  rightWeight: number;
  preventThirdRepeat: boolean;
};

export type AutoLookOptions = Partial<AutoLookConfig>;

export type AutoLookController = {
  targets: AutoLookTargets;
  getConfig: () => Readonly<AutoLookConfig>;
  isRunning: () => boolean;
  stop: () => void;
  reset: () => void;
  updateOptions: (options: AutoLookOptions) => void;
  rescheduleAfter: (look: LookController, direction?: LookDirection) => void;
  suspend: () => void;
  resume: () => void;
};
