import type { AutoLookConfig, LookConfig } from './look.types';

export const LOOK_DEFAULTS: Readonly<LookConfig> = {
  eyeDistanceX: 10,
  eyeDistanceY: 0,
  eyeOutDuration: 0.22,
  bodyFollowDelay: 0.11,
  bodyDistanceX: 2.5,
  bodyRotation: 0.35,
  bodyFollowDuration: 0.32,
  directionalHoldDuration: 0.45,
  eyeReturnDuration: 0.24,
  bodyReturnDelay: 0.09,
  bodyReturnDuration: 0.34,
  outwardEase: 'sine.out',
  returnEase: 'sine.inOut',
};

export const AUTO_LOOK_DEFAULTS: Readonly<AutoLookConfig> = {
  minInterval: 7,
  maxInterval: 16,
  initialDelayMin: 5,
  initialDelayMax: 12,
  leftWeight: 1,
  rightWeight: 1,
  preventThirdRepeat: true,
};
