import type { IdleConfig } from './idle.types';

export const IDLE_DEFAULTS: Readonly<IdleConfig> = {
  floatHeight: 16,
  floatSpeed: 1.5,
  bodyScaleXUp: 0.997,
  bodyScaleYUp: 1.004,
  bodyScaleXDown: 1.003,
  bodyScaleYDown: 0.997,
  shadowScaleMin: 0.9,
  shadowScaleMax: 1.05,
  shadowOpacityMin: 0.78,
  shadowOpacityMax: 0.92,
};
