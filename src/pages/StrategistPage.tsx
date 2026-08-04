import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { gsap } from 'gsap';
import { playIdle, resetAutoBlink, resetIdle, startAutoBlink } from '../animations';
import aboutGroundSrc from '../assets/strategist-about/ground.svg';
import aboutStarSrc from '../assets/strategist-about/star.svg';
import aboutTextureGridSrc from '../assets/strategist-about/texture-grid.svg';
import aboutUnderlineSrc from '../assets/strategist-about/underline.svg';
import contactTickSrc from '../assets/strategist-contact/contact-tick.svg';
import contactsRuleSrc from '../assets/strategist-contact/contacts-rule.svg';
import contactButtonSrc from '../assets/strategist-contact/cta-button.svg';
import contactEmailUnderlineSrc from '../assets/strategist-contact/email-underline.svg';
import contactGithubUnderlineSrc from '../assets/strategist-contact/github-underline.svg';
import contactGroundSrc from '../assets/strategist-contact/ground.svg';
import contactResumeUnderlineSrc from '../assets/strategist-contact/resume-underline.svg';
import contactStatusDotSrc from '../assets/strategist-contact/status-dot.svg';
import closingGroundSrc from '../assets/strategist-closing/ground.svg';
import closingTextureGridSrc from '../assets/strategist-closing/texture-grid.svg';
import journeyGroundSrc from '../assets/strategist-journey-01/ground.svg';
import journeyPhotoSrc from '../assets/strategist-journey-01/photo.png';
import journeyTextureGridSrc from '../assets/strategist-journey-01/texture-grid.svg';
import discoveryCropMarksSrc from '../assets/strategist-journey-02/crop-marks.svg';
import discoveryGroundSrc from '../assets/strategist-journey-02/ground.svg';
import discoveryPhotoSrc from '../assets/strategist-journey-02/photo.png';
import discoveryPhotoBorderSrc from '../assets/strategist-journey-02/photo-border.svg';
import discoveryRulersSrc from '../assets/strategist-journey-02/rulers.svg';
import discoveryTextureGridSrc from '../assets/strategist-journey-02/texture-grid.svg';
import observationCropMarksSrc from '../assets/strategist-journey-03/crop-marks.svg';
import observationGroundSrc from '../assets/strategist-journey-03/ground.svg';
import observationPhotoSrc from '../assets/strategist-journey-03/photo.png';
import observationPhotoBorderSrc from '../assets/strategist-journey-03/photo-border.svg';
import observationRulersSrc from '../assets/strategist-journey-03/rulers.svg';
import observationTextureGridSrc from '../assets/strategist-journey-03/texture-grid.svg';
import movementGroundSrc from '../assets/strategist-journey-04/ground.svg';
import movementPhotoSrc from '../assets/strategist-journey-04/photo.png';
import movementTextureGridSrc from '../assets/strategist-journey-04/texture-grid.svg';
import expansionCropMarksSrc from '../assets/strategist-journey-05/crop-marks.svg';
import expansionGroundSrc from '../assets/strategist-journey-05/ground.svg';
import expansionPhotoSrc from '../assets/strategist-journey-05/photo.png';
import expansionPhotoBorderSrc from '../assets/strategist-journey-05/photo-border.svg';
import expansionRulersSrc from '../assets/strategist-journey-05/rulers.svg';
import expansionTextureGridSrc from '../assets/strategist-journey-05/texture-grid.svg';
import journeyWhiteCropMarksSrc from '../assets/strategist-journey-common/crop-marks-white.svg';
import journeyWhitePhotoBorderSrc from '../assets/strategist-journey-common/photo-border-white.svg';
import journeyWhiteRulersSrc from '../assets/strategist-journey-common/rulers-white.svg';
import realityCropMarksSrc from '../assets/strategist-journey-06/crop-marks.svg';
import realityGroundSrc from '../assets/strategist-journey-06/ground.svg';
import realityPhotoSrc from '../assets/strategist-journey-06/photo.png';
import realityPhotoBorderSrc from '../assets/strategist-journey-06/photo-border.svg';
import realityRulersSrc from '../assets/strategist-journey-06/rulers.svg';
import realityTextureGridSrc from '../assets/strategist-journey-06/texture-grid.svg';
import cardFrontShadowSrc from '../assets/strategist-project-cards/front-shadow.svg';
import cardFrontShellSrc from '../assets/strategist-project-cards/front-shell.svg';
import marshallCoverSrc from '../assets/strategist-project-cards/marshall-cover.png';
import marshallCoverBorderSrc from '../assets/strategist-project-cards/marshall-cover-border.svg';
import marshallRuleSrc from '../assets/strategist-project-cards/marshall-rule.svg';
import routeBackLogoSrc from '../assets/strategist-project-cards/route-back-logo.svg';
import routeCoverSrc from '../assets/strategist-project-cards/route-cover.svg';
import routeCoverBorderSrc from '../assets/strategist-project-cards/route-cover-border.svg';
import routeLogoSrc from '../assets/strategist-project-cards/route-logo.svg';
import vinerBackLogoSrc from '../assets/strategist-project-cards/viner-back-logo.svg';
import vinerCoverSrc from '../assets/strategist-project-cards/viner-cover.png';
import vinerCoverBorderSrc from '../assets/strategist-project-cards/viner-cover-border.svg';
import projectsGroundSrc from '../assets/strategist-projects-intro/ground.svg';
import projectsTextureGridSrc from '../assets/strategist-projects-intro/texture-grid.svg';
import skillsChip01Src from '../assets/strategist-skills/chip-01.svg';
import skillsChip02Src from '../assets/strategist-skills/chip-02.svg';
import skillsChip03Src from '../assets/strategist-skills/chip-03.svg';
import skillsChip04Src from '../assets/strategist-skills/chip-04.svg';
import skillsChip05Src from '../assets/strategist-skills/chip-05.svg';
import skillsChip06Src from '../assets/strategist-skills/chip-06.svg';
import skillsChip07Src from '../assets/strategist-skills/chip-07.svg';
import skillsChip08Src from '../assets/strategist-skills/chip-08.svg';
import skillsChip09Src from '../assets/strategist-skills/chip-09.svg';
import skillsChip10Src from '../assets/strategist-skills/chip-10.svg';
import skillsChip11Src from '../assets/strategist-skills/chip-11.svg';
import skillsChip12Src from '../assets/strategist-skills/chip-12.svg';
import skillsChip13Src from '../assets/strategist-skills/chip-13.svg';
import skillsChip14Src from '../assets/strategist-skills/chip-14.svg';
import skillsChip15Src from '../assets/strategist-skills/chip-15.svg';
import skillsChip16Src from '../assets/strategist-skills/chip-16.svg';
import skillsChip17Src from '../assets/strategist-skills/chip-17.svg';
import skillsGroundSrc from '../assets/strategist-skills/ground.svg';
import skillsInstructionDotSrc from '../assets/strategist-skills/instruction-dot.svg';
import skillsPlayBoxGridSrc from '../assets/strategist-skills/play-box-grid.svg';
import skillsPlayBoxSrc from '../assets/strategist-skills/play-box.svg';
import circleAnnotationSrc from '../assets/strategist-hero/circle-annotation.svg';
import copyAccentSrc from '../assets/strategist-hero/copy-accent.svg';
import dotFieldSrc from '../assets/strategist-hero/dot-field.svg';
import dotLinksSrc from '../assets/strategist-hero/dot-links.svg';
import groundSrc from '../assets/strategist-hero/ground.svg';
import heroKickerDotSrc from '../assets/strategist-hero/hero-kicker-dot.svg';
import nuniBodySrc from '../assets/strategist-hero/nuni-body.svg';
import nuniCheeksSrc from '../assets/strategist-hero/nuni-cheeks.svg';
import nuniEyesSrc from '../assets/strategist-hero/nuni-eyes.svg';
import nuniMaskSrc from '../assets/strategist-hero/nuni-mask.svg';
import nuniMouthSrc from '../assets/strategist-hero/nuni-mouth.svg';
import nuniShadingSrc from '../assets/strategist-hero/nuni-shading.svg';
import nuniShadowSrc from '../assets/strategist-hero/nuni-shadow.svg';
import sectionDotActiveSrc from '../assets/strategist-hero/section-dot-active.svg';
import sectionDotSrc from '../assets/strategist-hero/section-dot.svg';
import textureGridSrc from '../assets/strategist-hero/texture-grid.svg';
import { useReducedMotion } from '../hooks/useReducedMotion';
import styles from './StrategistPage.module.scss';

