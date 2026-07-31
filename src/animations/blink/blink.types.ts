import type { gsap } from 'gsap';

export type BlinkTargets = {
  eyes: HTMLElement;
  leftEye: HTMLElement;
  rightEye: HTMLElement;
};

export type BlinkConfig = {
  closedScaleY: number;
  closingDuration: number;
  closedHoldDuration: number;
  openingDuration: number;
  closingEase: string;
  openingEase: string;
};

export type BlinkOptions = Partial<BlinkConfig>;

export type BlinkController = {
  timeline: gsap.core.Timeline;
  targets: BlinkTargets;
  stop: () => void;
  reset: () => void;
};

export type AutoBlinkTargets = BlinkTargets;

export type AutoBlinkConfig = {
  minInterval: number;
  maxInterval: number;
  initialDelay?: number;
};

export type AutoBlinkOptions = Partial<AutoBlinkConfig>;

export type AutoBlinkController = {
  targets: AutoBlinkTargets;
  getConfig: () => Readonly<AutoBlinkConfig>;
  isRunning: () => boolean;
  stop: () => void;
  reset: () => void;
  updateOptions: (options: AutoBlinkOptions) => void;
  rescheduleAfter: (blink: BlinkController) => void;
};
