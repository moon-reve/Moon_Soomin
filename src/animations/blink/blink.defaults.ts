import type { AutoBlinkConfig, BlinkConfig } from './blink.types';

export const BLINK_DEFAULTS: Readonly<BlinkConfig> = {
  closedScaleY: 0.1,
  closingDuration: 0.07,
  closedHoldDuration: 0.035,
  openingDuration: 0.11,
  closingEase: 'power2.in',
  openingEase: 'power1.out',
};

export const AUTO_BLINK_DEFAULTS: Readonly<AutoBlinkConfig> = {
  minInterval: 3.5,
  maxInterval: 7,
  initialDelay: undefined,
};