const sectionLabels = ['Hero', 'About', 'Journey', 'Projects', 'Skills', 'Contact'] as const;
const tickerLabels = [
  'Figma',
  'Photoshop',
  'Illustrator',
  'Premiere Pro',
  'After Effects',
  'Lightroom',
  'HTML',
  'CSS',
  'Javascript',
  'React',
  'Typescript',
  'Styled-components',
  'Tailwind CSS',
  'GSAP',
  'Github',
  'Vercel',
  'ChatGPT',
  'Claude',
  'Gemini',
  'Stitch',
  'Midjourney',
] as const;

const skillChips = [
  { label: 'Javascript', asset: skillsChip01Src, x: 19.97, y: 64.01, width: 121.5, rotation: -25.6, inverse: true },
  { label: 'CSS', asset: skillsChip02Src, x: 53.78, y: 65.58, width: 93, rotation: -19.3 },
  { label: 'Premiere Pro', asset: skillsChip03Src, x: 74.075, y: 66.15, width: 136.2, rotation: -22.7, inverse: true },
  { label: 'Figma', asset: skillsChip02Src, x: 80.135, y: 67.805, width: 93, rotation: 7.4 },
  { label: 'Illustrator', asset: skillsChip04Src, x: 26.13, y: 68.24, width: 117.6, rotation: -24 },
  { label: 'Vercel', asset: skillsChip02Src, x: 42.285, y: 68.97, width: 93, rotation: 14.2 },
  { label: 'Lightroom', asset: skillsChip05Src, x: 67.01, y: 69.115, width: 115.7, rotation: -13.8, inverse: true },
  { label: 'Github', asset: skillsChip06Src, x: 47.05, y: 69.285, width: 93, rotation: 15.9 },
  { label: 'Gemini', asset: skillsChip07Src, x: 61.185, y: 69.35, width: 94, rotation: 1.1, inverse: true },
  { label: 'Styled-components', asset: skillsChip08Src, x: 35.18, y: 69.91, width: 179.9, rotation: -14.1 },
  { label: 'Stitch', asset: skillsChip06Src, x: 20.15, y: 70.005, width: 93, rotation: -8.7 },
  { label: 'Midjourney', asset: skillsChip09Src, x: 52.965, y: 70.78, width: 121.5, rotation: -8.4 },
  { label: 'Tailwind CSS', asset: skillsChip10Src, x: 77.58, y: 73.34, width: 144, rotation: 17.9 },
  { label: 'ChatGPT', asset: skillsChip11Src, x: 61.175, y: 73.98, width: 110.3, rotation: 14.8 },
  { label: 'HTML', asset: skillsChip06Src, x: 42.24, y: 74.115, width: 93, rotation: 15.6 },
  { label: 'Typescript', asset: skillsChip12Src, x: 27.765, y: 74.185, width: 120.2, rotation: -10.8 },
  { label: 'GSAP', asset: skillsChip13Src, x: 47.11, y: 74.3, width: 93, rotation: 12.5, inverse: true },
  { label: 'Claude', asset: skillsChip14Src, x: 66.625, y: 74.34, width: 94.9, rotation: 11.5 },
  { label: 'Photoshop', asset: skillsChip15Src, x: 20.695, y: 74.485, width: 120.4, rotation: 7.1 },
  { label: 'React', asset: skillsChip16Src, x: 54.25, y: 74.89, width: 93, rotation: -2.9 },
  { label: 'After Effects', asset: skillsChip17Src, x: 35.065, y: 75.065, width: 134.6, rotation: 0.1 },
] as const;

const skillChipScale = 1332 / 1478;

