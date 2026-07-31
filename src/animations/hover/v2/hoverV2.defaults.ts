import type { HoverV2Options } from './hoverV2.types';

export const HOVER_V2_DEFAULTS = {
  eyeMaxX: 10,
  eyeMaxY: 8,
  bodyMaxX: 4,
  bodyMaxY: 3,
  bodyMaxRotation: 1,
  eyeDuration: 0.2,
  bodyDuration: 0.4,
  bodyFollowDelay: 0.07,
  returnEyeDuration: 0.28,
  returnBodyDuration: 0.45,
  returnBodyDelay: 0.07,
  reactionRadiusXRatio: 1.5,
  reactionRadiusYRatio: 1.5,
  distanceMinFactor: 0.12,
  distanceMaxFactor: 1,
  distanceOuterLimit: 1.6,
  deadZone: 0.035,
} satisfies HoverV2Options;
