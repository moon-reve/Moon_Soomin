import type { AnimationStateSnapshot, RandomIdleBehavior } from '../../animations';
import styles from './AnimationDebugPanel.module.scss';

export type AnimationDebugParameters = {
  floatHeight: number;
  floatSpeed: number;
  shadowScale: number;
  shadowOpacity: number;
  blinkInterval: number;
  hoverV2EyeMaxX: number;
  hoverV2EyeMaxY: number;
  hoverV2BodyMaxX: number;
  hoverV2BodyMaxY: number;
  hoverV2BodyRotation: number;
  hoverV2ReactionRadiusXRatio: number;
  hoverV2ReactionRadiusYRatio: number;
  hoverV2DistanceMinFactor: number;
  hoverV2DistanceMaxFactor: number;
  hoverV2DistanceOuterLimit: number;
  hoverV2DeadZone: number;
};

export type AnimationDebugParameter = keyof AnimationDebugParameters;

export type AnimationDebugPanelProps = {
  onIdle?: () => void;
  onBlink?: () => void;
  onLookLeft?: () => void;
  onLookRight?: () => void;
  onHover?: () => void;
  onReset?: () => void;
  parameters: AnimationDebugParameters;
  onParameterChange: (parameter: AnimationDebugParameter, value: number) => void;
  idleLoop: boolean;
  onIdleLoopChange: (enabled: boolean) => void;
  autoBlink: boolean;
  onAutoBlinkChange: (enabled: boolean) => void;
  autoLook: boolean;
  onAutoLookChange: (enabled: boolean) => void;
  randomIdleEnabled: boolean;
  onRandomIdleEnabledChange: (enabled: boolean) => void;
  randomIdleCurrentBehavior: RandomIdleBehavior | null;
  randomIdleNextTriggerTime: number | null;
  randomIdleLastBehavior: RandomIdleBehavior | null;
  managerSnapshot: AnimationStateSnapshot;
  onManagerEnabledChange: (enabled: boolean) => void;
  hoverV2Enabled: boolean;
  onHoverV2EnabledChange: (enabled: boolean) => void;
  hoverV2AreaVisible: boolean;
  onHoverV2AreaVisibleChange: (visible: boolean) => void;
};

const logAction = (action: string) => () => console.log(action);

const behaviorLabels: Record<RandomIdleBehavior, string> = {
  'long-blink': 'Long Blink',
  'slow-look-around': 'Slow Look Around',
  'small-upward-glance': 'Upward Glance',
  'small-downward-glance': 'Downward Glance',
};

function formatBehavior(behavior: RandomIdleBehavior | null) {
  return behavior ? behaviorLabels[behavior] : '—';
}