const nuniSectionWaypoints = [
  { id: 'hero', x: 73.0208, y: 10.7813, scale: 1 },
  { id: 'about', x: 79.5, y: 13.5, scale: 1.12 },
  { id: 'journey', x: 81, y: 7.5, scale: 1.08 },
  { id: 'journey-discovery', x: 75.5, y: 8.5, scale: 1.08 },
  { id: 'journey-observation', x: 82, y: 8, scale: 1.08 },
  { id: 'journey-movement', x: 75, y: 8.7, scale: 1.08 },
  { id: 'journey-expansion', x: 82, y: 8, scale: 1.08 },
  { id: 'journey-reality', x: 75.5, y: 8.5, scale: 1.08 },
  { id: 'projects', x: 81, y: 34.5, scale: 1.25 },
  { id: 'skills', x: 59.43, y: 24.79, scale: 1.42 },
  { id: 'contact', x: 71.63, y: 29.58, scale: 1.42 },
  { id: 'closing', x: 84, y: 5.5, scale: 0.9 },
] as const;

type SectionLabel = (typeof sectionLabels)[number];

const navigationSectionGroups: ReadonlyArray<{ label: SectionLabel; ids: readonly string[] }> = [
  { label: 'Hero', ids: ['hero'] },
  { label: 'About', ids: ['about'] },
  {
    label: 'Journey',
    ids: [
      'journey',
      'journey-discovery',
      'journey-observation',
      'journey-movement',
      'journey-expansion',
      'journey-reality',
    ],
  },
  { label: 'Projects', ids: ['projects'] },
  { label: 'Skills', ids: ['skills'] },
  { label: 'Contact', ids: ['contact', 'closing'] },
];

const darkNavigationSectionIds = ['journey', 'journey-movement', 'closing'] as const;

function ScrollNuni() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);
  const eyesRef = useRef<HTMLSpanElement>(null);
  const shadowRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const character = characterRef.current;
    const eyes = eyesRef.current;
    const shadow = shadowRef.current;
    if (!character || !eyes || !shadow) return undefined;

    const idleTargets = { characterWrapper: character, shadow };
    const blinkTargets = { eyes, leftEye: eyes, rightEye: eyes };

    if (prefersReducedMotion) {
      resetIdle(idleTargets);
      resetAutoBlink(blinkTargets);
      return undefined;
    }

    playIdle(idleTargets);
    startAutoBlink(blinkTargets);

    return () => {
      resetIdle(idleTargets);
      resetAutoBlink(blinkTargets);
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return undefined;

    const sections = nuniSectionWaypoints
      .map((waypoint) => ({ waypoint, element: document.getElementById(waypoint.id) }))
      .filter((entry): entry is { waypoint: (typeof nuniSectionWaypoints)[number]; element: HTMLElement } => Boolean(entry.element));

    let activeId = '';
    let frame = 0;

    const moveToActiveSection = (immediate = false) => {
      frame = 0;
      const viewportAnchor = window.innerHeight * 0.5;
      let closest = sections[0];
      let closestDistance = Number.POSITIVE_INFINITY;

      sections.forEach((entry) => {
        const rect = entry.element.getBoundingClientRect();
        const sectionAnchor = rect.top + (rect.height * 0.5);
        const distance = Math.abs(sectionAnchor - viewportAnchor);
        if (distance < closestDistance) {
          closest = entry;
          closestDistance = distance;
        }
      });

      if (!closest || (!immediate && closest.waypoint.id === activeId)) return;
      activeId = closest.waypoint.id;
      const { x, y, scale } = closest.waypoint;

      if (immediate || prefersReducedMotion) {
        gsap.set(scene, { x: `${x}vw`, y: `${y}vw`, scale });
        return;
      }

      gsap.to(scene, {
        x: `${x}vw`,
        y: `${y}vw`,
        scale,
        duration: 1.15,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => moveToActiveSection());
    };

    moveToActiveSection(true);
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
      gsap.killTweensOf(scene);
    };
  }, [prefersReducedMotion]);

  return (
    <div ref={sceneRef} className={styles.heroNuni} aria-label="전략가 누니" role="img">
      <span ref={shadowRef} className={styles.heroNuniShadow} aria-hidden="true">
        <img src={nuniShadowSrc} alt="" draggable="false" />
      </span>
      <div ref={characterRef} className={styles.heroNuniCharacter}>
        <span className={styles.heroNuniBody} aria-hidden="true">
          <img src={nuniBodySrc} alt="" draggable="false" />
        </span>
        <span
          className={styles.heroNuniShading}
          style={{ '--hero-nuni-mask': `url("${nuniMaskSrc}")` } as CSSProperties}
          aria-hidden="true"
        >
          <img src={nuniShadingSrc} alt="" draggable="false" />
        </span>
        <span className={styles.heroNuniCheeks} aria-hidden="true">
          <img src={nuniCheeksSrc} alt="" draggable="false" />
        </span>
        <span className={styles.heroNuniMouth} aria-hidden="true">
          <img src={nuniMouthSrc} alt="" draggable="false" />
        </span>
        <span ref={eyesRef} className={styles.heroNuniEyes} aria-hidden="true">
          <img src={nuniEyesSrc} alt="" draggable="false" />
        </span>
      </div>
    </div>
  );
}

function NavigationLinks({ active, decorative = false }: { active: SectionLabel; decorative?: boolean }) {
  return (
    <>
      {sectionLabels.map((label) => {
        const isActive = label === active;

        return (
          <a
            key={label}
            className={isActive ? styles.activeSection : undefined}
            href={`#${label.toLowerCase()}`}
            tabIndex={decorative ? -1 : undefined}
          >
            <span>{label}</span>
            <span className={styles.sectionDot} aria-hidden="true">
              <img src={isActive ? sectionDotActiveSrc : sectionDotSrc} alt="" />
            </span>
          </a>
        );
      })}
    </>
  );
}

