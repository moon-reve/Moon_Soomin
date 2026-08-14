import { useEffect, useRef, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import {
  createHoverV2Controller,
  playIdle,
  resetAutoBlink,
  resetIdle,
  startAutoBlink,
} from '../animations';
import lightPoolSrc from '../assets/guide-selection/light-pool.svg';
import nuniBodySrc from '../assets/guide-selection/nuni-body.svg';
import nuniMaskSrc from '../assets/guide-selection/nuni-mask.svg';
import nuniShadingSrc from '../assets/guide-selection/nuni-shading.svg';
import nuniCheeksSrc from '../assets/guide-selection/nuni-cheeks.svg';
import nuniMouthSrc from '../assets/guide-selection/nuni-mouth.svg';
import nuniEyesSrc from '../assets/guide-selection/nuni-eyes.svg';
import contactShadowSrc from '../assets/guide-selection/contact-shadow.svg';
import { guides } from '../data/guides';
import { useGuide } from '../hooks/useGuide';
import { useReducedMotion } from '../hooks/useReducedMotion';
import styles from './GuideSelectionPage.module.scss';

function SelectionNuni({ guideName }: { guideName: string }) {
  const floatLayerRef = useRef<HTMLDivElement>(null);
  const bodyLookRef = useRef<HTMLDivElement>(null);
  const eyesRef = useRef<HTMLSpanElement>(null);
  const shadowRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const floatLayer = floatLayerRef.current;
    const bodyLook = bodyLookRef.current;
    const eyes = eyesRef.current;
    const shadow = shadowRef.current;
    if (!floatLayer || !bodyLook || !eyes || !shadow) return undefined;

    const idleTargets = { characterWrapper: floatLayer, shadow };
    const blinkTargets = { eyes, leftEye: eyes, rightEye: eyes };

    if (prefersReducedMotion) {
      resetIdle(idleTargets);
      resetAutoBlink(blinkTargets);
      return undefined;
    }

    playIdle(idleTargets);
    startAutoBlink(blinkTargets);
    const getViewportTrackingOptions = () => {
      const characterRect = floatLayer.getBoundingClientRect();

      return {
        reactionRadiusXRatio: Math.max(window.innerWidth / Math.max(characterRect.width, 1), 1),
        reactionRadiusYRatio: Math.max(window.innerHeight / Math.max(characterRect.height, 1), 1),
        distanceMinFactor: 0.4,
        distanceOuterLimit: 1.2,
      };
    };
    const hoverController = createHoverV2Controller(
      {
        hoverArea: document.documentElement,
        character: floatLayer,
        bodyLook,
        eyeDirection: [eyes],
      },
      getViewportTrackingOptions(),
    );
    const updateTrackingArea = () => hoverController.updateOptions(getViewportTrackingOptions());
    hoverController.enable();
    window.addEventListener('resize', updateTrackingArea);

    return () => {
      window.removeEventListener('resize', updateTrackingArea);
      hoverController.destroy();
      resetIdle(idleTargets);
      resetAutoBlink(blinkTargets);
    };
  }, [prefersReducedMotion]);

  return (
    <div className={styles.nuniScene} aria-label={`${guideName} 누니`} role="img">
      <img className={styles.lightPool} src={lightPoolSrc} alt="" draggable="false" />

      <div className={styles.nuniCharacterScale}>
        <span ref={shadowRef} className={styles.contactShadow} aria-hidden="true">
          <img src={contactShadowSrc} alt="" draggable="false" />
        </span>

        <div ref={floatLayerRef} className={styles.floatLayer}>
          <div ref={bodyLookRef} className={styles.bodyLook}>
            <span className={styles.body} aria-hidden="true">
              <img src={nuniBodySrc} alt="" draggable="false" />
            </span>
            <span
              className={styles.shading}
              style={{ '--nuni-mask': `url("${nuniMaskSrc}")` } as CSSProperties}
              aria-hidden="true"
            >
              <img src={nuniShadingSrc} alt="" draggable="false" />
            </span>
            <span className={styles.cheeks} aria-hidden="true">
              <img src={nuniCheeksSrc} alt="" draggable="false" />
            </span>
            <span className={styles.mouth} aria-hidden="true">
              <img src={nuniMouthSrc} alt="" draggable="false" />
            </span>
            <span ref={eyesRef} className={styles.eyes} aria-hidden="true">
              <img src={nuniEyesSrc} alt="" draggable="false" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GuideSelectionPage() {
  const { selectedGuide, selectGuide } = useGuide();
  const selectedGuideData = guides.find(({ id }) => id === selectedGuide) ?? guides[1];

  const selectEntryMode = (mode: 'guided' | 'explore') => {
    window.sessionStorage.setItem('moon-soomin:portfolio-entry-mode', mode);
  };

  return (
    <main className={styles.page} data-guide-theme={selectedGuide}>
      <section className={styles.section} aria-labelledby="guide-selection-title">
        <div className={styles.canvas}>
          <div key={`texture-${selectedGuide}`} className={styles.textureGrid} aria-hidden="true" />

          <div className={styles.intro}>
            <p className={styles.eyebrow}>( CHOOSE YOUR GUIDE )</p>
            <h1 id="guide-selection-title">Before We begin</h1>
          </div>

          <SelectionNuni guideName={selectedGuideData.name} />

          <div key={`copy-${selectedGuide}`} className={styles.guideCopy} aria-live="polite">
            <h2>{selectedGuideData.name}</h2>
            <p>{selectedGuideData.description}</p>
          </div>

          <nav className={styles.rail} aria-label="가이드 선택">
            {guides.map(({ id, label }) => (
              <button
                key={label}
                className={id === selectedGuide ? styles.activeGuide : styles.guideOption}
                data-guide-theme={id}
                type="button"
                aria-pressed={id === selectedGuide}
                onClick={() => selectGuide(id)}
              >
                {label}
              </button>
            ))}
            <Link
              className={styles.beginButton}
              to="/strategist"
              onClick={() => selectEntryMode('guided')}
            >
              <span>Begin</span>
              <span aria-hidden="true">→</span>
            </Link>
          </nav>

          <Link
            className={styles.skipButton}
            to="/strategist"
            onClick={() => selectEntryMode('explore')}
          >
            Skip &amp; Explore on your own →
          </Link>
        </div>
      </section>
    </main>
  );
}
