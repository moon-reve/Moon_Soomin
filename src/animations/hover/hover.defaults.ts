import type { HoverConfig } from './hover.types';

export const HOVER_DEFAULTS: Readonly<HoverConfig> = {
  eyeMaxX: 3.5,
  eyeMaxY: 0.8,
  bodyMaxX: 0.9,
  bodyMaxY: 0.15,
  bodyMaxRotation: 0.4,
  eyeDuration: 0.22,
  bodyDuration: 0.42,
  bodyFollowDelay: 0.07,
  returnEyeDuration: 0.28,
  returnBodyDuration: 0.45,
  returnBodyDelay: 0.07,
  deadZone: 0.06,
  trackingEase: 'power2.out',
  returnEase: 'power2.out',
};
