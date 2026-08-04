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
import textureGridSrc from '../assets/guide-selection/texture-grid.svg';
import { useReducedMotion } from '../hooks/useReducedMotion';
import styles from './GuideSelectionPage.module.scss';

const guideLabels = ['Curator', 'Strategist', 'Builder', 'Explorer'] as const;

function SelectionNuni() {
  const floatLayerRef = useRef<HTMLDivElement>(null);
  const bodyLookRef = useRef<HTMLDivElement>(null);
  const eyesRef = useRef<HTMLSpanElement>(null);
  const shadowRef = useRef<HTMLSpanElement>(null);
  const hoverAreaRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const floatLayer = floatLayerRef.current;
    const bodyLook = bodyLookRef.current;
    const eyes = eyesRef.current;
    const shadow = shadowRef.current;
    const hoverArea = hoverAreaRef.current;
    if (!floatLayer || !bodyLook || !eyes || !shadow || !hoverArea) return undefined;

    const idleTargets = { characterWrapper: floatLayer, shadow };
    const blinkTargets = { eyes, leftEye: eyes, rightEye: eyes };

    if (prefersReducedMotion) {
      resetIdle(idleTargets);
      resetAutoBlink(blinkTargets);
      return undefined;
    }

    playIdle(idleTargets);
    startAutoBlink(blinkTargets);
    const hoverController = createHoverV2Controller({
      hoverArea,
      character: floatLayer,
      bodyLook,
      eyeDirection: [eyes],
    });
    hoverController.enable();

    return () => {
      hoverController.destroy();
      resetIdle(idleTargets);
      resetAutoBlink(blinkTargets);
    };
  }, [prefersReducedMotion]);

  return (
    <div className={styles.nuniScene} aria-label="전략가 누니" role="img">
      <img className={styles.lightPool} src={lightPoolSrc} alt="" draggable="false" />

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

      <div ref={hoverAreaRef} className={styles.nuniHoverArea} aria-hidden="true" />
    </div>
  );
}

export default function GuideSelectionPage() {
  return (
    <main className={styles.page}>
      <section className={styles.section} aria-labelledby="guide-selection-title">
        <div className={styles.canvas}>
          <img className={styles.textureGrid} src={textureGridSrc} alt="" aria-hidden="true" />

          <div className={styles.intro}>
            <p className={styles.eyebrow}>( CHOOSE YOUR GUIDE )</p>
            <h1 id="guide-selection-title">Before We begin</h1>
          </div>

          <SelectionNuni />

          <div className={styles.guideCopy}>
            <h2>전략가</h2>
            <p>무엇부터 할지 순서를 잡아 줍니다.</p>
          </div>

          <nav className={styles.rail} aria-label="가이드 선택">
            {guideLabels.map((label) => (
              <button
                key={label}
                className={label === 'Strategist' ? styles.activeGuide : styles.guideOption}
                type="button"
                aria-pressed={label === 'Strategist'}
                disabled={label !== 'Strategist'}
              >
                {label}
              </button>
            ))}
            <Link className={styles.beginButton} to="/strategist">
              <span>Begin</span>
              <span aria-hidden="true">→</span>
            </Link>
          </nav>

          <Link className={styles.skipButton} to="/strategist">
            Skip &amp; Explore on your own →
          </Link>
        </div>
      </section>
    </main>
  );
}