function SectionNavigation() {
  const navigationRef = useRef<HTMLElement>(null);
  const inverseLayerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<SectionLabel>('Hero');

  useEffect(() => {
    const navigation = navigationRef.current;
    const inverseLayer = inverseLayerRef.current;
    if (!navigation || !inverseLayer) return undefined;

    const groupedSections = navigationSectionGroups.flatMap(({ label, ids }) =>
      ids.flatMap((id) => {
        const element = document.getElementById(id);
        return element ? [{ label, element }] : [];
      }),
    );
    const darkSections = darkNavigationSectionIds.flatMap((id) => {
      const element = document.getElementById(id);
      return element ? [element] : [];
    });
    let frame = 0;

    const updateNavigation = () => {
      frame = 0;
      const viewportAnchor = window.innerHeight * 0.5;
      let closest = groupedSections[0];
      let closestDistance = Number.POSITIVE_INFINITY;

      groupedSections.forEach((entry) => {
        const rect = entry.element.getBoundingClientRect();
        const distance = Math.abs(rect.top + (rect.height * 0.5) - viewportAnchor);
        if (distance < closestDistance) {
          closest = entry;
          closestDistance = distance;
        }
      });

      if (closest) setActive((current) => (current === closest.label ? current : closest.label));

      const navigationRect = navigation.getBoundingClientRect();
      const intersection = darkSections
        .map((section) => section.getBoundingClientRect())
        .map((rect) => ({
          top: Math.max(rect.top, navigationRect.top),
          bottom: Math.min(rect.bottom, navigationRect.bottom),
        }))
        .find(({ top, bottom }) => bottom > top);

      if (!intersection) {
        inverseLayer.style.clipPath = 'inset(100% 0 0 0)';
        return;
      }

      const topInset = Math.max(0, intersection.top - navigationRect.top);
      const bottomInset = Math.max(0, navigationRect.bottom - intersection.bottom);
      inverseLayer.style.clipPath = `inset(${topInset}px 0 ${bottomInset}px 0)`;
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateNavigation);
    };

    updateNavigation();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <nav ref={navigationRef} className={styles.sectionNavigation} aria-label="페이지 섹션">
      <div className={styles.sectionNavigationLayer}>
        <NavigationLinks active={active} />
      </div>
      <div
        ref={inverseLayerRef}
        className={`${styles.sectionNavigationLayer} ${styles.sectionNavigationInverse}`}
        aria-hidden="true"
      >
        <NavigationLinks active={active} decorative />
      </div>
    </nav>
  );
}

function TickerSequence({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className={styles.tickerSequence} aria-hidden={hidden || undefined}>
      {tickerLabels.map((label) => (
        <div className={styles.tickerItem} key={label}>
          <span>{label}</span>
          <img src={aboutStarSrc} alt="" aria-hidden="true" draggable="false" />
        </div>
      ))}
    </div>
  );
}

