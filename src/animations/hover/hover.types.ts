export type HoverState = 'disabled' | 'idle' | 'tracking' | 'returning' | 'suspended';

export type HoverTargets = {
  hoverArea: HTMLElement;
  bodyLook: HTMLElement;
  leftEyeDirection: HTMLElement;
  rightEyeDirection: HTMLElement;
};

export type HoverConfig = {
  eyeMaxX: number;
  eyeMaxY: number;
  bodyMaxX: number;
  bodyMaxY: number;
  bodyMaxRotation: number;
  eyeDuration: number;
  bodyDuration: number;
  bodyFollowDelay: number;
  returnEyeDuration: number;
  returnBodyDuration: number;
  returnBodyDelay: number;
  deadZone: number;
  trackingEase: string;
  returnEase: string;
};

export type HoverOptions = Partial<HoverConfig> & {
  onEnter?: () => void;
  onLeave?: () => void;
  onReturnComplete?: () => void;
};

export type HoverController = {
  targets: HoverTargets;
  enable: () => void;
  disable: () => void;
  suspend: () => void;
  resume: () => void;
  reset: () => void;
  destroy: () => void;
  isActive: () => boolean;
  isPointerInside: () => boolean;
  getState: () => HoverState;
};
