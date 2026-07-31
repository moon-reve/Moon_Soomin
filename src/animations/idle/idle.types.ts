import type { gsap } from 'gsap';

export type IdleTargets = {
  characterWrapper: HTMLElement;
  shadow: HTMLElement;
};

export type IdleConfig = {
  floatHeight: number;
  floatSpeed: number;
  bodyScaleXUp: number;
  bodyScaleYUp: number;
  bodyScaleXDown: number;
  bodyScaleYDown: number;
  shadowScaleMin: number;
  shadowScaleMax: number;
  shadowOpacityMin: number;
  shadowOpacityMax: number;
};

export type IdleOptions = Partial<IdleConfig>;

export type IdleController = {
  timeline: gsap.core.Timeline;
  targets: IdleTargets;
  stop: () => void;
  reset: () => void;
};