function AboutSection() {
  return (
    <section id="about" className={styles.aboutSection} aria-labelledby="about-title">
      <div className={styles.aboutCanvas}>
        <img className={styles.aboutGround} src={aboutGroundSrc} alt="" aria-hidden="true" />
        <img className={styles.aboutGrid} src={aboutTextureGridSrc} alt="" aria-hidden="true" />

        <div className={styles.skillsTicker} aria-label={`사용 도구: ${tickerLabels.join(', ')}`}>
          <div className={styles.tickerTrack}>
            <TickerSequence />
            <TickerSequence hidden />
          </div>
        </div>

        <div className={styles.aboutLabel}>
          <span aria-hidden="true" />
          <p>ABOUT</p>
        </div>

        <div className={styles.aboutTitle} id="about-title">
          <p>I don’t just</p>
          <div>
            <p>design.</p>
            <p>prototype.</p>
            <p>build.</p>
          </div>
        </div>
        <img className={styles.aboutUnderline} src={aboutUnderlineSrc} alt="" aria-hidden="true" />

        <div className={styles.aboutBiography}>
          <p className={styles.aboutCopy}>
            커피를 배우기 위해 일본으로 떠났고,
            <br />
            사진과 영상을 통해 사람과 이야기를 기록했습니다.
            <br />
            다양한 경험은 결국 사용자를 이해하는 방법으로 이어졌고,
            <br />
            지금은 기획부터 구현까지 연결하는 UI/UX 디자이너를 목표로 하고 있습니다.
          </p>

          <ul className={styles.aboutTags} aria-label="경험 키워드">
            {['커피', '일본', '사진', '영상', '인도네시아'].map((tag) => (
              <li key={tag}>
                <span aria-hidden="true" />
                <p>{tag}</p>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
}

function JourneySection() {
  return (
    <section id="journey" className={styles.journeySection} aria-labelledby="journey-title">
      <div className={styles.journeyCanvas}>
        <img className={styles.journeyGround} src={journeyGroundSrc} alt="" aria-hidden="true" />
        <img className={styles.journeyGrid} src={journeyTextureGridSrc} alt="" aria-hidden="true" />

        <p
          className={`${styles.journeyGhostNumber} ${styles.journeyGhostNumberWhite}`}
          aria-hidden="true"
        >
          01
        </p>

        <div className={styles.journeyChapter}>
          <p className={styles.journeyEyebrow}>01 BEGINNING</p>
          <p className={styles.journeyCategory}>( COFFEE )</p>

          <h2 className={styles.journeyHeadline} id="journey-title">
            The first
            <br />
            step.
          </h2>

          <p className={styles.journeyBody}>
            커피를 배우고 싶다는 마음 하나로
            <br />
            처음 해외를 선택했습니다.
            <br />
            이 작은 호기심이 모든 시작이 되었습니다.
          </p>

          <ul className={styles.journeyBeats}>
            <li>→ Barista studies</li>
            <li>→ Brewing &amp; sensory training</li>
            <li>→ Customer experience</li>
            <li>→ My first serious passion</li>
          </ul>

          <p className={styles.journeyDuration}>Studied coffee for 2 years</p>
        </div>

        <figure className={styles.journeyPhotoFrame}>
          <img className={styles.journeyPhoto} src={journeyPhotoSrc} alt="드립 커피 추출 장면" />
          <img
            className={styles.journeyPhotoBorder}
            src={journeyWhitePhotoBorderSrc}
            alt=""
            aria-hidden="true"
          />
          <img
            className={styles.journeyCropMarks}
            src={journeyWhiteCropMarksSrc}
            alt=""
            aria-hidden="true"
          />
          <img
            className={styles.journeyRulers}
            src={journeyWhiteRulersSrc}
            alt=""
            aria-hidden="true"
          />
          <figcaption className={styles.journeyCaptionInverse}>Hand drip</figcaption>
        </figure>
      </div>
    </section>
  );
}

function JourneyDiscoverySection() {
  return (
    <section
      id="journey-discovery"
      className={styles.journeySection}
      aria-labelledby="journey-discovery-title"
    >
      <div className={`${styles.journeyCanvas} ${styles.journeyCanvasLight}`}>
        <img className={styles.journeyGround} src={discoveryGroundSrc} alt="" aria-hidden="true" />
        <img className={styles.journeyGrid} src={discoveryTextureGridSrc} alt="" aria-hidden="true" />

        <p className={styles.journeyGhostNumber} aria-hidden="true">02</p>

        <div className={`${styles.journeyChapter} ${styles.journeyChapterLight}`}>
          <p className={styles.journeyEyebrow}>02 DISCOVERY</p>
          <p className={styles.journeyCategory}>( JAPAN )</p>

          <h2 className={styles.journeyHeadline} id="journey-discovery-title">
            Beyond
            <br />
            borders.
          </h2>

          <p className={styles.journeyBody}>
            일본에서 생활하며 다양한 사람을 만났습니다.
            <br />
            화장품 판매와 온라인 MD를 경험하며
            <br />
            사람을 이해하는 시야를 넓혔습니다.
          </p>

          <ul className={styles.journeyBeats}>
            <li>→ Studied abroad</li>
            <li>→ Beauty retail</li>
            <li>→ E-commerce MD</li>
            <li>→ Cross-cultural experience</li>
          </ul>

          <p className={styles.journeyDuration}>Lived in Japan for 6 years</p>
        </div>

        <figure className={styles.journeyPhotoFrame}>
          <img
            className={styles.journeyPhoto}
            src={discoveryPhotoSrc}
            alt="일본의 벚꽃이 핀 강변 야경"
          />
          <img
            className={styles.journeyPhotoBorder}
            src={discoveryPhotoBorderSrc}
            alt=""
            aria-hidden="true"
          />
          <img
            className={styles.journeyCropMarks}
            src={discoveryCropMarksSrc}
            alt=""
            aria-hidden="true"
          />
          <img
            className={styles.journeyRulers}
            src={discoveryRulersSrc}
            alt=""
            aria-hidden="true"
          />
          <figcaption>Yozakura</figcaption>
        </figure>
      </div>
    </section>
  );
}

function JourneyObservationSection() {
  return (
    <section
      id="journey-observation"
      className={styles.journeySection}
      aria-labelledby="journey-observation-title"
    >
      <div className={`${styles.journeyCanvas} ${styles.journeyCanvasWhite}`}>
        <img className={styles.journeyGround} src={observationGroundSrc} alt="" aria-hidden="true" />
        <img className={styles.journeyGrid} src={observationTextureGridSrc} alt="" aria-hidden="true" />

        <p className={styles.journeyGhostNumber} aria-hidden="true">03</p>

        <div className={`${styles.journeyChapter} ${styles.journeyChapterLight}`}>
          <p className={styles.journeyEyebrow}>03 OBSERVATION</p>
          <p className={styles.journeyCategory}>( Photography )</p>

          <h2 className={styles.journeyHeadline} id="journey-observation-title">
            Every moment
            <br />
            matters.
          </h2>

          <p className={styles.journeyBody}>
            순간을 기록하는 것에서 시작해
            <br />
            사람과 공간을 바라보는 시선을 배웠습니다.
            <br />
            관찰은 저의 가장 큰 습관이 되었습니다.
          </p>

          <ul className={styles.journeyBeats}>
            <li>→ Visual storytelling</li>
            <li>→ Composition &amp; lighting</li>
            <li>→ Human observation</li>
            <li>→ Capturing moments</li>
          </ul>

          <p className={`${styles.journeyDuration} ${styles.journeyDurationCompact}`}>
            Photography since 2018
          </p>
        </div>

        <figure className={styles.journeyPhotoFrame}>
          <img
            className={styles.journeyPhoto}
            src={observationPhotoSrc}
            alt="카메라로 촬영 중인 모습"
          />
          <img
            className={styles.journeyPhotoBorder}
            src={observationPhotoBorderSrc}
            alt=""
            aria-hidden="true"
          />
          <img
            className={styles.journeyCropMarks}
            src={observationCropMarksSrc}
            alt=""
            aria-hidden="true"
          />
          <img
            className={styles.journeyRulers}
            src={observationRulersSrc}
            alt=""
            aria-hidden="true"
          />
          <figcaption>Portrait</figcaption>
        </figure>
      </div>
    </section>
  );
}

function JourneyMovementSection() {
  return (
    <section
      id="journey-movement"
      className={styles.journeySection}
      aria-labelledby="journey-movement-title"
    >
      <div className={styles.journeyCanvas}>
        <img className={styles.journeyGround} src={movementGroundSrc} alt="" aria-hidden="true" />
        <img className={styles.journeyGrid} src={movementTextureGridSrc} alt="" aria-hidden="true" />

        <p
          className={`${styles.journeyGhostNumber} ${styles.journeyGhostNumberWhite}`}
          aria-hidden="true"
        >
          04
        </p>

        <div className={styles.journeyChapter}>
          <p className={styles.journeyEyebrow}>04 MOVEMENT</p>
          <p className={styles.journeyCategory}>( MOTION )</p>

          <h2 className={styles.journeyHeadline} id="journey-movement-title">
            Stories
            <br />
            in motion.
          </h2>

          <p className={styles.journeyBody}>
            정적인 장면을 넘어
            <br />
            시간과 흐름을 담기 시작했습니다.
            <br />
            움직임은 경험을 전달하는 또 다른 언어였습니다.
          </p>

          <ul className={styles.journeyBeats}>
            <li>→ Motion graphics</li>
            <li>→ Video editing</li>
            <li>→ Storytelling</li>
            <li>→ Visual rhythm</li>
          </ul>

          <p
            className={`${styles.journeyDuration} ${styles.journeyDurationCompact} ${styles.journeyDurationInverse}`}
          >
            Worked with motion &amp; video
          </p>
        </div>

        <figure className={styles.journeyPhotoFrame}>
          <img
            className={styles.journeyPhoto}
            src={movementPhotoSrc}
            alt="인터뷰 영상 촬영 현장"
          />
          <img
            className={styles.journeyPhotoBorder}
            src={journeyWhitePhotoBorderSrc}
            alt=""
            aria-hidden="true"
          />
          <img
            className={styles.journeyCropMarks}
            src={journeyWhiteCropMarksSrc}
            alt=""
            aria-hidden="true"
          />
          <img
            className={styles.journeyRulers}
            src={journeyWhiteRulersSrc}
            alt=""
            aria-hidden="true"
          />
          <figcaption className={styles.journeyCaptionInverse}>Interview Video</figcaption>
        </figure>
      </div>
    </section>
  );
}

function JourneyExpansionSection() {
  return (
    <section
      id="journey-expansion"
      className={styles.journeySection}
      aria-labelledby="journey-expansion-title"
    >
      <div className={`${styles.journeyCanvas} ${styles.journeyCanvasWhite}`}>
        <img className={styles.journeyGround} src={expansionGroundSrc} alt="" aria-hidden="true" />
        <img className={styles.journeyGrid} src={expansionTextureGridSrc} alt="" aria-hidden="true" />

        <p className={styles.journeyGhostNumber} aria-hidden="true">05</p>

        <div className={`${styles.journeyChapter} ${styles.journeyChapterLight}`}>
          <p className={styles.journeyEyebrow}>05 EXPANSION</p>
          <p className={styles.journeyCategory}>( INDONESIA )</p>

          <h2 className={styles.journeyHeadline} id="journey-expansion-title">
            Changed
            <br />
            by the world.
          </h2>

          <p className={styles.journeyBody}>
            새로운 환경은 익숙했던 시선을 바꿔주었습니다.
            <br />
            다양한 문화와 사람을 경험하며
            <br />
            더 넓은 관점을 갖게 되었습니다.
          </p>

          <ul className={styles.journeyBeats}>
            <li>→ Living abroad</li>
            <li>→ Cultural diversity</li>
            <li>→ Adaptability</li>
            <li>→ New perspectives</li>
          </ul>

          <p className={`${styles.journeyDuration} ${styles.journeyDurationCompact}`}>
            Lived in Indonesia for 1 Year
          </p>
        </div>

        <figure className={styles.journeyPhotoFrame}>
          <img
            className={styles.journeyPhoto}
            src={expansionPhotoSrc}
            alt="인도네시아 바다 위로 지는 석양"
          />
          <img
            className={styles.journeyPhotoBorder}
            src={expansionPhotoBorderSrc}
            alt=""
            aria-hidden="true"
          />
          <img
            className={styles.journeyCropMarks}
            src={expansionCropMarksSrc}
            alt=""
            aria-hidden="true"
          />
          <img
            className={styles.journeyRulers}
            src={expansionRulersSrc}
            alt=""
            aria-hidden="true"
          />
          <figcaption>Pulau Macan</figcaption>
        </figure>
      </div>
    </section>
  );
}

function JourneyRealitySection() {
  return (
    <section
      id="journey-reality"
      className={styles.journeySection}
      aria-labelledby="journey-reality-title"
    >
      <div className={`${styles.journeyCanvas} ${styles.journeyCanvasLight}`}>
        <img className={styles.journeyGround} src={realityGroundSrc} alt="" aria-hidden="true" />
        <img className={styles.journeyGrid} src={realityTextureGridSrc} alt="" aria-hidden="true" />

        <p className={styles.journeyGhostNumber} aria-hidden="true">06</p>

        <div className={`${styles.journeyChapter} ${styles.journeyChapterLight}`}>
          <p className={styles.journeyEyebrow}>06 CONNECTION</p>
          <p className={styles.journeyCategory}>( UI/UX )</p>

          <h2 className={styles.journeyHeadline} id="journey-reality-title">
            Ideas
            <br />
            into reality.
          </h2>

          <p className={styles.journeyBody}>
            커피에서 시작된 호기심은 사진과 영상,
            <br />
            그리고 다양한 경험으로 이어졌습니다.
            <br />
            이제 저는 사용자의 경험을 설계하는 디자이너입니다.
          </p>

          <ul className={styles.journeyBeats}>
            <li>→ UX Strategy</li>
            <li>→ UI Design</li>
            <li>→ Front-end Development</li>
            <li>→ AI Workflow</li>
          </ul>

          <p className={`${styles.journeyDuration} ${styles.journeyDurationCompact}`}>
            Building better experiences
          </p>
        </div>

        <figure className={styles.journeyPhotoFrame}>
          <img
            className={styles.journeyPhoto}
            src={realityPhotoSrc}
            alt="팀원들과 화면을 보며 디자인을 논의하는 모습"
          />
          <img
            className={styles.journeyPhotoBorder}
            src={realityPhotoBorderSrc}
            alt=""
            aria-hidden="true"
          />
          <img
            className={styles.journeyCropMarks}
            src={realityCropMarksSrc}
            alt=""
            aria-hidden="true"
          />
          <img
            className={styles.journeyRulers}
            src={realityRulersSrc}
            alt=""
            aria-hidden="true"
          />
          <figcaption>Team Palette</figcaption>
        </figure>
      </div>
    </section>
  );
}

type ProjectCardName = 'route' | 'marshall' | 'viner';

const projectCardLabels: Record<ProjectCardName, string> = {
  route: 'ROUTE',
  marshall: 'Marshall',
  viner: 'Viner',
};

function ProjectCardCover({ project }: { project: ProjectCardName }) {
  if (project === 'route') {
    return (
      <div className={`${styles.projectCardCover} ${styles.routeCardCover}`}>
        <img className={styles.routeCoverArtwork} src={routeCoverSrc} alt="" aria-hidden="true" />
        <img className={styles.projectCoverBorder} src={routeCoverBorderSrc} alt="" aria-hidden="true" />
        <div className={styles.routeCoverBrand} aria-hidden="true">
          <img src={routeLogoSrc} alt="" />
          <span>Route</span>
        </div>
      </div>
    );
  }

  if (project === 'marshall') {
    return (
      <div className={`${styles.projectCardCover} ${styles.marshallCardCover}`}>
        <img className={styles.marshallCoverPhoto} src={marshallCoverSrc} alt="" aria-hidden="true" />
        {[25.1, 49.8, 74.49].map((position) => (
          <img
            key={position}
            className={styles.marshallCoverRule}
            style={{ insetInlineStart: `${position}%` }}
            src={marshallRuleSrc}
            alt=""
            aria-hidden="true"
          />
        ))}
        <img className={styles.projectCoverBorder} src={marshallCoverBorderSrc} alt="" aria-hidden="true" />
        <span className={styles.marshallCoverTitle} aria-hidden="true">Marshall</span>
      </div>
    );
  }

  return (
    <div className={`${styles.projectCardCover} ${styles.vinerCardCover}`}>
      <img className={styles.vinerCoverPhoto} src={vinerCoverSrc} alt="" aria-hidden="true" />
      <img className={styles.projectCoverBorder} src={vinerCoverBorderSrc} alt="" aria-hidden="true" />
    </div>
  );
}

function ProjectCardFront({ project }: { project: ProjectCardName }) {
  return (
    <div className={`${styles.projectCardFace} ${styles.projectCardFrontFace}`}>
      <img className={styles.projectCardShadow} src={cardFrontShadowSrc} alt="" aria-hidden="true" />
      <img className={styles.projectCardShell} src={cardFrontShellSrc} alt="" aria-hidden="true" />
      <ProjectCardCover project={project} />
      <p className={styles.projectCardLabel}>Project Name</p>
      <p className={`${styles.projectCardTitle} ${styles[`projectCardTitle${project}`]}`}>
        {projectCardLabels[project]}
      </p>
      <p className={styles.projectCardFlipLabel}>Flip →</p>
    </div>
  );
}

function ProjectCardBack({ project }: { project: ProjectCardName }) {
  const isRoute = project === 'route';

  return (
    <div
      className={`${styles.projectCardFace} ${styles.projectCardBackFace} ${isRoute ? styles.projectCardBackRoute : ''}`}
      aria-hidden="true"
    >
      {project === 'route' && (
        <div className={styles.routeBackBrand}>
          <span><img src={routeBackLogoSrc} alt="" /></span>
          <p>Route</p>
        </div>
      )}
      {project === 'marshall' && <p className={styles.marshallBackBrand}>Marshall</p>}
      {project === 'viner' && <img className={styles.vinerBackBrand} src={vinerBackLogoSrc} alt="" />}

      <p className={styles.projectBackProblemLabel}>Problem</p>
      <p className={styles.projectBackProblemCopy}>
        {project === 'route' ? (
          <>
            취업 준비생은
            <br />'무엇을 해야 할지'보다
            <br />'어떻게 계속할지'가 더 어렵습니다.
          </>
        ) : project === 'marshall' ? (
          <>
            정보는 전달하지만,
            <br />브랜드를 기억하게 만드는
            <br />경험은 부족했습니다.
          </>
        ) : (
          <>
            와인 정보는 많지만,
            <br />초보자가 쉽게 시작할 수 있는
            <br />서비스는 부족했습니다.
          </>
        )}
      </p>

      <p className={styles.projectBackApproachLabel}>Approach</p>
      <p className={styles.projectBackApproachCopy}>
        {project === 'route' ? (
          <>
            사용자가
            <br />매일 앞으로 나아갈 수 있도록
            <br />과정을 중심으로 설계했습니다.
          </>
        ) : project === 'marshall' ? (
          <>
            브랜드를 보는 것이 아닌,
            <br />직접 경험하는
            <br />웹사이트를 목표로 했습니다.
          </>
        ) : (
          <>
            와인을 어렵게 배우기보다,
            <br />기록하고 공유하며
            <br />자연스럽게 즐기도록 설계했습니다.
          </>
        )}
      </p>
      <p className={styles.projectBackOpen}>Open Project</p>
    </div>
  );
}

function ProjectCard({ project, className }: { project: ProjectCardName; className: string }) {
  return (
    <article className={`${styles.projectCardSlot} ${className}`} aria-label={`${projectCardLabels[project]} 프로젝트 카드`}>
      <div className={styles.projectCardStage}>
        <ProjectCardFront project={project} />
        <ProjectCardBack project={project} />
      </div>
    </article>
  );
}

function ProjectsIntroSection() {
  const [isDeckExpanded, setIsDeckExpanded] = useState(false);

  return (
    <section
      id="projects"
      className={styles.projectsIntroSection}
      aria-labelledby="projects-intro-title"
    >
      <div className={styles.projectsIntroCanvas}>
        <img className={styles.projectsIntroGround} src={projectsGroundSrc} alt="" aria-hidden="true" />
        <img className={styles.projectsIntroGrid} src={projectsTextureGridSrc} alt="" aria-hidden="true" />

        <div className={styles.projectsIntroChapter}>
          <p className={styles.projectsIntroEyebrow}>Portfolio</p>
          <p className={styles.projectsIntroCategory}>Portfolio</p>
          <h2 className={styles.projectsIntroHeadline} id="projects-intro-title">
            Selected
            <br />
            Projects
          </h2>
          <p className={styles.projectsIntroBody}>
            기획부터 디자인, 구현까지.
            <br />
            문제를 해결하기 위해 고민했던
            <br />
            프로젝트를 담았습니다.
          </p>
        </div>

        <div
          className={`${styles.projectsDeck} ${isDeckExpanded ? styles.projectsDeckExpanded : ''}`}
          aria-label="선택한 프로젝트 카드"
          aria-expanded={isDeckExpanded}
          role="button"
          tabIndex={0}
          onClick={() => setIsDeckExpanded((expanded) => !expanded)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              setIsDeckExpanded((expanded) => !expanded);
            }
          }}
        >
          <ProjectCard project="viner" className={styles.projectsCard03} />
          <ProjectCard project="marshall" className={styles.projectsCard02} />
          <ProjectCard project="route" className={styles.projectsCard01} />
        </div>
      </div>
    </section>
  );
}

function SkillsSection() {
  return (
    <section id="skills" className={styles.skillsSection} aria-labelledby="skills-title">
      <div className={styles.skillsCanvas}>
        <img className={styles.skillsGround} src={skillsGroundSrc} alt="" aria-hidden="true" />
        <img className={styles.skillsGrid} src={journeyTextureGridSrc} alt="" aria-hidden="true" />

        <h2 className={styles.skillsTitle} id="skills-title">Skills</h2>
        <div className={styles.skillsInstruction}>
          <img src={skillsInstructionDotSrc} alt="" aria-hidden="true" />
          <p>Throw the skills you've found</p>
        </div>

        <div className={styles.skillsPlayBox} aria-hidden="true">
          <img className={styles.skillsPlayBoxBase} src={skillsPlayBoxSrc} alt="" />
          <img className={styles.skillsPlayBoxGrid} src={skillsPlayBoxGridSrc} alt="" />
        </div>

        <ul className={styles.skillsChips} aria-label="사용 기술">
          {skillChips.map((chip) => (
            <li
              key={chip.label}
              className={styles.skillsChip}
              style={{
                insetInlineStart: `${chip.x}%`,
                insetBlockStart: `${chip.y}%`,
                inlineSize: `${(chip.width * skillChipScale) / 19.2}cqw`,
                transform: `translate(-50%, -50%) rotate(${chip.rotation}deg)`,
              }}
            >
              <img src={chip.asset} alt="" aria-hidden="true" />
              <span className={chip.inverse ? styles.skillsChipInverse : undefined}>{chip.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className={styles.contactSection} aria-labelledby="contact-title">
      <div className={styles.contactCanvas}>
        <img className={styles.contactGround} src={contactGroundSrc} alt="" aria-hidden="true" />
        <img className={styles.contactGrid} src={journeyTextureGridSrc} alt="" aria-hidden="true" />

        <div className={styles.contactIntro}>
          <h2 className={styles.contactTitle} id="contact-title">
            Let's build
            <br />
            together.
          </h2>
          <p>좋은 경험은 좋은 대화에서 시작된다고 믿습니다</p>
        </div>

        <div className={styles.contactCta}>
          <div className={styles.contactAvailability}>
            <img src={contactStatusDotSrc} alt="" aria-hidden="true" />
            <p>Open to opportunities</p>
          </div>
          <a className={styles.contactHelloButton} href="mailto:ssachra@gmail.com">
            <img src={contactButtonSrc} alt="" aria-hidden="true" />
            <span>Say Hello →</span>
          </a>
        </div>

        <div className={styles.contactMethods}>
          <img className={styles.contactMethodsRule} src={contactsRuleSrc} alt="" aria-hidden="true" />

          <a className={`${styles.contactMethod} ${styles.contactMethodEmail}`} href="mailto:ssachra@gmail.com">
            <img className={styles.contactMethodTick} src={contactTickSrc} alt="" aria-hidden="true" />
            <span className={styles.contactMethodLabel}>Email</span>
            <span className={styles.contactMethodValue}>ssachra@gmail.com</span>
            <img className={styles.contactMethodUnderline} src={contactEmailUnderlineSrc} alt="" aria-hidden="true" />
          </a>

          <a
            className={`${styles.contactMethod} ${styles.contactMethodGithub}`}
            href="https://github.com/moon-reve"
            target="_blank"
            rel="noreferrer"
          >
            <img className={styles.contactMethodTick} src={contactTickSrc} alt="" aria-hidden="true" />
            <span className={styles.contactMethodLabel}>GitHub</span>
            <span className={styles.contactMethodValue}>https://github.com/moon-reve</span>
            <img className={styles.contactMethodUnderline} src={contactGithubUnderlineSrc} alt="" aria-hidden="true" />
          </a>

          <div className={`${styles.contactMethod} ${styles.contactMethodResume}`}>
            <img className={styles.contactMethodTick} src={contactTickSrc} alt="" aria-hidden="true" />
            <span className={styles.contactMethodLabel}>Resume</span>
            <span className={styles.contactMethodValue}>PDF Preview &amp; Download</span>
            <img className={styles.contactMethodUnderline} src={contactResumeUnderlineSrc} alt="" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}

function ClosingSection() {
  return (
    <section id="closing" className={styles.closingSection} aria-label="Moon Soomin closing">
      <div className={styles.closingCanvas}>
        <img className={styles.closingGround} src={closingGroundSrc} alt="" aria-hidden="true" />
        <img className={styles.closingGrid} src={closingTextureGridSrc} alt="" aria-hidden="true" />
        <p className={styles.closingBrand}>REVE</p>
        <p className={styles.closingDisciplines}>PRODUCT THINKING · UI/UX · FRONT-END · AI</p>
        <p className={styles.closingWordmark} aria-label="moon soomin">moon soomin*</p>
      </div>
    </section>
  );
}

export default function StrategistPage() {
  return (
    <main className={styles.strategistPage}>
      <ScrollNuni />
      <SectionNavigation />
      <section id="hero" className={styles.heroSection} aria-labelledby="hero-title">
        <div className={styles.heroCanvas}>
          <img className={styles.heroGround} src={groundSrc} alt="" aria-hidden="true" />
          <img className={styles.heroGrid} src={textureGridSrc} alt="" aria-hidden="true" />

          <div className={styles.circleAnnotation} aria-hidden="true">
            <img src={circleAnnotationSrc} alt="" draggable="false" />
          </div>

          <div className={styles.heroKicker}>
            <img src={heroKickerDotSrc} alt="" aria-hidden="true" />
            <p>PRODUCT THINKING · UI/UX · FRONT-END · AI</p>
          </div>

          <div className={styles.heroTitle} id="hero-title">
            <p>Ideas</p>
            <p>into</p>
            <p>Reality</p>
          </div>

          <div className={styles.copyAccent} aria-hidden="true">
            <img src={copyAccentSrc} alt="" draggable="false" />
          </div>

          <p className={styles.beliefCopy}>
            좋은 경험은 작은 호기심에서 시작된다고 믿습니다.
            <br />
            질문에서 출발한 아이디어를 사람들에게 닿는 경험으로 연결하고,
            <br />
            그 과정 속에서 더 나은 답을 만들어갑니다.
          </p>

          <div className={styles.heroDotLinks} aria-hidden="true">
            <img src={dotLinksSrc} alt="" draggable="false" />
          </div>
          <div className={styles.heroDotField} aria-hidden="true">
            <img src={dotFieldSrc} alt="" draggable="false" />
          </div>
        </div>
      </section>
      <AboutSection />
      <JourneySection />
      <JourneyDiscoverySection />
      <JourneyObservationSection />
      <JourneyMovementSection />
      <JourneyExpansionSection />
      <JourneyRealitySection />
      <ProjectsIntroSection />
      <SkillsSection />
      <ContactSection />
      <ClosingSection />
    </main>
  );
}
