import type { BlinkOptions, BlinkTargets } from '../blink/blink.types';
import type { LookOptions, LookTargets } from '../look/look.types';

export type RandomIdleBehavior =
  | 'long-blink'
  | 'slow-look-around'
  | 'small-upward-glance'
  | 'small-downward-glance';

export type RandomIdleState =
  | 'disabled'
  | 'waiting'
  | 'running'
  | 'paused'
  | 'destroyed';

export type RandomIdleBehaviorProbabilities = {
  longBlink: number;
  slowLookAround: number;
  smallUpwardGlance: number;
  smallDownwardGlance: number;
};

export type RandomIdleConfig = {
  minInterval: number;
  maxInterval: number;
  behaviorProbabilities: RandomIdleBehaviorProbabilities;
  longBlinkOptions: BlinkOptions;
  slowLookOptions: LookOptions;
  upwardGlanceOptions: LookOptions;
  downwardGlanceOptions: LookOptions;
};

export type RandomIdleTargets = {
  blink: BlinkTargets;
  look: LookTargets;
};

export type RandomIdleDebugSnapshot = {
  state: RandomIdleState;
  enabled: boolean;
  currentBehavior: RandomIdleBehavior | null;
  nextTriggerTime: number | null;
  lastBehavior: RandomIdleBehavior | null;
};

export type RandomIdleOptions = Partial<Pick<RandomIdleConfig, 'minInterval' | 'maxInterval'>> & {
  behaviorProbabilities?: Partial<RandomIdleBehaviorProbabilities>;
  longBlinkOptions?: BlinkOptions;
  slowLookOptions?: LookOptions;
  upwardGlanceOptions?: LookOptions;
  downwardGlanceOptions?: LookOptions;
  canRun?: () => boolean;
  onDebugChange?: (snapshot: RandomIdleDebugSnapshot) => void;
  random?: () => number;
  now?: () => number;
};

export type RandomIdleController = {
  enable: () => void;
  disable: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  destroy: () => void;
  isRunning: () => boolean;
  getDebugSnapshot: () => RandomIdleDebugSnapshot;
};