function formatNextTriggerTime(timestamp: number | null) {
  if (timestamp === null) return '—';
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

const parameterConfig = [
  { key: 'floatHeight', label: 'Float Height', min: 0, max: 16, step: 1 },
  { key: 'floatSpeed', label: 'Float Speed', min: 1.5, max: 8, step: 0.1 },
  { key: 'shadowScale', label: 'Shadow Scale', min: 0.8, max: 1, step: 0.01 },
  { key: 'shadowOpacity', label: 'Shadow Opacity', min: 0.4, max: 1, step: 0.01 },
  { key: 'blinkInterval', label: 'Blink Interval', min: 5.25, max: 10, step: 0.25 },
  { key: 'hoverV2EyeMaxX', label: 'V2 Eye Max X', min: 0, max: 10, step: 0.1 },
  { key: 'hoverV2EyeMaxY', label: 'V2 Eye Max Y', min: 0, max: 8, step: 0.1 },
  { key: 'hoverV2BodyMaxX', label: 'V2 Body Max X', min: 0, max: 4, step: 0.1 },
  { key: 'hoverV2BodyMaxY', label: 'V2 Body Max Y', min: 0, max: 3, step: 0.1 },
  { key: 'hoverV2BodyRotation', label: 'V2 Body Rotation', min: 0, max: 1, step: 0.05 },
  { key: 'hoverV2ReactionRadiusXRatio', label: 'V2 Radius X Ratio', min: 0.25, max: 1.5, step: 0.05 },
  { key: 'hoverV2ReactionRadiusYRatio', label: 'V2 Radius Y Ratio', min: 0.25, max: 1.5, step: 0.05 },
  { key: 'hoverV2DistanceMinFactor', label: 'V2 Distance Min', min: 0, max: 1, step: 0.01 },
  { key: 'hoverV2DistanceMaxFactor', label: 'V2 Distance Max', min: 0, max: 1, step: 0.01 },
  { key: 'hoverV2DistanceOuterLimit', label: 'V2 Outer Limit', min: 0.5, max: 3, step: 0.05 },
  { key: 'hoverV2DeadZone', label: 'V2 Dead Zone', min: 0, max: 0.2, step: 0.005 },
] as const;

export default function AnimationDebugPanel({
  onIdle = logAction('Idle'),
  onBlink = logAction('Blink'),
  onLookLeft = logAction('Look Left'),
  onLookRight = logAction('Look Right'),
  onHover = logAction('Hover'),
  onReset = logAction('Reset'),
  parameters,
  onParameterChange,
  idleLoop,
  onIdleLoopChange,
  autoBlink,
  onAutoBlinkChange,
  autoLook,
  onAutoLookChange,
  randomIdleEnabled,
  onRandomIdleEnabledChange,
  randomIdleCurrentBehavior,
  randomIdleNextTriggerTime,
  randomIdleLastBehavior,
  managerSnapshot,
  onManagerEnabledChange,
  hoverV2Enabled,
  onHoverV2EnabledChange,
  hoverV2AreaVisible,
  onHoverV2AreaVisibleChange,
}: AnimationDebugPanelProps) {
  const motionActions = [
    { label: 'Idle', onClick: onIdle },
    { label: 'Blink', onClick: onBlink },
    { label: 'Look Left', onClick: onLookLeft },
    { label: 'Look Right', onClick: onLookRight },
    { label: 'Hover v2', onClick: onHover },
    { label: 'Reset', onClick: onReset },
  ];

  return (
    <aside className={styles.panel} aria-label="Animation debug controls">
      <h2 className={styles.title}>Animation Debug</h2>

      <section className={styles.section} aria-labelledby="motion-heading">
        <h3 id="motion-heading" className={styles.sectionTitle}>Motion</h3>
        <div className={styles.motionActions}>
          {motionActions.map(({ label, onClick }) => (
            <button key={label} type="button" onClick={onClick}>
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="parameters-heading">
        <h3 id="parameters-heading" className={styles.sectionTitle}>Parameters</h3>
        <div className={styles.parameters}>
          {parameterConfig.map(({ key, label, min, max, step }) => (
            <label key={key} className={styles.parameter}>
              <span className={styles.controlLabel}>{label}</span>
              <output>{parameters[key]}</output>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={parameters[key]}
                aria-label={label}
                onChange={(event) => onParameterChange(key, Number(event.target.value))}
              />
            </label>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="debug-heading">
        <h3 id="debug-heading" className={styles.sectionTitle}>Debug</h3>
        <div className={styles.debugOptions}>
          <label className={styles.toggleRow}>
            <span className={styles.controlLabel}>Manager Enabled</span>
            <input
              type="checkbox"
              checked={managerSnapshot.enabled}
              aria-label="Manager Enabled"
              onChange={(event) => onManagerEnabledChange(event.target.checked)}
            />
            <span className={styles.toggle} aria-hidden="true" />
          </label>
          <dl className={styles.debugReadout}>
            <div>
              <dt>Animation State</dt>
              <dd>{managerSnapshot.currentState}</dd>
            </div>
            <div>
              <dt>Previous State</dt>
              <dd>{managerSnapshot.previousState}</dd>
            </div>
            <div>
              <dt>Registered Controllers</dt>
              <dd>{managerSnapshot.registeredControllers.join(', ') || '—'}</dd>
            </div>
            <div>
              <dt>Current Owner</dt>
              <dd>{managerSnapshot.currentOwner ?? '—'}</dd>
            </div>
            <div>
              <dt>Last Transition Time</dt>
              <dd>{formatNextTriggerTime(managerSnapshot.lastTransitionTime)}</dd>
            </div>
          </dl>
          <label className={styles.toggleRow}>
            <span className={styles.controlLabel}>Idle Loop</span>
            <input
              type="checkbox"
              checked={idleLoop}
              aria-label="Idle Loop"
              onChange={(event) => onIdleLoopChange(event.target.checked)}
            />
            <span className={styles.toggle} aria-hidden="true" />
          </label>
          <label className={styles.toggleRow}>
            <span className={styles.controlLabel}>Auto Blink</span>
            <input
              type="checkbox"
              checked={autoBlink}
              aria-label="Auto Blink"
              onChange={(event) => onAutoBlinkChange(event.target.checked)}
            />
            <span className={styles.toggle} aria-hidden="true" />
          </label>
          <label className={styles.toggleRow}>
            <span className={styles.controlLabel}>Auto Look</span>
            <input
              type="checkbox"
              checked={autoLook}
              aria-label="Auto Look"
              onChange={(event) => onAutoLookChange(event.target.checked)}
            />
            <span className={styles.toggle} aria-hidden="true" />
          </label>
          <label className={styles.toggleRow}>
            <span className={styles.controlLabel}>Random Idle Enabled</span>
            <input
              type="checkbox"
              checked={randomIdleEnabled}
              aria-label="Random Idle Enabled"
              onChange={(event) => onRandomIdleEnabledChange(event.target.checked)}
            />
            <span className={styles.toggle} aria-hidden="true" />
          </label>
          <dl className={styles.debugReadout}>
            <div>
              <dt>Current Behavior</dt>
              <dd>{formatBehavior(randomIdleCurrentBehavior)}</dd>
            </div>
            <div>
              <dt>Next Trigger Time</dt>
              <dd>{formatNextTriggerTime(randomIdleNextTriggerTime)}</dd>
            </div>
            <div>
              <dt>Last Behavior</dt>
              <dd>{formatBehavior(randomIdleLastBehavior)}</dd>
            </div>
          </dl>
          <label className={styles.toggleRow}>
            <span className={styles.controlLabel}>Hover v2 Enabled</span>
            <input
              type="checkbox"
              checked={hoverV2Enabled}
              aria-label="Hover v2 Enabled"
              onChange={(event) => onHoverV2EnabledChange(event.target.checked)}
            />
            <span className={styles.toggle} aria-hidden="true" />
          </label>
          <label className={styles.toggleRow}>
            <span className={styles.controlLabel}>Hover Area</span>
            <input
              type="checkbox"
              checked={hoverV2AreaVisible}
              aria-label="Hover Area Visualization"
              onChange={(event) => onHoverV2AreaVisibleChange(event.target.checked)}
            />
            <span className={styles.toggle} aria-hidden="true" />
          </label>
          {['Show Bounds', 'Show Pivot'].map((label) => (
            <label key={label} className={styles.toggleRow}>
              <span className={styles.controlLabel}>{label}</span>
              <input type="checkbox" aria-label={label} disabled />
              <span className={styles.toggle} aria-hidden="true" />
            </label>
          ))}
        </div>
      </section>
    </aside>
  );
}
