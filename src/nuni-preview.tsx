import {
  StrictMode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { createRoot } from 'react-dom/client';
import {
  AUTO_BLINK_DEFAULTS,
  AUTO_LOOK_DEFAULTS,
  HOVER_V2_DEFAULTS,
  IDLE_DEFAULTS,
  LOOK_DEFAULTS,
  AnimationState,
  createAnimationStateManager,
  createRandomIdleController,
  createHoverV2Controller,
  playBlink,
  playIdle,
  playLook,
  resetBlink,
  resetAutoBlink,
  resetAutoLook,
  resetIdle,
  resetLook,
  resumeAutoLook,
  rescheduleAutoBlinkAfter,
  rescheduleAutoLookAfter,
  startAutoBlink,
  startAutoLook,
  stopAutoBlink,
  stopAutoLook,
  stopBlink,
  stopIdle,
  stopLook,
  suspendAutoLook,
  type AutoBlinkOptions,
  type AutoLookOptions,
  type AnimationStateSnapshot,
  type BlinkTargets,
  type HoverV2Controller,
  type HoverV2Options,
  type HoverV2Targets,
  type IdleOptions,
  type IdleTargets,
  type LookDirection,
  type LookOptions,
  type LookTargets,
  type RandomIdleController,
  type RandomIdleDebugSnapshot,
  type RandomIdleTargets,
} from './animations';
import AnimationDebugPanel, {
  type AnimationDebugParameter,
  type AnimationDebugParameters,
} from './components/dev/AnimationDebugPanel';
import Nuni, { type NuniHandle } from './components/guide/Nuni/Nuni';
import { useReducedMotion } from './hooks/useReducedMotion';
import './styles/nuni-preview.scss';

const initialParameters: AnimationDebugParameters = {
  floatHeight: IDLE_DEFAULTS.floatHeight,
  floatSpeed: IDLE_DEFAULTS.floatSpeed,
  shadowScale: IDLE_DEFAULTS.shadowScaleMin,
  shadowOpacity: IDLE_DEFAULTS.shadowOpacityMin,
  blinkInterval: (AUTO_BLINK_DEFAULTS.minInterval + AUTO_BLINK_DEFAULTS.maxInterval) / 2,
  hoverV2EyeMaxX: HOVER_V2_DEFAULTS.eyeMaxX,
  hoverV2EyeMaxY: HOVER_V2_DEFAULTS.eyeMaxY,
  hoverV2BodyMaxX: HOVER_V2_DEFAULTS.bodyMaxX,
  hoverV2BodyMaxY: HOVER_V2_DEFAULTS.bodyMaxY,
  hoverV2BodyRotation: HOVER_V2_DEFAULTS.bodyMaxRotation,
  hoverV2ReactionRadiusXRatio: HOVER_V2_DEFAULTS.reactionRadiusXRatio,
  hoverV2ReactionRadiusYRatio: HOVER_V2_DEFAULTS.reactionRadiusYRatio,
  hoverV2DistanceMinFactor: HOVER_V2_DEFAULTS.distanceMinFactor,
  hoverV2DistanceMaxFactor: HOVER_V2_DEFAULTS.distanceMaxFactor,
  hoverV2DistanceOuterLimit: HOVER_V2_DEFAULTS.distanceOuterLimit,
  hoverV2DeadZone: HOVER_V2_DEFAULTS.deadZone,
};

const initialRandomIdleSnapshot: RandomIdleDebugSnapshot = {
  state: 'disabled',
  enabled: false,
  currentBehavior: null,
  nextTriggerTime: null,
  lastBehavior: null,
};

function NuniPreview() {
  const [stateManager] = useState(() => createAnimationStateManager());
  const [managerSnapshot, setManagerSnapshot] = useState<AnimationStateSnapshot>(
    () => stateManager.getSnapshot(),
  );
  const nuniRef = useRef<NuniHandle>(null);
  const hoverAreaRef = useRef<HTMLDivElement>(null);
  const hoverControllerRef = useRef<HoverV2Controller | null>(null);
  const randomIdleControllerRef = useRef<RandomIdleController | null>(null);
  const manualLookGenerationRef = useRef(0);
  const managerLifecycleGenerationRef = useRef(0);
  const prefersReducedMotion = useReducedMotion();
  const [parameters, setParameters] = useState(initialParameters);
  const [idleLoop, setIdleLoop] = useState(true);
  const [idleRequested, setIdleRequested] = useState(true);
  const [autoBlink, setAutoBlink] = useState(false);
  const [autoLook, setAutoLook] = useState(false);
  const [randomIdleEnabled, setRandomIdleEnabled] = useState(true);
  const [randomIdleSnapshot, setRandomIdleSnapshot] = useState(initialRandomIdleSnapshot);
  const [pointerInsideHover, setPointerInsideHover] = useState(false);
  const [hoverV2Enabled, setHoverV2Enabled] = useState(false);
  const [hoverV2AreaVisible, setHoverV2AreaVisible] = useState(false);
  const autoLookEnabledRef = useRef(autoLook);
  const reducedMotionRef = useRef(prefersReducedMotion);
  const randomIdleEnabledRef = useRef(randomIdleEnabled);
  const hoverV2EnabledRef = useRef(hoverV2Enabled);
  const pointerInsideHoverRef = useRef(pointerInsideHover);

  useEffect(() => {
    autoLookEnabledRef.current = autoLook;
    reducedMotionRef.current = prefersReducedMotion;
    randomIdleEnabledRef.current = randomIdleEnabled;
    hoverV2EnabledRef.current = hoverV2Enabled;
    pointerInsideHoverRef.current = pointerInsideHover;
  }, [autoLook, hoverV2Enabled, pointerInsideHover, prefersReducedMotion, randomIdleEnabled]);

  useEffect(() => {
    managerLifecycleGenerationRef.current += 1;
    const syncSnapshot = () => setManagerSnapshot(stateManager.getSnapshot());
    const removeStateListener = stateManager.subscribe('onStateChanged', ({ currentState }) => {
      syncSnapshot();
      if (currentState === AnimationState.Hover
        || currentState === AnimationState.ManualLook
        || currentState === AnimationState.Disabled) {
        suspendAutoLook();
      } else if (autoLookEnabledRef.current && !reducedMotionRef.current) {
        resumeAutoLook();
      }
    });
    const removeRegisteredListener = stateManager.subscribe(
      'onControllerRegistered',
      syncSnapshot,
    );
    const removeRemovedListener = stateManager.subscribe('onControllerRemoved', syncSnapshot);
    syncSnapshot();

    return () => {
      removeStateListener();
      removeRegisteredListener();
      removeRemovedListener();
      const cleanupGeneration = ++managerLifecycleGenerationRef.current;
      queueMicrotask(() => {
        if (managerLifecycleGenerationRef.current === cleanupGeneration) stateManager.destroy();
      });
    };
  }, [stateManager]);

  const transitionToRestingState = useCallback(() => {
    if (!stateManager.isEnabled()) return;

    let nextState = AnimationState.Idle;
    if (hoverV2EnabledRef.current && pointerInsideHoverRef.current) {
      nextState = AnimationState.Hover;
    } else if (randomIdleEnabledRef.current
      && !autoLookEnabledRef.current
      && !reducedMotionRef.current
      && !pointerInsideHoverRef.current) {
      nextState = AnimationState.RandomIdle;
    }

    if (stateManager.getState() === AnimationState.ManualLook
      && nextState === AnimationState.RandomIdle) {
      stateManager.setState(AnimationState.Idle);
    }
    stateManager.setState(nextState);
  }, [stateManager]);

  const autoLookOptions = useMemo<AutoLookOptions>(() => ({
    ...AUTO_LOOK_DEFAULTS,
  }), []);

  const idleOptions = useMemo<IdleOptions>(() => ({
    floatHeight: parameters.floatHeight,
    floatSpeed: parameters.floatSpeed,
    shadowScaleMin: parameters.shadowScale,
    shadowScaleMax: 1 + ((1 - parameters.shadowScale) * 0.5),
    shadowOpacityMin: parameters.shadowOpacity,
    shadowOpacityMax: Math.min(1, parameters.shadowOpacity + 0.14),
  }), [parameters]);

  const hoverV2Options = useMemo<Partial<HoverV2Options>>(() => ({
    eyeMaxX: parameters.hoverV2EyeMaxX,
    eyeMaxY: parameters.hoverV2EyeMaxY,
    bodyMaxX: parameters.hoverV2BodyMaxX,
    bodyMaxY: parameters.hoverV2BodyMaxY,
    bodyMaxRotation: parameters.hoverV2BodyRotation,
    reactionRadiusXRatio: parameters.hoverV2ReactionRadiusXRatio,
    reactionRadiusYRatio: parameters.hoverV2ReactionRadiusYRatio,
    distanceMinFactor: parameters.hoverV2DistanceMinFactor,
    distanceMaxFactor: parameters.hoverV2DistanceMaxFactor,
    distanceOuterLimit: parameters.hoverV2DistanceOuterLimit,
    deadZone: parameters.hoverV2DeadZone,
  }), [parameters]);

  const autoBlinkOptions = useMemo<AutoBlinkOptions>(() => {
    const intervalSpread = (
      AUTO_BLINK_DEFAULTS.maxInterval - AUTO_BLINK_DEFAULTS.minInterval
    ) / 2;

    return {
      minInterval: parameters.blinkInterval - intervalSpread,
      maxInterval: parameters.blinkInterval + intervalSpread,
    };
  }, [parameters.blinkInterval]);

  const lookOptions = useMemo<LookOptions | undefined>(() => (
    prefersReducedMotion
      ? {
          eyeDistanceX: LOOK_DEFAULTS.eyeDistanceX * 0.5,
          eyeOutDuration: LOOK_DEFAULTS.eyeOutDuration * 0.7,
          bodyDistanceX: LOOK_DEFAULTS.bodyDistanceX * 0.5,
          bodyRotation: 0,
          bodyFollowDuration: LOOK_DEFAULTS.bodyFollowDuration * 0.7,
          directionalHoldDuration: LOOK_DEFAULTS.directionalHoldDuration * 0.5,
          eyeReturnDuration: LOOK_DEFAULTS.eyeReturnDuration * 0.7,
          bodyReturnDuration: LOOK_DEFAULTS.bodyReturnDuration * 0.7,
        }
      : undefined
  ), [prefersReducedMotion]);

  const getIdleTargets = useCallback((): IdleTargets | null => {
    const refs = nuniRef.current?.getDomRefs();
    if (!refs) return null;

    return {
      characterWrapper: refs.characterWrapperRef,
      shadow: refs.shadowRef,
    };
  }, []);

  const getBlinkTargets = useCallback((): BlinkTargets | null => {
    const refs = nuniRef.current?.getDomRefs();
    if (!refs) return null;

    return {
      eyes: refs.eyesRef,
      leftEye: refs.leftEyeBlinkRef,
      rightEye: refs.rightEyeBlinkRef,
    };
  }, []);

  const getLookTargets = useCallback((): LookTargets | null => {
    const refs = nuniRef.current?.getDomRefs();
    if (!refs) return null;

    return {
      body: refs.bodyRef,
      leftEye: refs.leftEyeRef,
      rightEye: refs.rightEyeRef,
    };
  }, []);

  const getHoverTargets = useCallback((): HoverV2Targets | null => {
    const refs = nuniRef.current?.getDomRefs();
    const hoverArea = hoverAreaRef.current;
    if (!refs || !hoverArea) return null;

    return {
      hoverArea,
      character: refs.characterWrapperRef,
      bodyLook: refs.bodyRef,
      eyeDirection: [refs.leftEyeRef, refs.rightEyeRef],
    };
  }, []);

  const getRandomIdleTargets = useCallback((): RandomIdleTargets | null => {
    const blink = getBlinkTargets();
    const look = getLookTargets();
    if (!blink || !look) return null;

    return { blink, look };
  }, [getBlinkTargets, getLookTargets]);

  useEffect(() => {
    const targets = getRandomIdleTargets();
    if (!targets) return undefined;

    const controller = createRandomIdleController(targets, {
      canRun: () => stateManager.isEnabled()
        && stateManager.getState() === AnimationState.RandomIdle,
      onDebugChange: setRandomIdleSnapshot,
    });
    randomIdleControllerRef.current = controller;
    const unregister = stateManager.register('randomIdle', controller);

    return () => {
      unregister();
      if (randomIdleControllerRef.current === controller) randomIdleControllerRef.current = null;
      controller.destroy();
    };
  }, [getRandomIdleTargets, stateManager]);

  useEffect(() => {
    const controller = randomIdleControllerRef.current;
    if (!controller) return;
    if (randomIdleEnabled && !prefersReducedMotion) controller.enable();
    else controller.disable();

    if (!stateManager.isEnabled()
      || stateManager.getState() === AnimationState.Hover
      || stateManager.getState() === AnimationState.ManualLook) return;

    const randomIdleMayOwn = randomIdleEnabled
      && !autoLook
      && !pointerInsideHover
      && !prefersReducedMotion;
    if (randomIdleMayOwn) stateManager.setState(AnimationState.RandomIdle);
    else if (stateManager.getState() === AnimationState.RandomIdle) {
      stateManager.setState(AnimationState.Idle);
    }
  }, [autoLook, pointerInsideHover, prefersReducedMotion, randomIdleEnabled, stateManager]);

  useEffect(() => {
    const targets = getIdleTargets();
    if (!targets) return undefined;

    const enableIdle = () => {
      if (!idleRequested || !idleLoop || prefersReducedMotion) {
        stopIdle();
        resetIdle(targets);
        return;
      }
      playIdle(targets, idleOptions);
    };
    const resetIdleLayer = () => {
      stopIdle();
      resetIdle(targets);
    };
    const unregister = stateManager.register('idle', {
      enable: enableIdle,
      resume: enableIdle,
      reset: resetIdleLayer,
      destroy: resetIdleLayer,
    });

    return () => {
      unregister();
      resetIdleLayer();
    };
  }, [getIdleTargets, idleLoop, idleOptions, idleRequested, prefersReducedMotion, stateManager]);

  useEffect(() => () => {
    const targets = getBlinkTargets();
    if (targets) resetAutoBlink(targets);
    else stopAutoBlink();
    stopBlink();
  }, [getBlinkTargets]);

  useEffect(() => () => {
    manualLookGenerationRef.current += 1;
    const targets = getLookTargets();
    if (targets) resetAutoLook(targets);
    else stopAutoLook();
    stopLook();
    if (targets) resetLook(targets);
  }, [getLookTargets]);

  useEffect(() => {
    const targets = getHoverTargets();
    if (!targets || !hoverV2Enabled) return undefined;

    const controller = createHoverV2Controller(targets, {
      onEnter: () => {
        stateManager.setState(AnimationState.Hover);
        stopLook();
      },
      onReturnComplete: () => {
        transitionToRestingState();
      },
    });

    hoverControllerRef.current = controller;
    const unregister = stateManager.register('hover', {
      enable: controller.enable,
      disable: controller.disable,
      pause: controller.suspend,
      resume: controller.resume,
      reset: controller.reset,
      destroy: controller.destroy,
    });

    return () => {
      unregister();
      if (hoverControllerRef.current === controller) hoverControllerRef.current = null;
      controller.destroy();
    };
  }, [getHoverTargets, hoverV2Enabled, stateManager, transitionToRestingState]);

  useEffect(() => {
    hoverControllerRef.current?.updateOptions(hoverV2Options);
  }, [hoverV2Options]);

  useEffect(() => {
    const targets = getBlinkTargets();
    if (!targets) return;

    if (!autoBlink) {
      stopAutoBlink();
      return;
    }

    if (prefersReducedMotion) {
      stopAutoBlink();
      resetBlink(targets);
      return;
    }

    startAutoBlink(targets, autoBlinkOptions);
  }, [autoBlink, autoBlinkOptions, getBlinkTargets, prefersReducedMotion]);

  useEffect(() => {
    const targets = getLookTargets();
    if (!targets) return;

    if (!autoLook) {
      stopAutoLook();
      return;
    }

    if (prefersReducedMotion) {
      stopAutoLook();
      resetLook(targets);
      return;
    }

    if (!stateManager.isEnabled()) {
      stopAutoLook();
      resetLook(targets);
      return;
    }

    startAutoLook(targets, autoLookOptions);
    if (managerSnapshot.currentState === AnimationState.Hover
      || managerSnapshot.currentState === AnimationState.ManualLook) {
      suspendAutoLook();
    }
  }, [
    autoLook,
    autoLookOptions,
    getLookTargets,
    managerSnapshot.currentState,
    prefersReducedMotion,
    stateManager,
  ]);

  const handleIdle = useCallback(() => {
    const targets = getIdleTargets();
    if (!targets || prefersReducedMotion) return;

    setIdleRequested(true);
    setIdleLoop(true);
    playIdle(targets, idleOptions);
  }, [getIdleTargets, idleOptions, prefersReducedMotion]);

  const handleBlink = useCallback(() => {
    const targets = getBlinkTargets();
    if (!targets) return;

    const blink = playBlink(targets);
    if (autoBlink && !prefersReducedMotion) rescheduleAutoBlinkAfter(blink);
  }, [autoBlink, getBlinkTargets, prefersReducedMotion]);

  const handleLook = useCallback((direction: LookDirection) => {
    const targets = getLookTargets();
    if (!targets) return;

    const hover = hoverControllerRef.current;
    const generation = ++manualLookGenerationRef.current;
    stateManager.setState(AnimationState.ManualLook);

    const look = playLook(
      targets,
      direction,
      lookOptions,
      { preserveCurrentTransform: Boolean(hover) },
    );
    const unregisterLook = stateManager.register('look', {
      pause: look.reset,
      reset: look.reset,
      destroy: look.reset,
    });

    if (autoLook && !prefersReducedMotion) rescheduleAutoLookAfter(look, direction);

    let settled = false;
    const previousInterrupt = look.timeline.eventCallback('onInterrupt') as (() => void) | null;
    const finishManualLook = () => {
      if (settled) return;
      settled = true;
      look.timeline.eventCallback('onInterrupt', previousInterrupt);
      unregisterLook();
      if (manualLookGenerationRef.current !== generation) return;
      transitionToRestingState();
    };

    look.timeline.eventCallback('onInterrupt', () => {
      previousInterrupt?.();
      finishManualLook();
    });
    void look.timeline.then(finishManualLook);
  }, [
    autoLook,
    getLookTargets,
    lookOptions,
    prefersReducedMotion,
    stateManager,
    transitionToRestingState,
  ]);

  const handleLookLeft = useCallback(() => handleLook('left'), [handleLook]);
  const handleLookRight = useCallback(() => handleLook('right'), [handleLook]);
  const handleHover = useCallback(() => {
    hoverV2EnabledRef.current = true;
    setHoverV2Enabled(true);
  }, []);

  const handleReset = useCallback(() => {
    const idleTargets = getIdleTargets();
    const blinkTargets = getBlinkTargets();
    const lookTargets = getLookTargets();

    setIdleRequested(false);
    setIdleLoop(false);
    setAutoBlink(false);
    setAutoLook(false);
    setRandomIdleEnabled(false);
    setPointerInsideHover(false);
    setHoverV2Enabled(false);
    setHoverV2AreaVisible(false);
    manualLookGenerationRef.current += 1;
    stateManager.disable();
    randomIdleControllerRef.current?.disable();
    randomIdleControllerRef.current?.reset();
    hoverControllerRef.current?.reset();
    stopIdle();
    stopAutoBlink();
    stopAutoLook();
    stopBlink();
    stopLook();
    if (idleTargets) resetIdle(idleTargets);
    if (blinkTargets) resetBlink(blinkTargets);
    if (lookTargets) resetLook(lookTargets);
  }, [getBlinkTargets, getIdleTargets, getLookTargets, stateManager]);

  const handleAutoBlinkChange = useCallback((enabled: boolean) => {
    setAutoBlink(enabled);

    if (!enabled) {
      const targets = getBlinkTargets();
      if (targets) resetAutoBlink(targets);
      else stopAutoBlink();
    }
  }, [getBlinkTargets]);

  const handleAutoLookChange = useCallback((enabled: boolean) => {
    autoLookEnabledRef.current = enabled;
    setAutoLook(enabled);

    if (enabled && stateManager.getState() === AnimationState.RandomIdle) {
      stateManager.setState(AnimationState.Idle);
    }

    if (!enabled) {
      const targets = getLookTargets();
      const sharedTargetsOwned = stateManager.getState() === AnimationState.Hover
        || stateManager.getState() === AnimationState.ManualLook;

      stopAutoLook();
      if (!sharedTargetsOwned && targets) {
        stopLook();
        resetLook(targets);
      }
      transitionToRestingState();
    }
  }, [getLookTargets, stateManager, transitionToRestingState]);

  const handleHoverV2EnabledChange = useCallback((enabled: boolean) => {
    hoverV2EnabledRef.current = enabled;
    setHoverV2Enabled(enabled);

    if (!enabled) {
      hoverControllerRef.current?.disable();
      if (stateManager.getState() === AnimationState.Hover) transitionToRestingState();
    }
  }, [stateManager, transitionToRestingState]);

  const handleRandomIdleEnabledChange = useCallback((enabled: boolean) => {
    randomIdleEnabledRef.current = enabled;
    setRandomIdleEnabled(enabled);
    if (enabled) randomIdleControllerRef.current?.enable();
    else randomIdleControllerRef.current?.disable();
    if (stateManager.isEnabled()
      && stateManager.getState() !== AnimationState.Hover
      && stateManager.getState() !== AnimationState.ManualLook) {
      transitionToRestingState();
    }
  }, [stateManager, transitionToRestingState]);

  const handleHoverAreaPointerEnter = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') return;
    pointerInsideHoverRef.current = true;
    setPointerInsideHover(true);
    if (!stateManager.isEnabled()) return;
    if (stateManager.getState() === AnimationState.ManualLook) return;
    if (hoverV2EnabledRef.current) {
      stopLook();
      stateManager.setState(AnimationState.Hover);
    }
    else if (stateManager.getState() === AnimationState.RandomIdle) {
      stateManager.setState(AnimationState.Idle);
    }
  }, [stateManager]);

  const handleHoverAreaPointerLeave = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') return;
    pointerInsideHoverRef.current = false;
    setPointerInsideHover(false);
    if (stateManager.getState() === AnimationState.ManualLook) return;
    if (!hoverV2EnabledRef.current) transitionToRestingState();
  }, [stateManager, transitionToRestingState]);

  const handleManagerEnabledChange = useCallback((enabled: boolean) => {
    if (enabled) {
      stateManager.enable();
      if (randomIdleEnabledRef.current) randomIdleControllerRef.current?.enable();
      transitionToRestingState();
    } else {
      stateManager.disable();
    }
  }, [stateManager, transitionToRestingState]);

  const handleParameterChange = useCallback((
    parameter: AnimationDebugParameter,
    value: number,
  ) => {
    setParameters((current) => ({ ...current, [parameter]: value }));
  }, []);

  const handleIdleLoopChange = useCallback((enabled: boolean) => {
    setIdleLoop(enabled);
    setIdleRequested(enabled);

    if (!enabled) {
      const targets = getIdleTargets();
      stopIdle();
      if (targets) resetIdle(targets);
    }
  }, [getIdleTargets]);

  return (
    <main className="preview">
      <section className="preview__stage" aria-labelledby="preview-title">
        <div className="preview__copy">
          <p>CHARACTER PREVIEW</p>
          <h1 id="preview-title">Nuni</h1>
          <span>SVG layer composition · responsive</span>
        </div>

        <div className="preview__character">
          <Nuni ref={nuniRef} aria-label="누니 캐릭터 미리보기" />
          <div
            ref={hoverAreaRef}
            className="preview__hover-area"
            aria-hidden="true"
            data-nuni-part="hover-area"
            data-hover-debug={hoverV2AreaVisible ? 'true' : 'false'}
            onPointerEnter={handleHoverAreaPointerEnter}
            onPointerLeave={handleHoverAreaPointerLeave}
          />
        </div>
      </section>

      {import.meta.env.DEV && (
        <AnimationDebugPanel
          parameters={parameters}
          idleLoop={idleLoop}
          autoBlink={autoBlink}
          autoLook={autoLook}
          randomIdleEnabled={randomIdleEnabled}
          randomIdleCurrentBehavior={randomIdleSnapshot.currentBehavior}
          randomIdleNextTriggerTime={randomIdleSnapshot.nextTriggerTime}
          randomIdleLastBehavior={randomIdleSnapshot.lastBehavior}
          managerSnapshot={managerSnapshot}
          hoverV2Enabled={hoverV2Enabled}
          hoverV2AreaVisible={hoverV2AreaVisible}
          onIdle={handleIdle}
          onBlink={handleBlink}
          onLookLeft={handleLookLeft}
          onLookRight={handleLookRight}
          onHover={handleHover}
          onReset={handleReset}
          onParameterChange={handleParameterChange}
          onIdleLoopChange={handleIdleLoopChange}
          onAutoBlinkChange={handleAutoBlinkChange}
          onAutoLookChange={handleAutoLookChange}
          onRandomIdleEnabledChange={handleRandomIdleEnabledChange}
          onManagerEnabledChange={handleManagerEnabledChange}
          onHoverV2EnabledChange={handleHoverV2EnabledChange}
          onHoverV2AreaVisibleChange={setHoverV2AreaVisible}
        />
      )}
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NuniPreview />
  </StrictMode>,
);
