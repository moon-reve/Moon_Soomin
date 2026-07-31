export type HoverV2State =
  | 'disabled'
  | 'idle'
  | 'tracking'
  | 'returning'
  | 'suspended'
  | 'destroyed';

export interface HoverV2Targets {
  hoverArea: HTMLElement;
  character: HTMLElement;
  bodyLook: HTMLElement;
  eyeDirection: readonly [HTMLElement, HTMLElement];
}

export interface HoverV2Options {
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
  reactionRadiusXRatio: number;
  reactionRadiusYRatio: number;
  distanceMinFactor: number;
  distanceMaxFactor: number;
  distanceOuterLimit: number;
  deadZone: number;
  onEnter?: () => void;
  onLeave?: () => void;
  onReturnComplete?: () => void;
}

export interface HoverV2DebugSnapshot {
  state: HoverV2State;
  pointerInside: boolean;
  pointerX: number | null;
  pointerY: number | null;
  directionX: number;
  directionY: number;
  normalizedDistance: number;
  distanceFactor: number;
  targetEyeX: number;
  targetEyeY: number;
  targetBodyX: number;
  targetBodyY: number;
  targetBodyRotation: number;
}

export interface HoverV2Controller {
  updateOptions: (options: Partial<HoverV2Options>) => void;
  enable: () => void;
  disable: () => void;
  suspend: () => void;
  resume: () => void;
  reset: () => void;
  destroy: () => void;
  isActive: () => boolean;
  isPointerInside: () => boolean;
  getState: () => HoverV2State;
  getDebugSnapshot: () => HoverV2DebugSnapshot;
}
