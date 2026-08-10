import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { gsap } from 'gsap';
import {
  Bodies,
  Body,
  Composite,
  Engine,
  Events,
  Mouse,
  MouseConstraint,
  type IBodyDefinition,
} from 'matter-js';
import { playIdle, resetAutoBlink, resetIdle, startAutoBlink } from '../animations';
import { NuniSpeechBubble } from '../components/nuni/NuniSpeechBubble';
import aboutGroundSrc from '../assets/strategist-about/ground.svg';
import aboutStarSrc from '../assets/strategist-about/star.svg';
import aboutUnderlineSrc from '../assets/strategist-about/underline.svg';
import contactTickSrc from '../assets/strategist-contact/contact-tick.svg';
import contactButtonSrc from '../assets/strategist-contact/cta-button.svg';
import contactEmailUnderlineSrc from '../assets/strategist-contact/email-underline.svg';
import contactResumeUnderlineSrc from '../assets/strategist-contact/resume-underline.svg';
import contactStatusDotSrc from '../assets/strategist-contact/status-dot.svg';
import closingGroundSrc from '../assets/strategist-closing/ground.svg';
import journeyGroundSrc from '../assets/strategist-journey-01/ground.svg';
import journeyPhotoSrc from '../assets/strategist-journey-01/photo.webp';
import journeyTextureGridSrc from '../assets/strategist-journey-01/texture-grid.svg';
import discoveryCropMarksSrc from '../assets/strategist-journey-02/crop-marks.svg';
import discoveryPhotoSrc from '../assets/strategist-journey-02/japan-cafe.webp';
import discoveryPhotoBorderSrc from '../assets/strategist-journey-02/photo-border.svg';
import discoveryRulersSrc from '../assets/strategist-journey-02/rulers.svg';
import observationCropMarksSrc from '../assets/strategist-journey-03/crop-marks.svg';
import observationGroundSrc from '../assets/strategist-journey-03/ground.svg';
import observationPhotoSrc from '../assets/strategist-journey-03/photo.webp';
import observationPhotoBorderSrc from '../assets/strategist-journey-03/photo-border.svg';
import observationRulersSrc from '../assets/strategist-journey-03/rulers.svg';
import movementGroundSrc from '../assets/strategist-journey-04/ground.svg';
import movementPhotoSrc from '../assets/strategist-journey-04/photo.webp';
import expansionCropMarksSrc from '../assets/strategist-journey-05/crop-marks.svg';
import expansionGroundSrc from '../assets/strategist-journey-05/ground.svg';
import expansionPhotoSrc from '../assets/strategist-journey-05/photo.webp';
import expansionPhotoBorderSrc from '../assets/strategist-journey-05/photo-border.svg';
import expansionRulersSrc from '../assets/strategist-journey-05/rulers.svg';
import journeyWhiteCropMarksSrc from '../assets/strategist-journey-common/crop-marks-white.svg';
import journeyWhitePhotoBorderSrc from '../assets/strategist-journey-common/photo-border-white.svg';
import journeyWhiteRulersSrc from '../assets/strategist-journey-common/rulers-white.svg';
import realityCropMarksSrc from '../assets/strategist-journey-06/crop-marks.svg';
import realityPhotoSrc from '../assets/strategist-journey-06/photo.webp';
import realityPhotoBorderSrc from '../assets/strategist-journey-06/photo-border.svg';
import realityRulersSrc from '../assets/strategist-journey-06/rulers.svg';
import cardFrontShadowSrc from '../assets/strategist-project-cards/front-shadow.svg';
import cardFrontShellSrc from '../assets/strategist-project-cards/front-shell.svg';
import marshallCoverSrc from '../assets/strategist-project-cards/marshall-cover.webp';
import marshallCoverBorderSrc from '../assets/strategist-project-cards/marshall-cover-border.svg';
import marshallRuleSrc from '../assets/strategist-project-cards/marshall-rule.svg';
import routeBackLogoSrc from '../assets/strategist-project-cards/route-back-logo.svg';
import routeCoverSrc from '../assets/strategist-project-cards/route-cover.svg';
import routeCoverBorderSrc from '../assets/strategist-project-cards/route-cover-border.svg';
import routeLogoSrc from '../assets/strategist-project-cards/route-logo.svg';
import vinerBackLogoSrc from '../assets/strategist-project-cards/viner-back-logo.svg';
import vinerCoverSrc from '../assets/strategist-project-cards/viner-cover.webp';
import vinerCoverBorderSrc from '../assets/strategist-project-cards/viner-cover-border.svg';
import projectsGroundSrc from '../assets/strategist-projects-intro/ground.svg';
import skillsGroundSrc from '../assets/strategist-skills/ground.svg';
import skillsInstructionDotSrc from '../assets/strategist-skills/instruction-dot.svg';
import skillsPlayBoxGridSrc from '../assets/strategist-skills/play-box-grid.svg';
import circleAnnotationSrc from '../assets/strategist-hero/circle-annotation.svg';
import copyAccentSrc from '../assets/strategist-hero/copy-accent.svg';
import {
  HERO_CIRCLE_BODY_PATH,
  HERO_CIRCLE_END_PATH,
  HERO_CIRCLE_START_PATH,
} from '../assets/strategist-hero/circle-draw-path';
import heroKickerDotSrc from '../assets/strategist-hero/hero-kicker-dot.svg';
import nuniBodySrc from '../assets/strategist-hero/nuni-body.svg';
import nuniCheeksSrc from '../assets/strategist-hero/nuni-cheeks.svg';
import nuniEyesSrc from '../assets/strategist-hero/nuni-eyes.svg';
import nuniMaskSrc from '../assets/strategist-hero/nuni-mask.svg';
import nuniMouthSrc from '../assets/strategist-hero/nuni-mouth.svg';
import nuniShadingSrc from '../assets/strategist-hero/nuni-shading.svg';
import nuniShadowSrc from '../assets/strategist-hero/nuni-shadow.svg';
import nuniChatCloseSrc from '../assets/nuni-chat/close.svg';
import nuniChatDividerSrc from '../assets/nuni-chat/divider.svg';
import nuniChatShadowSrc from '../assets/nuni-chat/modal-shadow.svg';
import nuniChatStatusDotSrc from '../assets/nuni-chat/status-dot.svg';
import nuniChatSurfaceSrc from '../assets/nuni-chat/modal-surface.svg';
import sectionDotActiveSrc from '../assets/strategist-hero/section-dot-active.svg';
import sectionDotSrc from '../assets/strategist-hero/section-dot.svg';
import { aboutMessageGroups, aboutMessageGroupWeights } from '../data/aboutMessages';
import {
  contactMainMessage,
  contactMessageGroups,
  contactMessageGroupWeights,
} from '../data/contactMessages';
import {
  heroGreeting,
  heroMessageGroups,
  heroMessageGroupWeights,
} from '../data/heroMessages';
import {
  journeyCommonMessages,
  journeyMessages,
  journeySectionKeyById,
  journeySectionOrder,
  type JourneyKey,
} from '../data/journeyMessages';
import {
  getProjectPriorityMessages,
  initialProjectInteractionState,
  projectMessageGroups,
  projectMessageGroupWeights,
  type ProjectInteractionState,
} from '../data/projectMessages';
import {
  getSkillMessageDisplayDuration,
  getSkillPriorityMessages,
  skillGeneralMessages,
  skillSpeechMessages,
  type SkillSpeechLabel,
} from '../data/skillMessages';
import { useNuniSpeech, type NuniSpeechSectionConfig } from '../hooks/useNuniSpeech';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { scrollToPageTarget, setSmoothScrollLocked, useSmoothScroll } from '../hooks/useSmoothScroll';
import styles from './StrategistPage.module.scss';

const sectionLabels = ['Hero', 'About', 'Journey', 'Projects', 'Skills', 'Contact'] as const;
const nuniChatQuestions = [
  '왜 UI/UX를 선택했나요?',
  '이전 경험이 어떻게 도움이 되었나요?',
  '가장 기억에 남는 프로젝트는?',
  '일본에서 뭘 배웠나요?',
  'AI는 어떻게 활용했나요?',
  '협업 스타일이 궁금해요.',
  '앞으로의 목표는?',
  '이력서 볼 수 있나요?',
  '연락하고 싶어요.',
] as const;
type NuniChatQuestion = (typeof nuniChatQuestions)[number];

const nuniChatAnswers: Record<NuniChatQuestion, string> = {
  '왜 UI/UX를 선택했나요?':
    '저는 UI/UX를 사용자의 행동을 설계하는 일이라고 생각합니다. 사용자가 어떤 행동을 할지 예상하고, 그 행동이 자연스럽게 이어질 수 있도록 경험을 만드는 과정이 가장 재미있었습니다. 그래서 UI/UX 디자이너를 선택했습니다.',
  '이전 경험이 어떻게 도움이 되었나요?':
    '제가 해왔던 일들은 모두 사람과의 소통이 중요한 직무였습니다. 고객, 촬영 대상, 구매자의 행동을 관찰하며 사람을 이해하는 습관을 자연스럽게 익혔습니다. 그래서 지금도 프로젝트를 시작하면 화면보다 먼저 사용자가 어떤 경험을 하고, 어떻게 행동할지를 고민합니다.',
  '가장 기억에 남는 프로젝트는?':
    '가장 기억에 남는 프로젝트는 Marshall입니다. 진행 중이던 프로젝트가 2주 만에 전면 변경되고, 팀원 구성까지 계속 바뀌면서 다른 팀보다 훨씬 짧은 기간 안에 새 프로젝트를 완성해야 했습니다. 어수선한 상황 속에서 팀원들을 다독이고 역할과 일정을 다시 정리하며 빠르게 프로젝트를 이끌었습니다. 쉽지 않은 과정이었지만 끝까지 완성해 냈다는 성취감이 가장 크게 남은 프로젝트입니다.',
  '일본에서 뭘 배웠나요?':
    '일본에 간 이유와 실제 경험은 달랐습니다. 커피를 배우는 대신 화장품 판매와 온라인 MD를 경험하며 다양한 사람들과 협업했고, 고객의 행동과 반응을 세심하게 관찰하는 법을 배웠습니다. 사람들은 같은 상황에서도 서로 다른 선택을 한다는 것을 가까이에서 경험했고, 그 선택 뒤에는 항상 이유가 있다는 것을 자연스럽게 배우게 되었습니다.',
  'AI는 어떻게 활용했나요?':
    'ChatGPT, Claude, Gemini를 활용해 리서치와 UX 아이디어를 발전시키고, 정보 구조와 콘텐츠를 검토했습니다. AI는 결과를 대신 만들어주는 도구가 아니라, 다양한 관점을 함께 고민하고 끊임없이 검토하며 더 나은 답을 찾도록 도와주는 협업 파트너이자 사고를 확장하는 비서처럼 활용하고 있습니다.',
  '협업 스타일이 궁금해요.':
    '팀원으로 참여할 때는 맡은 일을 책임감 있게 수행하는 것을 가장 중요하게 생각합니다. 불분명한 부분은 먼저 확인하고 충분히 소통하며, 작은 오해가 프로젝트 전체에 영향을 주지 않도록 노력합니다. 팀장일 때는 팀원들의 의견을 먼저 경청하고 독단적으로 결정하지 않으려 합니다. 다만 방향을 정해야 하는 순간에는 모두가 공감할 수 있는 기준을 만든 뒤 빠르게 결정하고 프로젝트를 이끌어갑니다.',
  '앞으로의 목표는?':
    '기획한 아이디어를 실제 사용자가 경험할 수 있는 서비스로 구현하는 디자이너가 되고 싶습니다. 변화하는 기술을 적극적으로 받아들이고 AI와 새로운 도구를 활용하며, 사용자의 행동을 이해해 더 자연스럽고 직관적인 경험을 설계하는 디자이너로 성장하는 것이 목표입니다.',
  '이력서 볼 수 있나요?': '물론입니다. 아래 버튼을 통해 이력서를 확인하실 수 있습니다.',
  '연락하고 싶어요.': '감사합니다. 아래에서 편한 방법으로 연락해 주세요.',
};
const nuniChatTargetSectionIds: Partial<Record<NuniChatQuestion, string>> = {
  '왜 UI/UX를 선택했나요?': 'hero',
  '이전 경험이 어떻게 도움이 되었나요?': 'journey',
  '가장 기억에 남는 프로젝트는?': 'projects',
  '일본에서 뭘 배웠나요?': 'journey-discovery',
  'AI는 어떻게 활용했나요?': 'skills',
  '협업 스타일이 궁금해요.': 'journey-reality',
  '앞으로의 목표는?': 'about',
  '이력서 볼 수 있나요?': 'contact',
  '연락하고 싶어요.': 'contact',
};
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

const skillChips: readonly {
  label: SkillSpeechLabel;
  category: 'code' | 'program' | 'ai';
  width: number;
  rotation: number;
}[] = [
  { label: 'Javascript', category: 'code', width: 121.5, rotation: -25.6 },
  { label: 'Premiere Pro', category: 'program', width: 136.2, rotation: -22.7 },
  { label: 'Figma', category: 'program', width: 93, rotation: 7.4 },
  { label: 'Illustrator', category: 'program', width: 117.6, rotation: -24 },
  { label: 'Vercel', category: 'code', width: 93, rotation: 14.2 },
  { label: 'Lightroom', category: 'program', width: 115.7, rotation: -13.8 },
  { label: 'Github', category: 'code', width: 93, rotation: 15.9 },
  { label: 'Gemini', category: 'ai', width: 94, rotation: 1.1 },
  { label: 'Stitch', category: 'ai', width: 93, rotation: -8.7 },
  { label: 'Midjourney', category: 'ai', width: 121.5, rotation: -8.4 },
  { label: 'Tailwind CSS', category: 'code', width: 144, rotation: 17.9 },
  { label: 'ChatGPT', category: 'ai', width: 110.3, rotation: 14.8 },
  { label: 'HTML', category: 'code', width: 93, rotation: 15.6 },
  { label: 'Typescript', category: 'code', width: 120.2, rotation: -10.8 },
  { label: 'GSAP', category: 'code', width: 93, rotation: 12.5 },
  { label: 'Claude', category: 'ai', width: 94.9, rotation: 11.5 },
  { label: 'Photoshop', category: 'program', width: 120.4, rotation: 7.1 },
  { label: 'React', category: 'code', width: 93, rotation: -2.9 },
  { label: 'After Effects', category: 'program', width: 134.6, rotation: 0.1 },
];

const skillChipScale = 1332 / 1478;

const nuniSectionWaypoints = [
  { id: 'hero', x: 73.0208, y: 10.7813, scale: 1 },
  { id: 'about', x: 3.65, y: 15.35, scale: 1.12 },
  { id: 'journey', x: 81, y: 7.5, scale: 1.08 },
  { id: 'journey-discovery', x: 6, y: 39.8, scale: 1.08 },
  { id: 'journey-observation', x: 82, y: 8, scale: 1.08 },
  { id: 'journey-movement', x: 40.5, y: 25.5, scale: 1.08 },
  { id: 'journey-expansion', x: 75, y: 40, scale: 1.08 },
  { id: 'journey-reality', x: 6, y: 8.5, scale: 1.08 },
  { id: 'projects', x: 40, y: 27, scale: 1.08 },
  { id: 'skills', x: 59.43, y: 24.79, scale: 1.42 },
  { id: 'contact', x: 71.63, y: 29.58, scale: 1.42 },
  { id: 'closing', x: 84, y: 5.5, scale: 0.9 },
] as const;

type SectionLabel = (typeof sectionLabels)[number];

const heroAmbientDotLayout = [
  { x: 704, y: 464, r: 4.2, opacity: 0.34 },
  { x: 1018, y: 352, r: 4.8, opacity: 0.42 },
  { x: 1266, y: 492, r: 3.7, opacity: 0.3 },
  { x: 1508, y: 306, r: 4.4, opacity: 0.38 },
  { x: 1738, y: 548, r: 4, opacity: 0.34 },
  { x: 824, y: 832, r: 3.5, opacity: 0.28 },
  { x: 1192, y: 744, r: 4.3, opacity: 0.36 },
  { x: 1606, y: 824, r: 3.8, opacity: 0.32 },
] as const;

const heroAmbientLinks = [[0, 1], [3, 4], [5, 6]] as const;

function HeroAmbientDots() {
  const svgRef = useRef<SVGSVGElement>(null);
  const dotRefs = useRef<Array<SVGCircleElement | null>>([]);
  const linkRefs = useRef<Array<SVGLineElement | null>>([]);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return undefined;
    let disposed = false;
    const timelines = new Set<gsap.core.Timeline>();
    const delayedCalls = new Set<gsap.core.Tween>();
    const animatedElements = [...dotRefs.current, ...linkRefs.current].filter(Boolean);
    const positions = heroAmbientDotLayout.map(({ x, y }) => ({ x, y }));

    const randomPoint = (ignored: readonly number[] = []) => {
      let point = { x: 0, y: 0 };
      for (let attempt = 0; attempt < 24; attempt += 1) {
        point = {
          x: gsap.utils.random(660, 1780),
          y: gsap.utils.random(135, 955),
        };
        const hasEnoughSpace = positions.every((position, index) => (
          ignored.includes(index) || Math.hypot(point.x - position.x, point.y - position.y) > 135
        ));
        if (hasEnoughSpace) break;
      }
      return point;
    };

    const placePair = (from: number, to: number) => {
      const first = randomPoint([from, to]);
      let second = randomPoint([from, to]);
      for (let attempt = 0; attempt < 18; attempt += 1) {
        const angle = gsap.utils.random(0, Math.PI * 2);
        const distance = gsap.utils.random(170, 390);
        const candidate = {
          x: first.x + Math.cos(angle) * distance,
          y: first.y + Math.sin(angle) * distance,
        };
        if (candidate.x < 660 || candidate.x > 1780 || candidate.y < 135 || candidate.y > 955) continue;
        const hasEnoughSpace = positions.every((position, index) => (
          index === from || index === to
          || Math.hypot(candidate.x - position.x, candidate.y - position.y) > 135
        ));
        if (hasEnoughSpace) {
          second = candidate;
          break;
        }
      }
      positions[from] = first;
      positions[to] = second;
      return { first, second };
    };

    const startPairCycle = (groupIndex: number, delay: number) => {
      const call = gsap.delayedCall(Math.max(0.05, delay), () => {
        delayedCalls.delete(call);
        if (disposed) return;
        const [from, to] = heroAmbientLinks[groupIndex];
        const firstDot = dotRefs.current[from];
        const secondDot = dotRefs.current[to];
        const line = linkRefs.current[groupIndex];
        if (!firstDot || !secondDot || !line) return;

        const { first, second } = placePair(from, to);
        const distance = Math.hypot(second.x - first.x, second.y - first.y);
        firstDot.setAttribute('cx', first.x.toFixed(2));
        firstDot.setAttribute('cy', first.y.toFixed(2));
        secondDot.setAttribute('cx', second.x.toFixed(2));
        secondDot.setAttribute('cy', second.y.toFixed(2));
        line.setAttribute('x1', first.x.toFixed(2));
        line.setAttribute('y1', first.y.toFixed(2));
        line.setAttribute('x2', second.x.toFixed(2));
        line.setAttribute('y2', second.y.toFixed(2));

        gsap.set([firstDot, secondDot], { opacity: 0 });
        gsap.set(line, {
          opacity: 0.16,
          strokeDasharray: distance,
          strokeDashoffset: distance,
        });

        const timeline = gsap.timeline({
          onComplete: () => {
            timelines.delete(timeline);
            startPairCycle(groupIndex, gsap.utils.random(1.2, 2.8));
          },
        });
        timeline
          .to(firstDot, { opacity: heroAmbientDotLayout[from].opacity, duration: 1.25, ease: 'sine.inOut' }, 0)
          .to(secondDot, { opacity: heroAmbientDotLayout[to].opacity, duration: 1.25, ease: 'sine.inOut' }, 0.25)
          .to(line, { strokeDashoffset: 0, duration: 1.15, ease: 'power1.inOut' }, 1.6)
          .to(line, { strokeDashoffset: -distance, duration: 0.9, ease: 'power1.inOut' }, 4.1)
          .to([firstDot, secondDot], { opacity: 0, duration: 1.15, ease: 'sine.inOut' }, 5.15);
        timelines.add(timeline);
      });
      delayedCalls.add(call);
    };

    const startSoloCycle = (dotIndex: number, delay: number) => {
      const call = gsap.delayedCall(Math.max(0.05, delay), () => {
        delayedCalls.delete(call);
        if (disposed) return;
        const dot = dotRefs.current[dotIndex];
        if (!dot) return;
        const point = randomPoint([dotIndex]);
        positions[dotIndex] = point;
        dot.setAttribute('cx', point.x.toFixed(2));
        dot.setAttribute('cy', point.y.toFixed(2));
        gsap.set(dot, { opacity: 0 });
        const timeline = gsap.timeline({
          onComplete: () => {
            timelines.delete(timeline);
            startSoloCycle(dotIndex, gsap.utils.random(1.5, 3.5));
          },
        });
        timeline
          .to(dot, { opacity: heroAmbientDotLayout[dotIndex].opacity, duration: 1.4, ease: 'sine.inOut' })
          .to(dot, { opacity: 0, duration: 1.3, ease: 'sine.inOut' }, `+=${gsap.utils.random(2.4, 4.2)}`);
        timelines.add(timeline);
      });
      delayedCalls.add(call);
    };

    if (prefersReducedMotion) {
      heroAmbientDotLayout.forEach((dot, index) => {
        gsap.set(dotRefs.current[index], { opacity: dot.opacity * 0.8 });
      });
      heroAmbientLinks.forEach(([from, to], index) => {
        const line = linkRefs.current[index];
        line?.setAttribute('x1', positions[from].x.toFixed(2));
        line?.setAttribute('y1', positions[from].y.toFixed(2));
        line?.setAttribute('x2', positions[to].x.toFixed(2));
        line?.setAttribute('y2', positions[to].y.toFixed(2));
        gsap.set(line, { opacity: 0.08 });
      });
    } else {
      heroAmbientLinks.forEach((_, index) => startPairCycle(index, index * 2.1));
      startSoloCycle(2, 1.1);
      startSoloCycle(7, 3.4);
    }

    return () => {
      disposed = true;
      delayedCalls.forEach((call) => call.kill());
      timelines.forEach((timeline) => timeline?.kill());
      gsap.killTweensOf(animatedElements);
    };
  }, [prefersReducedMotion]);

  return (
    <svg
      ref={svgRef}
      className={styles.heroAmbientField}
      viewBox="0 0 1920 1080"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g className={styles.heroAmbientLinks}>
        {heroAmbientLinks.map(([from, to], index) => (
          <line
            key={`${from}-${to}`}
            ref={(element) => { linkRefs.current[index] = element; }}
          />
        ))}
      </g>
      <g className={styles.heroAmbientDots}>
        {heroAmbientDotLayout.map((dot, index) => (
          <circle
            key={`${dot.x}-${dot.y}`}
            ref={(element) => { dotRefs.current[index] = element; }}
            cx={dot.x}
            cy={dot.y}
            r={dot.r}
          />
        ))}
      </g>
    </svg>
  );
}

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

const darkNavigationSectionIds = ['journey', 'journey-movement', 'skills', 'closing'] as const;
const projectDeckOpenEvent = 'projects:open-deck';
const projectDeckCloseEvent = 'projects:close-deck';
const journeySpeechCardChangeEvent = 'nuni:journey-card-change';
const projectInteractionChangeEvent = 'nuni:project-interaction-change';
const skillInteractionChangeEvent = 'nuni:skill-interaction-change';
const skillCatchEvent = 'nuni:skill-catch';

const publishProjectInteraction = (state: Partial<ProjectInteractionState>) => {
  window.dispatchEvent(new CustomEvent(projectInteractionChangeEvent, { detail: state }));
};

const resolveActiveJourneyKey = (): JourneyKey | null => {
  const journeyStack = document.querySelector<HTMLElement>(`.${styles.journeyStack}`);
  const firstJourneySection = document.getElementById('journey');
  if (!journeyStack || !firstJourneySection) return null;

  const stackRect = journeyStack.getBoundingClientRect();
  const sectionHeight = firstJourneySection.offsetHeight;
  if (sectionHeight <= 0 || stackRect.top >= window.innerHeight || stackRect.bottom <= 0) return null;
  if (stackRect.top > 0) return journeySectionKeyById[journeySectionOrder[0]];

  const progress = Math.max(
    0,
    Math.min(journeySectionOrder.length - 1, -stackRect.top / sectionHeight),
  );
  return journeySectionKeyById[journeySectionOrder[Math.round(progress)]] ?? null;
};

const nuniSpeechSections = [
  {
    sectionId: 'hero',
    messageGroups: heroMessageGroups,
    groupWeights: heroMessageGroupWeights,
    initialDelay: [4000, 7000],
    displayDuration: [3000, 5000],
    repeatDelay: [4000, 7000],
    recentMessageLimit: 2,
    greeting: {
      message: heroGreeting,
      delay: 1000,
      duration: 4500,
      sessionKey: 'nuni-hero-greeting-shown',
    },
  },
  {
    sectionId: 'about',
    messageGroups: aboutMessageGroups,
    groupWeights: aboutMessageGroupWeights,
    initialDelay: [2000, 4000],
    displayDuration: [3000, 5000],
    repeatDelay: [7000, 11000],
    recentMessageLimit: 1,
  },
  {
    sectionId: 'journey',
    contextualMessages: {
      eventName: journeySpeechCardChangeEvent,
      resolveContextKey: resolveActiveJourneyKey,
      commonMessages: journeyCommonMessages,
      specificMessages: journeyMessages,
      specificProbability: 0.7,
    },
    initialDelay: [2000, 4000],
    displayDuration: [3000, 5000],
    repeatDelay: [6000, 10000],
    recentMessageLimit: 2,
  },
  {
    sectionId: 'projects',
    messageGroups: projectMessageGroups,
    groupWeights: projectMessageGroupWeights,
    interactionMessages: {
      eventName: projectInteractionChangeEvent,
      initialState: initialProjectInteractionState,
      getPriorityMessages: getProjectPriorityMessages,
      blockGeneralUntilComplete: true,
    },
    initialDelay: [2500, 4000],
    displayDuration: [3000, 5000],
    repeatDelay: [7000, 11000],
    recentMessageLimit: 2,
  },
  {
    sectionId: 'skills',
    messageGroups: { general: skillGeneralMessages },
    groupWeights: { general: 1 },
    interactionMessages: {
      eventName: skillInteractionChangeEvent,
      initialState: { hasThrownSkill: false },
      getPriorityMessages: getSkillPriorityMessages,
    },
    reactionMessages: {
      eventName: skillCatchEvent,
      messages: skillSpeechMessages,
      delay: [300, 600],
      getDisplayDuration: getSkillMessageDisplayDuration,
    },
    initialDelay: [3000, 5000],
    displayDuration: [3500, 4500],
    repeatDelay: [10000, 15000],
    recentMessageLimit: 1,
  },
  {
    sectionId: 'contact',
    messageGroups: contactMessageGroups,
    groupWeights: contactMessageGroupWeights,
    initialDelay: [8000, 12000],
    displayDuration: [4000, 5000],
    repeatDelay: [8000, 12000],
    recentMessageLimit: 2,
    maxRandomMessagesPerVisit: 2,
    greeting: {
      message: contactMainMessage,
      delay: 2500,
      duration: 4500,
      sessionKey: 'nuni-contact-ending-shown',
    },
  },
] as const satisfies readonly NuniSpeechSectionConfig[];

function ScrollNuni() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const ambientMotionRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);
  const bodyLookRef = useRef<HTMLDivElement>(null);
  const eyeDirectionRef = useRef<HTMLSpanElement>(null);
  const eyesRef = useRef<HTMLSpanElement>(null);
  const shadowRef = useRef<HTMLSpanElement>(null);
  const chatDialogRef = useRef<HTMLDivElement>(null);
  const chatConversationRef = useRef<HTMLDivElement>(null);
  const chatReturnTransformRef = useRef<{ x: number; y: number; scale: number } | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatQuestionHistory, setChatQuestionHistory] = useState<NuniChatQuestion[]>([]);
  const { message: speechMessage, isVisible: isSpeechVisible } = useNuniSpeech(
    nuniSpeechSections,
    isChatOpen,
  );
  const latestChatQuestion = chatQuestionHistory.at(-1) ?? null;

  useEffect(() => {
    const conversation = chatConversationRef.current;
    if (chatQuestionHistory.length === 0 || !conversation) return undefined;

    const scrollFrame = window.requestAnimationFrame(() => {
      conversation.scrollTo({ top: conversation.scrollHeight, behavior: 'smooth' });
    });
    return () => window.cancelAnimationFrame(scrollFrame);
  }, [chatQuestionHistory]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return undefined;

    if (!isChatOpen) {
      const returnTransform = chatReturnTransformRef.current;
      delete scene.dataset.chatOpen;
      if (!returnTransform) return undefined;
      chatReturnTransformRef.current = null;
      gsap.to(scene, {
        ...returnTransform,
        duration: prefersReducedMotion ? 0 : 0.72,
        ease: 'power3.inOut',
        overwrite: 'auto',
      });
      return undefined;
    }

    const dialog = chatDialogRef.current;
    if (!dialog) return undefined;
    scene.dataset.chatOpen = 'true';
    const previousBodyOverflow = document.body.style.overflow;
    const previousDocumentOverflow = document.documentElement.style.overflow;
    setSmoothScrollLocked(true);
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const moveNuniToDialog = () => {
      const dialogRect = dialog.getBoundingClientRect();
      const targetWidth = dialogRect.width * 0.1763;
      const targetScale = targetWidth / Math.max(scene.offsetWidth, 1);
      gsap.to(scene, {
        x: dialogRect.left + dialogRect.width * 0.1214,
        y: dialogRect.top,
        scale: targetScale,
        duration: prefersReducedMotion ? 0 : 0.72,
        ease: 'power3.inOut',
        overwrite: 'auto',
      });
    };

    const moveFrame = window.requestAnimationFrame(moveNuniToDialog);
    const closeChatWithEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsChatOpen(false);
      }
    };
    window.addEventListener('keydown', closeChatWithEscape);
    window.addEventListener('resize', moveNuniToDialog);
    return () => {
      window.cancelAnimationFrame(moveFrame);
      window.removeEventListener('keydown', closeChatWithEscape);
      window.removeEventListener('resize', moveNuniToDialog);
      setSmoothScrollLocked(false);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousDocumentOverflow;
    };
  }, [isChatOpen, prefersReducedMotion]);

  const toggleNuniChat = () => {
    const scene = sceneRef.current;
    if (!isChatOpen && scene) {
      chatReturnTransformRef.current = {
        x: Number(gsap.getProperty(scene, 'x')) || scene.getBoundingClientRect().left,
        y: Number(gsap.getProperty(scene, 'y')) || scene.getBoundingClientRect().top,
        scale: Number(gsap.getProperty(scene, 'scaleX')) || 1,
      };
      gsap.killTweensOf(scene);
    }
    setIsChatOpen((isOpen) => !isOpen);
  };

  const selectChatQuestion = (question: NuniChatQuestion) => {
    setChatQuestionHistory((history) => [...history, question]);

    const targetSectionId = nuniChatTargetSectionIds[question];
    if (!targetSectionId) return;

    const targetSection = document.getElementById(targetSectionId);
    if (targetSection) scrollToPageTarget(targetSection, prefersReducedMotion);
  };

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

    playIdle(idleTargets, {
      floatHeight: 6,
      floatSpeed: 3.4,
      bodyScaleXUp: 0.999,
      bodyScaleYUp: 1.002,
      bodyScaleXDown: 1.001,
      bodyScaleYDown: 0.999,
      shadowScaleMin: 0.96,
      shadowScaleMax: 1.02,
      shadowOpacityMin: 0.82,
      shadowOpacityMax: 0.9,
    });
    startAutoBlink(blinkTargets);

    return () => {
      resetIdle(idleTargets);
      resetAutoBlink(blinkTargets);
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    const scene = sceneRef.current;
    const ambientMotion = ambientMotionRef.current;
    const hero = document.getElementById('hero');
    if (!scene || !ambientMotion || !hero || prefersReducedMotion) return undefined;

    let active = false;
    let followingPointer = false;
    let pointerX: number | null = null;
    let pointerY: number | null = null;
    let stillTimer = 0;
    let roamCall: gsap.core.Tween | null = null;

    const heroIsActive = () => {
      const rect = hero.getBoundingClientRect();
      return rect.top < window.innerHeight * 0.55 && rect.bottom > window.innerHeight * 0.45;
    };

    const scheduleRoam = () => {
      roamCall?.kill();
      if (!active) return;
      roamCall = gsap.to(ambientMotion, {
        x: gsap.utils.random(-28, 30),
        y: gsap.utils.random(-18, 20),
        rotation: gsap.utils.random(-1.6, 1.6),
        duration: gsap.utils.random(5.2, 7.4),
        ease: 'sine.inOut',
        overwrite: 'auto',
        onComplete: scheduleRoam,
      });
    };

    const clearStillTimer = () => {
      if (!stillTimer) return;
      window.clearTimeout(stillTimer);
      stillTimer = 0;
    };

    const followStillPointer = () => {
      stillTimer = 0;
      if (!active || pointerX === null || pointerY === null) return;
      followingPointer = true;
      roamCall?.kill();

      const rect = scene.getBoundingClientRect();
      const heroRect = hero.getBoundingClientRect();
      const centerX = rect.left + rect.width * 0.5;
      const centerY = rect.top + rect.height * 0.48;
      const rawX = pointerX - centerX - 46;
      const rawY = pointerY - centerY;
      const targetX = gsap.utils.clamp(36 - centerX, window.innerWidth - 36 - centerX, rawX);
      const targetY = gsap.utils.clamp(
        Math.max(84, heroRect.top + 36) - centerY,
        Math.min(window.innerHeight - 36, heroRect.bottom - 36) - centerY,
        rawY,
      );
      const distance = Math.hypot(targetX, targetY);

      gsap.to(ambientMotion, {
        x: targetX,
        y: targetY,
        rotation: gsap.utils.clamp(-2.4, 2.4, targetX * 0.008),
        duration: gsap.utils.clamp(1.5, 2.7, distance / 95),
        ease: 'power2.inOut',
        overwrite: 'auto',
      });
    };

    const scheduleStillFollow = () => {
      clearStillTimer();
      if (!active || pointerX === null || pointerY === null) return;
      stillTimer = window.setTimeout(followStillPointer, 2000);
    };

    const syncHeroState = () => {
      const nextActive = heroIsActive();
      if (nextActive === active) return;
      active = nextActive;
      followingPointer = false;
      if (active) {
        scheduleRoam();
        scheduleStillFollow();
      } else {
        clearStillTimer();
        roamCall?.kill();
        gsap.to(ambientMotion, {
          x: 0,
          y: 0,
          rotation: 0,
          duration: 0.8,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!active) return;
      if (followingPointer) {
        followingPointer = false;
        scheduleRoam();
      }
      scheduleStillFollow();
    };

    const handlePointerLeave = () => {
      pointerX = null;
      pointerY = null;
      clearStillTimer();
      if (!active || !followingPointer) return;
      followingPointer = false;
      scheduleRoam();
    };

    syncHeroState();
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', syncHeroState, { passive: true });
    window.addEventListener('resize', syncHeroState);
    document.documentElement.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      clearStillTimer();
      roamCall?.kill();
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', syncHeroState);
      window.removeEventListener('resize', syncHeroState);
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
      gsap.killTweensOf(ambientMotion);
      gsap.set(ambientMotion, { clearProps: 'transform' });
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    const scene = sceneRef.current;
    const bodyLook = bodyLookRef.current;
    const eyeDirection = eyeDirectionRef.current;
    if (!scene || !bodyLook || !eyeDirection) return undefined;

    if (prefersReducedMotion) {
      gsap.set([bodyLook, eyeDirection], { clearProps: 'transform' });
      return undefined;
    }

    const moveEyeX = gsap.quickTo(eyeDirection, 'x', {
      duration: 0.22,
      ease: 'power2.out',
    });
    const moveEyeY = gsap.quickTo(eyeDirection, 'y', {
      duration: 0.22,
      ease: 'power2.out',
    });
    const moveBodyX = gsap.quickTo(bodyLook, 'x', {
      duration: 0.4,
      ease: 'power2.out',
    });
    const moveBodyY = gsap.quickTo(bodyLook, 'y', {
      duration: 0.4,
      ease: 'power2.out',
    });
    const rotateBody = gsap.quickTo(bodyLook, 'rotation', {
      duration: 0.4,
      ease: 'power2.out',
    });
    let pointerX: number | null = null;
    let pointerY: number | null = null;
    let frame = 0;

    const updateEyeDirection = () => {
      frame = 0;
      if (pointerX === null || pointerY === null) return;

      const sceneRect = scene.getBoundingClientRect();
      const deltaX = pointerX - (sceneRect.left + (sceneRect.width * 0.5));
      const deltaY = pointerY - (sceneRect.top + (sceneRect.height * 0.45));
      const distance = Math.hypot(deltaX, deltaY);
      if (distance < 1) {
        moveEyeX(0);
        moveEyeY(0);
        moveBodyX(0);
        moveBodyY(0);
        rotateBody(0);
        return;
      }

      const strength = Math.min(
        1,
        distance / Math.max(Math.min(window.innerWidth, window.innerHeight) * 0.18, 1),
      );
      moveEyeX((deltaX / distance) * 3.5 * strength);
      moveEyeY((deltaY / distance) * 2.2 * strength);
      moveBodyX((deltaX / distance) * 4 * strength);
      moveBodyY((deltaY / distance) * 3 * strength);
      rotateBody((deltaX / distance) * strength);
    };

    const requestEyeUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateEyeDirection);
    };
    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      requestEyeUpdate();
    };
    const resetEyeDirection = () => {
      pointerX = null;
      pointerY = null;
      moveEyeX(0);
      moveEyeY(0);
      moveBodyX(0);
      moveBodyY(0);
      rotateBody(0);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', requestEyeUpdate, { passive: true });
    window.addEventListener('resize', requestEyeUpdate);
    window.addEventListener('blur', resetEyeDirection);
    document.documentElement.addEventListener('pointerleave', resetEyeDirection);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', requestEyeUpdate);
      window.removeEventListener('resize', requestEyeUpdate);
      window.removeEventListener('blur', resetEyeDirection);
      document.documentElement.removeEventListener('pointerleave', resetEyeDirection);
      if (frame) window.cancelAnimationFrame(frame);
      moveEyeX.tween.kill();
      moveEyeY.tween.kill();
      moveBodyX.tween.kill();
      moveBodyY.tween.kill();
      rotateBody.tween.kill();
      gsap.set([bodyLook, eyeDirection], { clearProps: 'transform' });
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    const scene = sceneRef.current;
    const ambientMotion = ambientMotionRef.current;
    if (!scene || !ambientMotion) return undefined;

    const sections = nuniSectionWaypoints
      .map((waypoint) => ({ waypoint, element: document.getElementById(waypoint.id) }))
      .filter((entry): entry is { waypoint: (typeof nuniSectionWaypoints)[number]; element: HTMLElement } => Boolean(entry.element));
    const journeyStack = document.querySelector<HTMLElement>(`.${styles.journeyStack}`);
    const journeyWaypoints = sections.filter(({ element }) => element.parentElement === journeyStack);
    const projectsWaypoint = sections.find(({ waypoint }) => waypoint.id === 'projects')?.waypoint;
    const projectTapWaypoint = { id: 'projects-tap', x: 53.5, y: 23.5, scale: 1.08 } as const;
    const projectCard = document.querySelector<HTMLElement>(`.${styles.projectsCard01}`);
    const easeJourneyExit = gsap.parseEase('power2.inOut');

    let activeId = '';
    let activeJourneyKey: JourneyKey | null = resolveActiveJourneyKey();
    let frame = 0;
    let projectTapTriggered = false;
    let projectTapTimeline: gsap.core.Timeline | null = null;

    const syncActiveJourneyKey = (sectionId: string) => {
      const nextJourneyKey = journeySectionKeyById[sectionId] ?? null;
      if (nextJourneyKey === activeJourneyKey) return;
      activeJourneyKey = nextJourneyKey;
      window.dispatchEvent(new CustomEvent(journeySpeechCardChangeEvent, {
        detail: activeJourneyKey,
      }));
    };

    const playProjectArrival = () => {
      if (projectTapTriggered || !projectsWaypoint) return;
      projectTapTriggered = true;
      projectTapTimeline?.kill();

      const tapPosition = {
        x: projectTapWaypoint.x / 100 * window.innerWidth,
        y: projectTapWaypoint.y / 100 * window.innerWidth,
        scale: projectTapWaypoint.scale,
      };
      const finalPosition = {
        x: projectsWaypoint.x / 100 * window.innerWidth,
        y: projectsWaypoint.y / 100 * window.innerWidth,
        scale: projectsWaypoint.scale,
      };

      if (prefersReducedMotion || !projectCard) {
        gsap.set(scene, finalPosition);
        return;
      }

      const impactDistance = gsap.utils.clamp(24, 38, window.innerWidth * 0.018);
      projectTapTimeline = gsap.timeline()
        .to(scene, { ...tapPosition, duration: 0.22, ease: 'power2.out', overwrite: 'auto' }, 0)
        .to(ambientMotion, {
          x: impactDistance,
          rotation: 5,
          scaleX: 1.08,
          scaleY: 0.94,
          duration: 0.12,
          ease: 'power3.in',
          overwrite: 'auto',
        }, 0.22)
        .to(projectCard, {
          x: 18,
          rotation: 2.5,
          duration: 0.08,
          ease: 'power3.out',
          overwrite: 'auto',
        }, 0.34)
        .call(() => window.dispatchEvent(new Event(projectDeckOpenEvent)), [], 0.34)
        .to(ambientMotion, {
          x: 0,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
          duration: 0.32,
          ease: 'back.out(2.4)',
        }, 0.34)
        .to(projectCard, {
          x: 0,
          rotation: 0,
          duration: 0.36,
          ease: 'elastic.out(1, 0.45)',
        }, 0.42)
        .to(scene, { ...finalPosition, duration: 0.8, ease: 'power3.inOut', overwrite: 'auto' }, 0.66);
    };

    const moveToActiveSection = (immediate = false, force = false) => {
      frame = 0;
      if (scene.dataset.skillsRescue === 'true' || scene.dataset.chatOpen === 'true') return;
      if (journeyStack && journeyWaypoints.length > 1) {
        const stackRect = journeyStack.getBoundingClientRect();
        const sectionHeight = journeyWaypoints[0].element.offsetHeight;
        const stackIsActive = sectionHeight > 0
          && stackRect.top <= 0
          && stackRect.bottom > 0;

        if (stackIsActive) {
          let from;
          let to;
          let amount;

          if (stackRect.bottom < sectionHeight && projectsWaypoint) {
            const exitProgress = gsap.utils.clamp(0, 1, 1 - (stackRect.bottom / sectionHeight));
            if (exitProgress < 0.75) {
              if (projectTapTriggered) {
                if (exitProgress >= 0.68) {
                  activeId = projectsWaypoint.id;
                  syncActiveJourneyKey(activeId);
                  return;
                }
                projectTapTriggered = false;
                projectTapTimeline?.kill();
                gsap.set(ambientMotion, { x: 0 });
                if (projectCard) gsap.set(projectCard, { x: 0 });
                window.dispatchEvent(new Event(projectDeckCloseEvent));
              }
              from = journeyWaypoints.at(-1)?.waypoint ?? journeyWaypoints[0].waypoint;
              to = projectTapWaypoint;
              amount = easeJourneyExit(gsap.utils.clamp(0, 1, exitProgress / 0.75));
            } else {
              activeId = projectsWaypoint.id;
              syncActiveJourneyKey(activeId);
              playProjectArrival();
              return;
            }
          } else {
            const progress = gsap.utils.clamp(
              0,
              journeyWaypoints.length - 1,
              -stackRect.top / sectionHeight,
            );
            const fromIndex = Math.floor(progress);
            const toIndex = Math.min(fromIndex + 1, journeyWaypoints.length - 1);
            from = journeyWaypoints[fromIndex].waypoint;
            to = journeyWaypoints[toIndex].waypoint;
            amount = progress - fromIndex;
          }

          activeId = amount < 0.5 ? from.id : to.id;
          syncActiveJourneyKey(activeId);
          gsap.killTweensOf(scene);
          gsap.set(scene, {
            x: gsap.utils.interpolate(from.x, to.x, amount) / 100 * window.innerWidth,
            y: gsap.utils.interpolate(from.y, to.y, amount) / 100 * window.innerWidth,
            scale: gsap.utils.interpolate(from.scale, to.scale, amount),
          });
          return;
        }
      }

      const viewportAnchor = window.innerHeight * 0.5;
      let closest = sections[0];
      let closestDistance = Number.POSITIVE_INFINITY;

      sections.forEach((entry) => {
        const rect = entry.element.getBoundingClientRect();
        const stack = entry.element.parentElement;
        const sectionAnchor = stack?.classList.contains(styles.journeyStack)
          ? stack.getBoundingClientRect().top + entry.element.offsetTop + (rect.height * 0.5)
          : rect.top + (rect.height * 0.5);
        const distance = Math.abs(sectionAnchor - viewportAnchor);
        if (distance < closestDistance) {
          closest = entry;
          closestDistance = distance;
        }
      });

      if (!closest || (!immediate && !force && closest.waypoint.id === activeId)) return;
      activeId = closest.waypoint.id;
      syncActiveJourneyKey(activeId);
      const { x, y, scale } = closest.waypoint;
      const targetX = (x / 100) * window.innerWidth;
      const targetY = (y / 100) * window.innerWidth;

      if (immediate || prefersReducedMotion) {
        gsap.set(scene, { x: targetX, y: targetY, scale });
        return;
      }

      gsap.to(scene, {
        x: targetX,
        y: targetY,
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
    const requestResizeUpdate = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => moveToActiveSection(false, true));
    };

    moveToActiveSection(true);
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestResizeUpdate);

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestResizeUpdate);
      if (frame) window.cancelAnimationFrame(frame);
      projectTapTimeline?.kill();
      gsap.killTweensOf(scene);
      if (projectCard) gsap.set(projectCard, { clearProps: 'transform' });
    };
  }, [prefersReducedMotion]);

  return (
    <>
      <div ref={sceneRef} className={styles.heroNuni}>
        <button
          className={styles.nuniChatTrigger}
          type="button"
          aria-label={isChatOpen ? '누니 챗봇 닫기' : '누니 챗봇 열기'}
          aria-expanded={isChatOpen}
          aria-controls="nuni-chat-panel"
          onClick={toggleNuniChat}
        >
          <div ref={ambientMotionRef} className={styles.heroNuniAmbientMotion}>
            <span ref={shadowRef} className={styles.heroNuniShadow} aria-hidden="true">
              <img src={nuniShadowSrc} alt="" draggable="false" />
            </span>
            <div ref={characterRef} className={styles.heroNuniCharacter}>
              <div ref={bodyLookRef} className={styles.heroNuniBodyLook}>
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
                <span ref={eyeDirectionRef} className={styles.heroNuniEyes} aria-hidden="true">
                  <span ref={eyesRef} className={styles.heroNuniBlink}>
                    <img src={nuniEyesSrc} alt="" draggable="false" />
                  </span>
                </span>
              </div>
            </div>
          </div>
        </button>
      </div>
      <NuniSpeechBubble
        anchorRef={sceneRef}
        message={speechMessage}
        isVisible={isSpeechVisible}
      />

      {isChatOpen && (
        <>
          <div
            className={styles.nuniChatBackdrop}
            onMouseDown={() => {
              setChatQuestionHistory([]);
              setIsChatOpen(false);
            }}
          />
          <section
            ref={chatDialogRef}
            className={styles.nuniChatDialog}
            id="nuni-chat-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="nuni-chat-title"
            data-lenis-prevent
          >
            <img className={styles.nuniChatShadow} src={nuniChatShadowSrc} alt="" aria-hidden="true" />
            <img className={styles.nuniChatSurface} src={nuniChatSurfaceSrc} alt="" aria-hidden="true" />

            <header className={styles.nuniChatHeader}>
              <div>
                <img src={nuniChatStatusDotSrc} alt="" aria-hidden="true" />
                <p id="nuni-chat-title">MOON SOOMIN — LIVE SESSION</p>
              </div>
              <button
                type="button"
                aria-label="챗봇 닫기"
                onClick={() => setIsChatOpen(false)}
              >
                <img src={nuniChatCloseSrc} alt="" aria-hidden="true" />
              </button>
            </header>

            <img
              className={`${styles.nuniChatDivider} ${styles.nuniChatHeaderDivider}`}
              src={nuniChatDividerSrc}
              alt=""
              aria-hidden="true"
            />

            <div ref={chatConversationRef} className={styles.nuniChatConversation} aria-live="polite">
              <div className={styles.nuniChatGreeting}>
                <p>
                  안녕하세요, 누니예요. 문수민에 대해 궁금한 걸 골라주세요.
                  <br />
                  제가 아는 만큼 답해드릴게요.
                </p>
              </div>

              {chatQuestionHistory.map((question, index) => (
                <div className={styles.nuniChatExchange} key={`${question}-${index}`}>
                  <p className={styles.nuniChatSelectedQuestion}>{question}</p>
                  <div className={styles.nuniChatAnswer}>
                    <p>{nuniChatAnswers[question]}</p>

                    {question === '이력서 볼 수 있나요?' && (
                      <div className={styles.nuniChatAnswerActions}>
                        <button type="button" disabled title="이력서 PDF 파일 연결 예정">
                          Resume PDF 다운로드 &amp; 열기
                        </button>
                      </div>
                    )}

                    {question === '연락하고 싶어요.' && (
                      <div className={styles.nuniChatAnswerActions}>
                        <a href="mailto:ssachra@gmail.com">✉️ Email</a>
                        <button type="button" disabled title="이력서 PDF 파일 연결 예정">
                          📄 Resume
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <img
              className={`${styles.nuniChatDivider} ${styles.nuniChatQuestionDivider}`}
              src={nuniChatDividerSrc}
              alt=""
              aria-hidden="true"
            />

            <div className={styles.nuniChatQuestions}>
              {nuniChatQuestions.map((question) => (
                <button
                  key={question}
                  className={latestChatQuestion === question ? styles.nuniChatQuestionActive : undefined}
                  type="button"
                  aria-pressed={latestChatQuestion === question}
                  onClick={() => selectChatQuestion(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          </section>
        </>
      )}
    </>
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
        const stack = entry.element.parentElement;
        const sectionAnchor = stack?.classList.contains(styles.journeyStack)
          ? stack.getBoundingClientRect().top + entry.element.offsetTop + (rect.height * 0.5)
          : rect.top + (rect.height * 0.5);
        const distance = Math.abs(sectionAnchor - viewportAnchor);
        if (distance < closestDistance) {
          closest = entry;
          closestDistance = distance;
        }
      });

      if (closest) setActive((current) => (current === closest.label ? current : closest.label));

      const navigationRect = navigation.getBoundingClientRect();
      const sectionRects = groupedSections.map(({ element }) => ({
        element,
        rect: element.getBoundingClientRect(),
      }));
      const boundaries = [navigationRect.top, navigationRect.bottom];
      sectionRects.forEach(({ rect }) => {
        if (rect.top > navigationRect.top && rect.top < navigationRect.bottom) boundaries.push(rect.top);
        if (rect.bottom > navigationRect.top && rect.bottom < navigationRect.bottom) boundaries.push(rect.bottom);
      });
      boundaries.sort((a, b) => a - b);

      const darkIntervals = boundaries.slice(0, -1).flatMap((top, index) => {
        const bottom = boundaries[index + 1];
        const midpoint = top + ((bottom - top) * 0.5);
        const topmostSection = sectionRects
          .filter(({ rect }) => rect.top <= midpoint && rect.bottom >= midpoint)
          .at(-1)?.element;
        return topmostSection && darkSections.includes(topmostSection) ? [{ top, bottom }] : [];
      });
      const intersection = darkIntervals.length
        ? { top: darkIntervals[0].top, bottom: darkIntervals.at(-1)?.bottom ?? darkIntervals[0].bottom }
        : undefined;

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
          <span
            className={styles.tickerStar}
            style={{ '--guide-star-mask': `url("${aboutStarSrc}")` } as CSSProperties}
            aria-hidden="true"
          />
        </div>
      ))}
    </div>
  );
}

function AboutTicker() {
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    if (prefersReducedMotion) {
      gsap.set(track, { xPercent: 0 });
      return undefined;
    }

    const ticker = gsap.to(track, {
      xPercent: -50,
      duration: 55,
      ease: 'none',
      repeat: -1,
    });
    let lastScrollY = window.scrollY;
    let scrollEndTimer = 0;

    const restoreDefaultSpeed = () => {
      scrollEndTimer = 0;
      ticker.timeScale(1);
    };

    const applyBoostedSpeed = (boostedSpeed: number) => {
      ticker.timeScale(boostedSpeed);
      if (scrollEndTimer) window.clearTimeout(scrollEndTimer);
      scrollEndTimer = window.setTimeout(restoreDefaultSpeed, 80);
    };

    const handleScroll = () => {
      const distance = Math.abs(window.scrollY - lastScrollY);
      lastScrollY = window.scrollY;
      if (distance < 0.5) return;
      applyBoostedSpeed(8);
    };

    const handleWheel = () => {
      applyBoostedSpeed(8);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
      if (scrollEndTimer) window.clearTimeout(scrollEndTimer);
      ticker.kill();
      gsap.set(track, { clearProps: 'transform' });
    };
  }, [prefersReducedMotion]);

  return (
    <div className={styles.skillsTicker} aria-label={`사용 도구: ${tickerLabels.join(', ')}`}>
      <div ref={trackRef} className="about-ticker-track">
        <TickerSequence />
        <TickerSequence hidden />
      </div>
    </div>
  );
}

function AboutSection() {
  return (
    <section id="about" className={styles.aboutSection} aria-labelledby="about-title">
      <div className={styles.aboutCanvas}>
        <img className={styles.aboutGround} src={aboutGroundSrc} alt="" aria-hidden="true" />
        <div className={styles.aboutGrid} aria-hidden="true" />

        <AboutTicker />

        <div className={styles.aboutLabel}>
          <span aria-hidden="true" />
          <p>ABOUT</p>
        </div>

        <h2
          className={styles.aboutTitle}
          id="about-title"
          aria-label="I don’t just design, prototype, and build."
        >
          <span className={styles.aboutTitleLead} aria-hidden="true">I don’t just</span>
          <span className={styles.aboutTitleWords} aria-hidden="true">
            <span>design.</span>
            <span>prototype.</span>
            <span>build.</span>
          </span>
        </h2>
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
        <div className={styles.journeyGrid} data-texture-section="journey" aria-hidden="true" />

        <p
          className={`${styles.journeyGhostNumber} ${styles.journeyGhostNumberWhite}`}
          aria-hidden="true"
        >
          01
        </p>

        <div className="journey-layout">
        <div className={`${styles.journeyChapter} journey-content`}>
          <p className={`${styles.journeyEyebrow} journey-caption`}>01 BEGINNING</p>
          <p className={`${styles.journeyCategory} journey-category`}>( COFFEE )</p>

          <h2 className={`${styles.journeyHeadline} journey-title`} id="journey-title">
            The first
            <br />
            step.
          </h2>

          <div className={styles.journeyDetails}>
            <p className={`${styles.journeyBody} journey-body`}>
              커피를 배우고 싶다는
              <br />
              작은 호기심이 모든 시작이었습니다.
            </p>

            <ul className={styles.journeyBeats}>
              <li>→ Barista studies</li>
              <li>→ Brewing &amp; sensory training</li>
              <li>→ Customer experience</li>
              <li>→ My first serious passion</li>
            </ul>

            <p className={`${styles.journeyDuration} ${styles.journeyDurationInverse}`}>
              Studied coffee for 2 years
            </p>
          </div>
        </div>

        <figure className={`${styles.journeyPhotoFrame} journey-photo-frame`}>
          <img className={`${styles.journeyPhoto} journey-photo`} src={journeyPhotoSrc} alt="드립 커피 추출 장면" />
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
          <figcaption className={`${styles.journeyCaptionInverse} journey-photo-caption`}>Hand drip</figcaption>
        </figure>
        </div>
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
        <div className={`${styles.journeyGround} ${styles.guidePrimaryGround}`} aria-hidden="true" />
        <div className={styles.journeyGrid} data-texture-section="discovery" aria-hidden="true" />

        <p className={styles.journeyGhostNumber} aria-hidden="true">02</p>

        <div className="journey-layout">
        <div className={`${styles.journeyChapter} ${styles.journeyChapterLight} journey-content`}>
          <p className={`${styles.journeyEyebrow} journey-caption`}>02 DISCOVERY</p>
          <p className={`${styles.journeyCategory} journey-category`}>( JAPAN )</p>

          <h2 className={`${styles.journeyHeadline} journey-title`} id="journey-discovery-title">
            Beyond
            <br />
            borders.
          </h2>

          <div className={styles.journeyDetails}>
            <p className={`${styles.journeyBody} journey-body`}>
              일본에서의 다양한 경험은
              <br />
              사람을 이해하는 시야를 넓혀주었습니다.
            </p>

            <ul className={styles.journeyBeats}>
              <li>→ Studied abroad</li>
              <li>→ Beauty retail</li>
              <li>→ E-commerce MD</li>
              <li>→ Cross-cultural experience</li>
            </ul>

            <p className={styles.journeyDuration}>Lived in Japan for 6 years</p>
          </div>
        </div>

        <figure className={`${styles.journeyPhotoFrame} journey-photo-frame`}>
          <img
            className={`${styles.journeyPhoto} journey-photo`}
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
          <figcaption className="journey-photo-caption">Yozakura</figcaption>
        </figure>
        </div>
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
        <div className={styles.journeyGrid} data-texture-section="observation" aria-hidden="true" />

        <p className={styles.journeyGhostNumber} aria-hidden="true">03</p>

        <div className="journey-layout">
        <div className={`${styles.journeyChapter} ${styles.journeyChapterLight} journey-content`}>
          <p className={`${styles.journeyEyebrow} journey-caption`}>03 OBSERVATION</p>
          <p className={`${styles.journeyCategory} journey-category`}>( Photography )</p>

          <h2 className={`${styles.journeyHeadline} journey-title`} id="journey-observation-title">
            Every moment
            <br />
            matters.
          </h2>

          <div className={styles.journeyDetails}>
            <p className={`${styles.journeyBody} journey-body`}>
              순간을 기록하며
              <br />
              관찰하는 습관을 배웠습니다.
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
        </div>

        <figure className={`${styles.journeyPhotoFrame} journey-photo-frame`}>
          <img
            className={`${styles.journeyPhoto} journey-photo`}
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
          <figcaption className="journey-photo-caption">Portrait</figcaption>
        </figure>
        </div>
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
        <div className={styles.journeyGrid} data-texture-section="movement" aria-hidden="true" />

        <p
          className={`${styles.journeyGhostNumber} ${styles.journeyGhostNumberWhite}`}
          aria-hidden="true"
        >
          04
        </p>

        <div className="journey-layout">
        <div className={`${styles.journeyChapter} journey-content`}>
          <p className={`${styles.journeyEyebrow} journey-caption`}>04 MOVEMENT</p>
          <p className={`${styles.journeyCategory} journey-category`}>( MOTION )</p>

          <h2 className={`${styles.journeyHeadline} journey-title`} id="journey-movement-title">
            Stories
            <br />
            in motion.
          </h2>

          <div className={styles.journeyDetails}>
            <p className={`${styles.journeyBody} journey-body`}>
              새로운 환경은
              <br />
              더 넓은 관점을 갖게 했습니다.
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
        </div>

        <figure className={`${styles.journeyPhotoFrame} journey-photo-frame`}>
          <img
            className={`${styles.journeyPhoto} journey-photo`}
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
          <figcaption className={`${styles.journeyCaptionInverse} journey-photo-caption`}>Interview Video</figcaption>
        </figure>
        </div>
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
        <div className={styles.journeyGrid} data-texture-section="expansion" aria-hidden="true" />

        <p className={styles.journeyGhostNumber} aria-hidden="true">05</p>

        <div className="journey-layout">
        <div className={`${styles.journeyChapter} ${styles.journeyChapterLight} journey-content`}>
          <p className={`${styles.journeyEyebrow} journey-caption`}>05 EXPANSION</p>
          <p className={`${styles.journeyCategory} journey-category`}>( INDONESIA )</p>

          <h2 className={`${styles.journeyHeadline} journey-title`} id="journey-expansion-title">
            Changed
            <br />
            by the world.
          </h2>

          <div className={styles.journeyDetails}>
            <p className={`${styles.journeyBody} journey-body`}>
              새로운 환경은
              <br />
              더 넓은 관점을 갖게 했습니다.
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
        </div>

        <figure className={`${styles.journeyPhotoFrame} journey-photo-frame`}>
          <img
            className={`${styles.journeyPhoto} journey-photo`}
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
          <figcaption className="journey-photo-caption">Pulau Macan</figcaption>
        </figure>
        </div>
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
        <div className={`${styles.journeyGround} ${styles.guidePrimaryGround}`} aria-hidden="true" />
        <div className={styles.journeyGrid} data-texture-section="reality" aria-hidden="true" />

        <p className={styles.journeyGhostNumber} aria-hidden="true">06</p>

        <div className="journey-layout">
        <div className={`${styles.journeyChapter} ${styles.journeyChapterLight} journey-content`}>
          <p className={`${styles.journeyEyebrow} journey-caption`}>06 CONNECTION</p>
          <p className={`${styles.journeyCategory} journey-category`}>( UI/UX )</p>

          <h2 className={`${styles.journeyHeadline} journey-title`} id="journey-reality-title">
            Ideas
            <br />
            into reality.
          </h2>

          <div className={styles.journeyDetails}>
            <p className={`${styles.journeyBody} journey-body`}>
              다양한 경험은
              <br />
              사용자 경험을 설계하는 기반이 되었습니다.
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
        </div>

        <figure className={`${styles.journeyPhotoFrame} journey-photo-frame`}>
          <img
            className={`${styles.journeyPhoto} journey-photo`}
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
          <figcaption className="journey-photo-caption">Team Palette</figcaption>
        </figure>
        </div>
      </div>
    </section>
  );
}

type ProjectCardName = 'route' | 'marshall' | 'viner';
type ProjectCardSlotName = 'front' | 'left' | 'right';

const projectCardLabels: Record<ProjectCardName, string> = {
  route: 'ROUTE',
  marshall: 'Marshall',
  viner: 'Viner',
};

const projectCaptionLabels: Record<ProjectCardName, string> = {
  route: 'Route',
  marshall: 'Marshall',
  viner: 'Viner',
};

const projectShortDescriptions: Record<ProjectCardName, readonly [string, string]> = {
  route: ['취업 준비 과정을 관리하는', '커리어 플랫폼'],
  marshall: ['브랜드를 경험하는', '인터랙티브 웹사이트'],
  viner: ['AI 기반 와인 커뮤니티', '모바일 서비스'],
};

const projectRoles: Record<ProjectCardName, string> = {
  route: '( Solo Project )',
  marshall: '( Team Leader )',
  viner: '( Team Leader )',
};

const projectContributions: Record<ProjectCardName, readonly string[]> = {
  route: ['Research', 'UX/UI', 'Front-end Development'],
  marshall: ['Project Planning', 'UX/UI', 'Front-end Development'],
  viner: ['Planning', 'UX/UI', 'React Development'],
};

const projectResponsibilities: Record<ProjectCardName, readonly string[]> = {
  route: [
    '사용자 리서치 및 인터뷰',
    'IA · User Flow 설계',
    'UX/UI 디자인 시스템 구축',
    'React 기반 서비스 개발',
    '휴리스틱 평가 및 UX 개선',
  ],
  marshall: [
    '프로젝트 기획 및 일정 관리',
    'IA 및 콘텐츠 구조 설계',
    '메인 인터랙션 기획',
    'UI 디자인 및 퍼블리싱',
    'Front-end 개발',
  ],
  viner: [
    '프로젝트 기획 및 일정 관리',
    'React 초기 세팅 및 개발 환경 구축',
    'UX/UI 디자인 및 주요 화면 개발',
    'AI 기능 UX 기획 및 더미데이터 구성',
    '오류 수정 및 프로젝트 최종 통합',
  ],
};

const getProjectRevealStyle = (lineIndex: number) => (
  { '--project-line-index': lineIndex } as CSSProperties
);

const getProjectExitStyle = (lineIndex: number) => (
  { '--project-exit-index': lineIndex } as CSSProperties
);

const projectCardUrls: Record<ProjectCardName, string> = {
  route: 'https://route-react-three.vercel.app/',
  marshall: 'https://marshall-rebrand.vercel.app/',
  viner: 'https://wine-app-eight-wine.vercel.app/',
};

const initialProjectCardSlots: Record<ProjectCardName, ProjectCardSlotName> = {
  route: 'front',
  marshall: 'right',
  viner: 'left',
};

const projectCardSlotClasses: Record<ProjectCardSlotName, string> = {
  front: styles.projectsCard01,
  right: styles.projectsCard02,
  left: styles.projectsCard03,
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

function ProjectCardFront({
  project,
  isFlipped,
  onFlip,
}: {
  project: ProjectCardName;
  isFlipped: boolean;
  onFlip: () => void;
}) {
  return (
    <div
      className={`${styles.projectCardFace} ${styles.projectCardFrontFace}`}
      aria-hidden={isFlipped}
    >
      <img className={styles.projectCardShadow} src={cardFrontShadowSrc} alt="" aria-hidden="true" />
      <img className={styles.projectCardShell} src={cardFrontShellSrc} alt="" aria-hidden="true" />
      <ProjectCardCover project={project} />
      <p className={styles.projectCardLabel}>Project Name</p>
      <p className={`${styles.projectCardTitle} ${styles[`projectCardTitle${project}`]}`}>
        {projectCardLabels[project]}
      </p>
      <button
        className={styles.projectCardFlipLabel}
        type="button"
        tabIndex={isFlipped ? -1 : 0}
        onClick={(event) => {
          event.stopPropagation();
          onFlip();
        }}
      >
        FLIP →
      </button>
    </div>
  );
}

function ProjectCardBack({
  project,
  isFlipped,
  onOpenPage,
}: {
  project: ProjectCardName;
  isFlipped: boolean;
  onOpenPage: () => void;
}) {
  const isRoute = project === 'route';

  return (
    <div
      className={`${styles.projectCardFace} ${styles.projectCardBackFace} ${isRoute ? styles.projectCardBackRoute : ''}`}
      aria-hidden={!isFlipped}
    >
      <div className={`${styles.projectBackLayout} project-back-layout`}>
        <div className={`${styles.projectBackBrandBox} project-back-brand-box`}>
          {project === 'route' && (
            <div className={styles.routeBackBrand}>
              <span><img src={routeBackLogoSrc} alt="" /></span>
              <p>Route</p>
            </div>
          )}
          {project === 'marshall' && <p className={styles.marshallBackBrand}>Marshall</p>}
          {project === 'viner' && <img className={styles.vinerBackBrand} src={vinerBackLogoSrc} alt="" />}
        </div>

        <div className={`${styles.projectBackProblemBox} project-back-problem-box`}>
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
        </div>

        <div className={`${styles.projectBackApproachBox} project-back-approach-box`}>
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
        </div>

        <div className={`${styles.projectBackOpenBox} project-back-open-box`}>
          <a
            className={styles.projectBackOpen}
            href={projectCardUrls[project]}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => {
              event.stopPropagation();
              onOpenPage();
            }}
          >
            OPEN PAGE
          </a>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  className,
  isFront,
  isFlipped,
  onSelect,
  onFlip,
  onOpenPage,
}: {
  project: ProjectCardName;
  className: string;
  isFront: boolean;
  isFlipped: boolean;
  onSelect: () => void;
  onFlip: () => void;
  onOpenPage: () => void;
}) {
  const activateCard = () => {
    if (!isFront) {
      onSelect();
      return;
    }
    if (isFlipped) {
      onFlip();
      return;
    }
    onSelect();
  };

  return (
    <article
      className={`${styles.projectCardSlot} ${className} ${isFlipped ? styles.projectCardFlipped : ''}`}
      aria-label={`${projectCardLabels[project]} 프로젝트 카드`}
      aria-pressed={isFront}
      role="button"
      tabIndex={0}
      onClick={(event) => {
        event.stopPropagation();
        activateCard();
      }}
      onKeyDown={(event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        event.stopPropagation();
        activateCard();
      }}
    >
      <div className={styles.projectCardStage}>
        <ProjectCardFront project={project} isFlipped={isFlipped} onFlip={onFlip} />
        <ProjectCardBack project={project} isFlipped={isFlipped} onOpenPage={onOpenPage} />
      </div>
    </article>
  );
}

function ProjectsIntroSection() {
  const [isDeckExpanded, setIsDeckExpanded] = useState(false);
  const [cardSlots, setCardSlots] = useState(initialProjectCardSlots);
  const [flippedProject, setFlippedProject] = useState<ProjectCardName | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectCardName | null>(null);
  const [previousProject, setPreviousProject] = useState<ProjectCardName | null>(null);
  const [isReturningToIntro, setIsReturningToIntro] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const bringProjectForward = (project: ProjectCardName) => {
    publishProjectInteraction({ hasClickedProject: true });
    if (project === selectedProject) return;
    setIsReturningToIntro(false);
    setPreviousProject(prefersReducedMotion ? null : selectedProject);
    setSelectedProject(project);
    setCardSlots((currentSlots) => {
      if (currentSlots[project] === 'front') return currentSlots;
      const currentFront = (Object.keys(currentSlots) as ProjectCardName[])
        .find((card) => currentSlots[card] === 'front');
      if (!currentFront) return currentSlots;
      return {
        ...currentSlots,
        [project]: 'front',
        [currentFront]: currentSlots[project],
      };
    });
    setFlippedProject(null);
  };

  const resetProjectCopy = () => {
    if (!selectedProject) return;
    if (prefersReducedMotion) {
      setPreviousProject(null);
      setIsReturningToIntro(true);
    } else {
      setPreviousProject(selectedProject);
      setIsReturningToIntro(false);
    }
    setSelectedProject(null);
  };

  const finishPreviousProjectExit = () => {
    setPreviousProject(null);
    if (!selectedProject) setIsReturningToIntro(true);
  };

  useEffect(() => {
    const openDeck = () => setIsDeckExpanded(true);
    const closeDeck = () => {
      setIsDeckExpanded(false);
      setCardSlots(initialProjectCardSlots);
      setFlippedProject(null);
      setSelectedProject(null);
      setPreviousProject(null);
      setIsReturningToIntro(false);
    };
    window.addEventListener(projectDeckOpenEvent, openDeck);
    window.addEventListener(projectDeckCloseEvent, closeDeck);
    return () => {
      window.removeEventListener(projectDeckOpenEvent, openDeck);
      window.removeEventListener(projectDeckCloseEvent, closeDeck);
    };
  }, []);

  return (
    <section
      id="projects"
      className={styles.projectsIntroSection}
      aria-labelledby="projects-intro-title"
    >
      <div
        className={styles.projectsIntroCanvas}
        onClick={(event) => {
          if (event.target === event.currentTarget) resetProjectCopy();
        }}
      >
        <img className={styles.projectsIntroGround} src={projectsGroundSrc} alt="" aria-hidden="true" />
        <div className={styles.projectsIntroGrid} aria-hidden="true" />

        <div className={styles.projectsIntroChapter}>
          <p className={styles.projectsIntroEyebrow}>Portfolio</p>
          <p
            className={styles.projectsIntroCategory}
            aria-label={selectedProject ? projectCaptionLabels[selectedProject] : undefined}
            aria-live="polite"
          >
            {previousProject && (
              <span
                className={styles.projectBodyLineOutgoing}
                style={getProjectExitStyle(0)}
                aria-hidden="true"
              >
                {projectCaptionLabels[previousProject]}
              </span>
            )}
            {selectedProject && (
              <span
                key={selectedProject}
                className={styles.projectRevealLine}
                style={getProjectRevealStyle(0)}
                aria-hidden="true"
              >
                {projectCaptionLabels[selectedProject]}
              </span>
            )}
          </p>
          <div className={styles.projectsIntroHeadlineSlot} aria-live="polite">
            <h2 className={styles.projectsIntroHeadline} id="projects-intro-title">
              <span
                className={`${styles.projectsIntroHeadlineLine} ${
                  selectedProject
                    ? styles.projectsHeadlineOutgoing
                    : isReturningToIntro
                      ? styles.projectRevealLine
                      : previousProject
                        ? styles.projectIntroLineHidden
                        : ''
                }`}
                style={{ '--project-headline-index': 0, '--project-line-index': 0 } as CSSProperties}
              >
                Selected
              </span>
              <span
                className={`${styles.projectsIntroHeadlineLine} ${
                  selectedProject
                    ? styles.projectsHeadlineOutgoing
                    : isReturningToIntro
                      ? styles.projectRevealLine
                      : previousProject
                        ? styles.projectIntroLineHidden
                        : ''
                }`}
                style={{ '--project-headline-index': 1, '--project-line-index': 1 } as CSSProperties}
              >
                Projects
              </span>
            </h2>
            {previousProject && (
              <div className={styles.projectsSummaryContent}>
                <div className={styles.projectsShortDescription}>
                  {projectShortDescriptions[previousProject].map((line, lineIndex) => (
                    <p
                      key={line}
                      className={styles.projectBodyLineOutgoing}
                      style={getProjectExitStyle(lineIndex + 1)}
                    >
                      {line}
                    </p>
                  ))}
                </div>
                <div className={styles.projectsSummaryMeta}>
                  <p
                    className={`${styles.projectsSummaryRole} ${styles.projectBodyLineOutgoing}`}
                    style={getProjectExitStyle(3)}
                  >
                    {projectRoles[previousProject]}
                  </p>
                  <div className={styles.projectsSummaryContributions}>
                    {projectContributions[previousProject].map((contribution, lineIndex) => (
                      <p
                        key={contribution}
                        className={styles.projectBodyLineOutgoing}
                        style={getProjectExitStyle(lineIndex + 4)}
                      >
                        {contribution}
                      </p>
                    ))}
                  </div>
                  <div className={styles.projectsResponsibilities}>
                    {projectResponsibilities[previousProject].map((responsibility, lineIndex) => (
                      <p
                        key={responsibility}
                        className={styles.projectBodyLineOutgoing}
                        style={getProjectExitStyle(lineIndex + 7)}
                        onAnimationEnd={
                          lineIndex === projectResponsibilities[previousProject].length - 1
                            ? finishPreviousProjectExit
                            : undefined
                        }
                      >
                        • {responsibility}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {selectedProject && (
              <div
                key={selectedProject}
                className={styles.projectsSummaryContent}
              >
                <div className={styles.projectsShortDescription}>
                  {projectShortDescriptions[selectedProject].map((line, lineIndex) => (
                    <p
                      key={line}
                      className={styles.projectRevealLine}
                      style={getProjectRevealStyle(lineIndex + 1)}
                    >
                      {line}
                    </p>
                  ))}
                </div>
                <div className={styles.projectsSummaryMeta}>
                  <p
                    className={`${styles.projectsSummaryRole} ${styles.projectRevealLine}`}
                    style={getProjectRevealStyle(3)}
                  >
                    {projectRoles[selectedProject]}
                  </p>
                  <div className={styles.projectsSummaryContributions}>
                    {projectContributions[selectedProject].map((contribution, lineIndex) => (
                      <p
                        key={contribution}
                        className={styles.projectRevealLine}
                        style={getProjectRevealStyle(lineIndex + 4)}
                      >
                        {contribution}
                      </p>
                    ))}
                  </div>
                  <div className={styles.projectsResponsibilities}>
                    {projectResponsibilities[selectedProject].map((responsibility, lineIndex) => (
                      <p
                        key={responsibility}
                        className={styles.projectRevealLine}
                        style={getProjectRevealStyle(lineIndex + 7)}
                      >
                        • {responsibility}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className={styles.projectsIntroBodySlot} aria-live="polite">
            <div className={styles.projectsIntroBody}>
              {[
                '기획부터 디자인, 구현까지.',
                '문제를 해결하기 위해 고민했던',
                '프로젝트를 담았습니다.',
              ].map((line, lineIndex) => (
                <p
                  key={line}
                  className={
                    selectedProject
                      ? styles.projectBodyLineOutgoing
                      : isReturningToIntro
                        ? styles.projectRevealLine
                        : previousProject
                          ? styles.projectIntroLineHidden
                          : undefined
                  }
                  style={
                    selectedProject
                      ? getProjectExitStyle(lineIndex)
                      : getProjectRevealStyle(lineIndex + 2)
                  }
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
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
          {(['viner', 'marshall', 'route'] as const).map((project) => (
            <ProjectCard
              key={project}
              project={project}
              className={projectCardSlotClasses[cardSlots[project]]}
              isFront={cardSlots[project] === 'front'}
              isFlipped={flippedProject === project}
              onSelect={() => bringProjectForward(project)}
              onFlip={() => {
                publishProjectInteraction({ hasClickedProject: true, hasUsedFlip: true });
                setFlippedProject((current) => (current === project ? null : project));
              }}
              onOpenPage={() => publishProjectInteraction({
                hasClickedProject: true,
                hasUsedFlip: true,
                hasOpenedPage: true,
              })}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const playBoxRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<Array<HTMLLIElement | null>>([]);
  const prefersReducedMotion = useReducedMotion();
  const [physicsCycle, setPhysicsCycle] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const playBox = playBoxRef.current;
    const chips = chipRefs.current.filter((chip): chip is HTMLLIElement => Boolean(chip));
    if (!section || !playBox || chips.length === 0) return undefined;

    chips.forEach((chip) => {
      chip.style.opacity = '0';
      chip.style.removeProperty('transform');
      chip.classList.remove(styles.skillsChipDragging);
    });

    let physicsStarted = false;
    let resetRequested = false;
    let animationFrame = 0;
    let positionCheckFrame = 0;
    let resizeObserver: ResizeObserver | null = null;
    let engine: Engine | null = null;
    let physicsMouse: Mouse | null = null;
    let nuniCatchTimeline: gsap.core.Timeline | null = null;
    let nuniCatchCooldownUntil = 0;
    let skillPointerGeneration = 0;
    let skillPointerIsDown = false;
    const chipDropTimers: number[] = [];
    const chipCarryOverlays = new Set<HTMLLIElement>();

    const handleSkillPointerDown = () => {
      skillPointerGeneration += 1;
      skillPointerIsDown = true;
    };
    const handleSkillPointerRelease = () => {
      skillPointerIsDown = false;
      if (physicsMouse) physicsMouse.button = -1;
    };

    playBox.addEventListener('pointerdown', handleSkillPointerDown);
    window.addEventListener('pointerup', handleSkillPointerRelease);
    window.addEventListener('pointercancel', handleSkillPointerRelease);

    const startChipPhysics = () => {
      if (physicsStarted) return;
      physicsStarted = true;

      engine = Engine.create({ enableSleeping: false });
      engine.gravity.y = 1.05;
      engine.gravity.scale = 0.001;

      type ChipBody = {
        label: SkillSpeechLabel;
        element: HTMLLIElement;
        body: Body;
        width: number;
        height: number;
        active: boolean;
        carried: boolean;
        catchEligibleUntil: number;
        catchBlockedUntilNextDrag: boolean;
        blockedAtPointerGeneration: number;
        carryOverlay: HTMLLIElement | null;
        carryFollowsNuni: boolean;
      };

      const chipBodies: ChipBody[] = [];
      let walls: Body[] = [];

      const makeWalls = () => {
        if (!engine) return;
        walls.forEach((wall) => Composite.remove(engine!.world, wall));
        const width = playBox.clientWidth;
        const height = playBox.clientHeight;
        const sectionRect = section.getBoundingClientRect();
        const playBoxRect = playBox.getBoundingClientRect();
        const upperLimit = -Math.max(0, playBoxRect.top - sectionRect.top);
        const verticalRange = height - upperLimit;
        const verticalCenter = upperLimit + verticalRange / 2;
        const thickness = 100;
        const wallOptions: IBodyDefinition = {
          isStatic: true,
          restitution: 0.24,
          friction: 0.46,
          label: 'skills-play-box-boundary',
        };
        walls = [
          Bodies.rectangle(
            -thickness / 2,
            verticalCenter,
            thickness,
            verticalRange + thickness * 2,
            wallOptions,
          ),
          Bodies.rectangle(
            width + thickness / 2,
            verticalCenter,
            thickness,
            verticalRange + thickness * 2,
            wallOptions,
          ),
          Bodies.rectangle(
            width / 2,
            upperLimit - thickness / 2,
            width + thickness * 2,
            thickness,
            wallOptions,
          ),
          Bodies.rectangle(width / 2, height + thickness / 2, width + thickness * 2, thickness, wallOptions),
        ];
        Composite.add(engine.world, walls);
      };

      makeWalls();
      const boxWidth = playBox.clientWidth;
      const sidePadding = Math.max(12, boxWidth * 0.018);
      const dropOrder = chips.map((_, index) => index);
      for (let index = dropOrder.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [dropOrder[index], dropOrder[randomIndex]] = [dropOrder[randomIndex], dropOrder[index]];
      }
      const laneCount = Math.min(7, chips.length);
      const laneWidth = (boxWidth - sidePadding * 2) / laneCount;
      let accumulatedDelay = 0;

      dropOrder.forEach((chipIndex, sequenceIndex) => {
        const element = chips[chipIndex];
        const width = element.offsetWidth;
        const height = element.offsetHeight;
        const laneIndex = sequenceIndex % laneCount;
        const laneCenter = sidePadding + laneWidth * (laneIndex + 0.5);
        const laneJitter = (Math.random() - 0.5) * laneWidth * 0.48;
        const spawnX = Math.max(
          width / 2 + 3,
          Math.min(boxWidth - width / 2 - 3, laneCenter + laneJitter),
        );
        const spawnY = -(height / 2) - 8 - Math.random() * Math.max(24, playBox.clientHeight * 0.08);

        const body = Bodies.rectangle(
          spawnX,
          spawnY,
          width + 2,
          height + 2,
          {
            label: `skill-chip-${chipIndex}`,
            restitution: 0.24,
            friction: 0.4,
            frictionStatic: 0.6,
            frictionAir: 0.009,
            density: 0.0016,
            sleepThreshold: 80,
            chamfer: { radius: Math.max(8, height * 0.48) },
          },
        );
        Body.setAngle(body, skillChips[chipIndex].rotation * Math.PI / 180);
        const chipBody: ChipBody = {
          label: skillChips[chipIndex].label,
          element,
          body,
          width,
          height,
          active: false,
          carried: false,
          catchEligibleUntil: 0,
          catchBlockedUntilNextDrag: false,
          blockedAtPointerGeneration: -1,
          carryOverlay: null,
          carryFollowsNuni: false,
        };
        chipBodies.push(chipBody);
        element.style.transform = `translate3d(${spawnX - width / 2}px, ${spawnY - height / 2}px, 0) rotate(${body.angle}rad)`;

        if (sequenceIndex > 0) {
          accumulatedDelay += prefersReducedMotion ? 0 : 65 + Math.random() * 75;
        }
        const timer = window.setTimeout(() => {
          if (!engine) return;
          chipBody.active = true;
          Composite.add(engine.world, body);
          Body.setVelocity(body, {
            x: (Math.random() - 0.5) * 1.4,
            y: 0.4 + Math.random() * 0.8,
          });
          Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.045);
          element.style.opacity = '1';
        }, accumulatedDelay);
        chipDropTimers.push(timer);
      });

      physicsMouse = Mouse.create(playBox);
      physicsMouse.pixelRatio = 1;
      playBox.removeEventListener('wheel', physicsMouse.mousewheel);
      playBox.removeEventListener('mousewheel', physicsMouse.mousewheel);
      playBox.removeEventListener('DOMMouseScroll', physicsMouse.mousewheel);

      const mouseConstraint = MouseConstraint.create(engine, {
        mouse: physicsMouse,
        constraint: {
          stiffness: 0.15,
          damping: 0.22,
          angularStiffness: 0,
          render: { visible: false },
        },
      });
      Composite.add(engine.world, mouseConstraint);
      Events.on(mouseConstraint, 'startdrag', (event) => {
        const activeChip = chipBodies.find(({ body }) => body === event.body);
        if (activeChip) {
          const isNewUserDrag = skillPointerIsDown
            && skillPointerGeneration > activeChip.blockedAtPointerGeneration;
          if (activeChip.catchBlockedUntilNextDrag && !isNewUserDrag) {
            physicsMouse!.button = -1;
            return;
          }
          if (isNewUserDrag) activeChip.catchBlockedUntilNextDrag = false;
          activeChip.catchEligibleUntil = 0;
          activeChip.element.classList.add(styles.skillsChipDragging);
        }
      });
      Events.on(mouseConstraint, 'enddrag', (event) => {
        const activeChip = chipBodies.find(({ body }) => body === event.body);
        if (activeChip) {
          window.dispatchEvent(new CustomEvent(skillInteractionChangeEvent, {
            detail: { hasThrownSkill: true },
          }));
          activeChip.catchEligibleUntil = activeChip.catchBlockedUntilNextDrag
            ? 0
            : performance.now() + 2200;
          activeChip.element.classList.remove(styles.skillsChipDragging);
        }
      });

      let carriedChip: ChipBody | null = null;
      let catchAttempt: {
        chipBody: ChipBody;
        nuni: HTMLElement;
        nuniMotion: HTMLElement;
        nuniEyes: HTMLElement;
        startX: number;
        startY: number;
        startScale: number;
        startedAt: number;
        canceling: boolean;
        released: boolean;
      } | null = null;

      const finishNuniCatch = (attempt: NonNullable<typeof catchAttempt>) => {
        delete attempt.nuni.dataset.skillsRescue;
        nuniCatchCooldownUntil = performance.now() + 1000;
        gsap.set(attempt.nuniEyes, { clearProps: 'transform' });
        gsap.set(attempt.nuniMotion, {
          x: 0,
          y: 0,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
        });
        catchAttempt = null;
        carriedChip = null;
      };

      const releaseCarriedChip = (
        chipBody: ChipBody,
        attempt: NonNullable<typeof catchAttempt>,
      ) => {
        if (!engine || !chipBody.carryOverlay) return;
        const playBoxRect = playBox.getBoundingClientRect();
        const overlayRect = chipBody.carryOverlay.getBoundingClientRect();
        Body.setPosition(chipBody.body, {
          x: gsap.utils.clamp(
            chipBody.width / 2 + 3,
            playBox.clientWidth - chipBody.width / 2 - 3,
            overlayRect.left + overlayRect.width / 2 - playBoxRect.left,
          ),
          y: gsap.utils.clamp(
            chipBody.height / 2 + 3,
            playBox.clientHeight - chipBody.height / 2 - 3,
            overlayRect.top + overlayRect.height / 2 - playBoxRect.top,
          ),
        });
        Body.setAngle(chipBody.body, -2 * Math.PI / 180);
        Body.setVelocity(chipBody.body, { x: 0.35, y: 1.6 });
        Body.setAngularVelocity(chipBody.body, 0.018);
        attempt.released = true;
        chipBody.carried = false;
        chipBody.active = true;
        chipBody.catchEligibleUntil = 0;
        chipBody.catchBlockedUntilNextDrag = true;
        chipBody.blockedAtPointerGeneration = skillPointerGeneration;
        chipBody.carryFollowsNuni = false;
        Composite.add(engine.world, chipBody.body);
        chipBody.element.style.transform = `translate3d(${chipBody.body.position.x - chipBody.width / 2}px, ${chipBody.body.position.y - chipBody.height / 2}px, 0) rotate(${chipBody.body.angle}rad)`;
        chipBody.element.style.opacity = '1';
        chipBody.carryOverlay.remove();
        chipCarryOverlays.delete(chipBody.carryOverlay);
        chipBody.carryOverlay = null;

        const nuniRect = attempt.nuni.getBoundingClientRect();
        const dropCenterX = overlayRect.left + overlayRect.width / 2;
        const stepDirection = dropCenterX < playBoxRect.left + playBoxRect.width / 2 ? 1 : -1;
        const stepAsideX = gsap.utils.clamp(
          playBoxRect.left,
          playBoxRect.right - nuniRect.width,
          Number(gsap.getProperty(attempt.nuni, 'x'))
            + stepDirection * Math.max(48, window.innerWidth * 0.035),
        );

        nuniCatchTimeline = gsap.timeline({
          onComplete: () => finishNuniCatch(attempt),
        })
          .to(attempt.nuniMotion, {
            x: 0,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            y: 0,
            duration: 0.28,
            ease: 'back.out(2)',
          }, 0)
          .to(attempt.nuni, {
            x: stepAsideX,
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto',
          }, 0)
          .to(attempt.nuni, {
            x: attempt.startX,
            y: attempt.startY,
            scale: attempt.startScale,
            duration: 0.68,
            ease: 'power3.inOut',
            overwrite: 'auto',
          }, 0.72);
      };

      const dropChipFromNuni = (
        chipBody: ChipBody,
        attempt: NonNullable<typeof catchAttempt>,
      ) => {
        const overlay = chipBody.carryOverlay;
        if (!overlay) return;
        chipBody.carryFollowsNuni = false;
        const overlayRect = overlay.getBoundingClientRect();
        gsap.set(overlay, {
          x: overlayRect.left,
          y: overlayRect.top,
          rotation: -2,
        });
        gsap.to(overlay, {
          x: overlayRect.left + Math.max(10, chipBody.width * 0.12),
          y: overlayRect.top + Math.max(18, chipBody.height * 0.65),
          rotation: 10,
          duration: 0.28,
          ease: 'power1.in',
          overwrite: 'auto',
          onComplete: () => releaseCarriedChip(chipBody, attempt),
        });
      };

      const placeChipOnNuni = (attempt: NonNullable<typeof catchAttempt>) => {
        if (!engine) return;
        const { chipBody, nuni, nuniMotion } = attempt;
        const playBoxRect = playBox.getBoundingClientRect();
        const chipLeft = playBoxRect.left + chipBody.body.position.x - chipBody.width / 2;
        const chipTop = playBoxRect.top + chipBody.body.position.y - chipBody.height / 2;
        const nuniRect = nuni.getBoundingClientRect();
        const overlay = chipBody.element.cloneNode(true) as HTMLLIElement;

        Composite.remove(engine.world, chipBody.body);
        chipBody.active = false;
        chipBody.carried = true;
        chipBody.carryFollowsNuni = false;
        chipBody.carryOverlay = overlay;
        chipCarryOverlays.add(overlay);
        chipBody.element.style.opacity = '0';

        overlay.classList.remove(styles.skillsChipDragging);
        overlay.classList.add(styles.skillsChipCarryOverlay);
        Object.assign(overlay.style, {
          position: 'fixed',
          inset: 'auto',
          top: '0px',
          left: '0px',
          width: `${chipBody.width}px`,
          height: `${chipBody.height}px`,
          opacity: '1',
          transform: `translate3d(${chipLeft}px, ${chipTop}px, 0) rotate(${chipBody.body.angle}rad)`,
        });
        document.body.appendChild(overlay);

        const headX = nuniRect.left + nuniRect.width / 2 - chipBody.width / 2;
        const headY = nuniRect.top - chipBody.height + Math.max(2, nuniRect.height * 0.035);
        gsap.to(overlay, {
          x: headX,
          y: headY,
          rotation: -2,
          duration: 0.16,
          ease: 'power2.out',
          overwrite: 'auto',
          onComplete: () => {
            chipBody.carryFollowsNuni = true;
            window.dispatchEvent(new CustomEvent(skillCatchEvent, { detail: chipBody.label }));
          },
        });

        const lowerY = Math.max(
          attempt.startY,
          playBoxRect.bottom - nuniRect.height - Math.max(12, window.innerWidth * 0.01),
        );
        nuniCatchTimeline?.kill();
        nuniCatchTimeline = gsap.timeline()
          .to(nuniMotion, {
            scaleX: 1.08,
            scaleY: 0.92,
            y: 4,
            duration: 0.12,
            ease: 'power3.in',
            overwrite: 'auto',
          }, 0)
          .to(nuniMotion, {
            scaleX: 1,
            scaleY: 1,
            y: 0,
            duration: 0.3,
            ease: 'back.out(2.1)',
          }, 0.12)
          .to(nuni, {
            y: lowerY,
            duration: 0.78,
            ease: 'power2.inOut',
            overwrite: 'auto',
          }, 0.34)
          .to(nuniMotion, {
            rotation: 7,
            x: 5,
            duration: 0.22,
            ease: 'power2.inOut',
          }, 1.18)
          .call(() => dropChipFromNuni(chipBody, attempt), [], 1.4);
      };

      const cancelCatchAttempt = (attempt: NonNullable<typeof catchAttempt>) => {
        if (attempt.canceling) return;
        attempt.canceling = true;
        nuniCatchTimeline?.kill();
        gsap.to(attempt.nuni, {
          x: attempt.startX,
          y: attempt.startY,
          scale: attempt.startScale,
          duration: 0.55,
          ease: 'power3.out',
          overwrite: 'auto',
          onComplete: () => finishNuniCatch(attempt),
        });
      };

      const catchHighChip = (chipBody: ChipBody) => {
        if (!engine || carriedChip || performance.now() < nuniCatchCooldownUntil) return;
        const nuni = document.querySelector<HTMLElement>(`.${styles.heroNuni}`);
        const nuniMotion = document.querySelector<HTMLElement>(`.${styles.heroNuniAmbientMotion}`);
        const nuniEyes = document.querySelector<HTMLElement>(`.${styles.heroNuniEyes}`);
        if (!nuni || !nuniMotion || !nuniEyes) return;

        chipBody.catchEligibleUntil = 0;
        const playBoxRect = playBox.getBoundingClientRect();
        const currentNuniRect = nuni.getBoundingClientRect();
        const startX = Number(gsap.getProperty(nuni, 'x')) || currentNuniRect.left;
        const startY = Number(gsap.getProperty(nuni, 'y')) || currentNuniRect.top;
        const startScale = Number(gsap.getProperty(nuni, 'scaleX')) || 1;
        const projectedChipX = playBoxRect.left
          + chipBody.body.position.x
          + chipBody.body.velocity.x * 14;
        const eyeOffset = gsap.utils.clamp(-3.5, 3.5, (projectedChipX - (currentNuniRect.left + currentNuniRect.width / 2)) * 0.04);

        carriedChip = chipBody;
        catchAttempt = {
          chipBody,
          nuni,
          nuniMotion,
          nuniEyes,
          startX,
          startY,
          startScale,
          startedAt: performance.now(),
          canceling: false,
          released: false,
        };
        nuni.dataset.skillsRescue = 'true';
        nuniCatchTimeline?.kill();
        nuniCatchTimeline = gsap.timeline()
          .to(nuniEyes, { x: eyeOffset, y: -2.2, duration: 0.18, ease: 'power2.out' }, 0)
          .to(nuni, {
            y: startY - Math.max(8, window.innerWidth * 0.008),
            scale: startScale,
            duration: 0.58,
            ease: 'power3.inOut',
            overwrite: 'auto',
          }, 0.04);
      };

      let previousTime = performance.now();
      const updatePhysics = (time: number) => {
        if (!engine) return;
        const delta = Math.min(32, Math.max(8, time - previousTime));
        previousTime = time;
        Engine.update(engine, delta * 0.75);
        chipBodies.forEach((chipBody) => {
          const {
            element,
            body,
            width,
            height,
            active,
            carried,
          } = chipBody;
          if (carried) {
            if (!chipBody.carryOverlay || !chipBody.carryFollowsNuni || !catchAttempt) return;
            const nuniRect = catchAttempt.nuni.getBoundingClientRect();
            const x = nuniRect.left + nuniRect.width / 2 - width / 2;
            const y = nuniRect.top - height + Math.max(2, nuniRect.height * 0.035);
            chipBody.carryOverlay.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(-2deg)`;
            return;
          }
          if (!active) return;
          const x = body.position.x - width / 2;
          const y = body.position.y - height / 2;
          element.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${body.angle}rad)`;

          if (
            catchAttempt?.chipBody === chipBody
            && !catchAttempt.canceling
            && !catchAttempt.released
          ) {
            const playBoxRect = playBox.getBoundingClientRect();
            const chipCenterX = playBoxRect.left + body.position.x;
            const scaledNuniWidth = catchAttempt.nuni.offsetWidth * catchAttempt.startScale;
            const desiredNuniX = gsap.utils.clamp(
              playBoxRect.left,
              playBoxRect.right - scaledNuniWidth,
              chipCenterX - scaledNuniWidth / 2,
            );
            const currentNuniX = Number(gsap.getProperty(catchAttempt.nuni, 'x')) || catchAttempt.startX;
            const followAmount = Math.min(0.24, delta * 0.014);
            gsap.set(catchAttempt.nuni, {
              x: currentNuniX + (desiredNuniX - currentNuniX) * followAmount,
            });

            const nuniRect = catchAttempt.nuni.getBoundingClientRect();
            const chipBottom = playBoxRect.top + body.position.y + height / 2;
            const horizontalDistance = Math.abs(chipCenterX - (nuniRect.left + nuniRect.width / 2));
            const horizontallyAligned = horizontalDistance <= (nuniRect.width + width) * 0.48;
            const touchesHead = chipBottom >= nuniRect.top - Math.max(8, height * 0.25)
              && chipBottom <= nuniRect.top + Math.max(30, height * 1.2);

            if (body.velocity.y >= 0 && horizontallyAligned && touchesHead) {
              placeChipOnNuni(catchAttempt);
              return;
            }

            if (
              time - catchAttempt.startedAt > 4000
              || (body.velocity.y > 0 && chipBottom > nuniRect.bottom)
            ) {
              cancelCatchAttempt(catchAttempt);
            }
            return;
          }

          if (
            !carriedChip
            && !chipBody.catchBlockedUntilNextDrag
            && time <= chipBody.catchEligibleUntil
            && time >= nuniCatchCooldownUntil
          ) {
            const nuni = document.querySelector<HTMLElement>(`.${styles.heroNuni}`);
            if (!nuni) return;
            const chipViewportY = playBox.getBoundingClientRect().top + body.position.y;
            if (chipViewportY < nuni.getBoundingClientRect().top) catchHighChip(chipBody);
          }
        });
        animationFrame = window.requestAnimationFrame(updatePhysics);
      };
      animationFrame = window.requestAnimationFrame(updatePhysics);

      resizeObserver = new ResizeObserver(() => {
        if (!engine) return;
        makeWalls();
        const width = playBox.clientWidth;
        const height = playBox.clientHeight;
        chipBodies.forEach((chipBody) => {
          if (!chipBody.active) return;
          const nextWidth = chipBody.element.offsetWidth;
          const nextHeight = chipBody.element.offsetHeight;
          if (chipBody.width > 0 && chipBody.height > 0) {
            Body.scale(chipBody.body, nextWidth / chipBody.width, nextHeight / chipBody.height);
          }
          chipBody.width = nextWidth;
          chipBody.height = nextHeight;
          Body.setPosition(chipBody.body, {
            x: Math.max(nextWidth / 2 + 2, Math.min(width - nextWidth / 2 - 2, chipBody.body.position.x)),
            y: Math.min(height - nextHeight / 2 - 2, chipBody.body.position.y),
          });
          Body.setSleeping(chipBody.body, false);
        });
      });
      resizeObserver.observe(playBox);
    };

    const checkSectionPosition = () => {
      positionCheckFrame = 0;
      const rect = section.getBoundingClientRect();
      const viewportMidpoint = window.innerHeight * 0.5;
      const isSectionActive = rect.top <= viewportMidpoint && rect.bottom >= viewportMidpoint;
      if (isSectionActive) {
        startChipPhysics();
        return;
      }
      if (physicsStarted && !resetRequested) {
        resetRequested = true;
        setPhysicsCycle((cycle) => cycle + 1);
      }
    };

    const requestCheck = () => {
      if (positionCheckFrame || resetRequested) return;
      positionCheckFrame = window.requestAnimationFrame(checkSectionPosition);
    };

    checkSectionPosition();
    window.addEventListener('scroll', requestCheck, { passive: true });
    window.addEventListener('resize', requestCheck);

    return () => {
      window.removeEventListener('scroll', requestCheck);
      window.removeEventListener('resize', requestCheck);
      playBox.removeEventListener('pointerdown', handleSkillPointerDown);
      window.removeEventListener('pointerup', handleSkillPointerRelease);
      window.removeEventListener('pointercancel', handleSkillPointerRelease);
      if (positionCheckFrame) window.cancelAnimationFrame(positionCheckFrame);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      chipDropTimers.forEach((timer) => window.clearTimeout(timer));
      chipCarryOverlays.forEach((overlay) => overlay.remove());
      chipCarryOverlays.clear();
      nuniCatchTimeline?.kill();
      resizeObserver?.disconnect();
      const nuni = document.querySelector<HTMLElement>(`.${styles.heroNuni}`);
      if (nuni) delete nuni.dataset.skillsRescue;
      if (physicsMouse) Mouse.clearSourceEvents(physicsMouse);
      if (engine) {
        Composite.clear(engine.world, false, true);
        Engine.clear(engine);
      }
      chips.forEach((chip) => {
        chip.style.opacity = '0';
        chip.style.removeProperty('transform');
        chip.classList.remove(styles.skillsChipDragging);
      });
    };
  }, [physicsCycle, prefersReducedMotion]);

  return (
    <section ref={sectionRef} id="skills" className={styles.skillsSection} aria-labelledby="skills-title">
      <div className={styles.skillsCanvas}>
        <img className={styles.skillsGround} src={skillsGroundSrc} alt="" aria-hidden="true" />
        <div className={styles.skillsGrid} aria-hidden="true" />

        <div className={`${styles.skillsContentBox} skills-content-box`}>
          <div className={`${styles.skillsHeaderRow} skills-header-row`}>
            <h2 className={styles.skillsTitle} id="skills-title">Skills</h2>
            <div className={styles.skillsInstruction}>
              <img src={skillsInstructionDotSrc} alt="" aria-hidden="true" />
              <p>Throw the skills you've found</p>
            </div>
          </div>

          <div ref={playBoxRef} className={styles.skillsPlayBox}>
            <div className={styles.skillsPlayBoxSurface} aria-hidden="true">
              <span className={styles.skillsPlayBoxBase} aria-hidden="true" />
              <img className={styles.skillsPlayBoxGrid} src={skillsPlayBoxGridSrc} alt="" />
            </div>

            <ul className={styles.skillsChips} aria-label="사용 기술">
              {skillChips.map((chip, index) => (
                <li
                  key={chip.label}
                  ref={(element) => { chipRefs.current[index] = element; }}
                  className={`${styles.skillsChip} ${
                    chip.category === 'ai'
                      ? styles.skillsChipAi
                      : chip.category === 'program'
                        ? styles.skillsChipProgram
                        : styles.skillsChipCode
                  }`}
                  style={{
                    inlineSize: `${(chip.width * skillChipScale) / 19.2}cqw`,
                  }}
                >
                  <span>{chip.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className={styles.contactSection} aria-labelledby="contact-title">
      <div className={styles.contactCanvas}>
        <div className={styles.contactLayoutGroup}>
          <div className={styles.contactContentGroup}>
            <div className={styles.contactTextBox}>
              <h2 className={styles.contactTitle} id="contact-title">
                Let's build
                <br />
                together.
              </h2>
              <p>좋은 경험은 좋은 대화에서 시작된다고 믿습니다</p>
            </div>

            <div className={styles.contactActionGroup}>
              <div className={styles.contactAvailabilityBox}>
                <img src={contactStatusDotSrc} alt="" aria-hidden="true" />
                <p>Open to opportunities</p>
              </div>
              <div className={styles.contactHelloButtonBox}>
                <a className={styles.contactHelloButton} href="mailto:ssachra@gmail.com">
                  <img src={contactButtonSrc} alt="" aria-hidden="true" />
                  <span>Say Hello →</span>
                </a>
              </div>
            </div>
          </div>

          <div className={styles.contactMethods}>
            <a className={`${styles.contactMethod} ${styles.contactMethodEmail}`} href="mailto:ssachra@gmail.com">
              <img className={styles.contactMethodTick} src={contactTickSrc} alt="" aria-hidden="true" />
              <span className={styles.contactMethodLabel}>Email</span>
              <span className={styles.contactMethodValue}>ssachra@gmail.com</span>
              <img className={styles.contactMethodUnderline} src={contactEmailUnderlineSrc} alt="" aria-hidden="true" />
            </a>

            <div className={`${styles.contactMethod} ${styles.contactMethodResume}`}>
              <img className={styles.contactMethodTick} src={contactTickSrc} alt="" aria-hidden="true" />
              <span className={styles.contactMethodLabel}>Resume</span>
              <span className={styles.contactMethodValue}>PDF Preview &amp; Download</span>
              <img className={styles.contactMethodUnderline} src={contactResumeUnderlineSrc} alt="" aria-hidden="true" />
            </div>
          </div>
        </div>

        <div className={styles.contactGround} aria-hidden="true" />
        <div className={styles.contactGrid} aria-hidden="true" />
      </div>
    </section>
  );
}

function ClosingSection() {
  return (
    <section id="closing" className={styles.closingSection} aria-label="Moon Soomin closing">
      <div className={styles.closingCanvas}>
        <img className={styles.closingGround} src={closingGroundSrc} alt="" aria-hidden="true" />
        <img className={styles.closingGrid} src={journeyTextureGridSrc} alt="" aria-hidden="true" />
        <p className={styles.closingBrand}>REVE</p>
        <p className={styles.closingDisciplines}>PRODUCT THINKING · UI/UX · FRONT-END · AI</p>
        <p className={styles.closingWordmark} aria-label="moon soomin">moon soomin*</p>
        <p className={styles.closingMessage}>Hope this was a good experience.</p>
      </div>
    </section>
  );
}

export default function StrategistPage() {
  useSmoothScroll();

  return (
    <main className={styles.strategistPage} data-guide-theme="strategist">
      <ScrollNuni />
      <SectionNavigation />
      <section id="hero" className={styles.heroSection} aria-labelledby="hero-title">
        <div className={styles.heroCanvas}>
          <div className={styles.heroGround} aria-hidden="true" />
          <div className={styles.heroGrid} aria-hidden="true" />
          <p className={`${styles.closingMessage} ${styles.heroMessage}`}>
            © 2026 — From “what if?” to “here it is.”
          </p>

          <div className="hero-text-block">
            <div className="hero-kicker">
              <img
                className="hero-kicker__dot"
                src={heroKickerDotSrc}
                alt=""
                aria-hidden="true"
              />
              <p className="hero-kicker__text">PRODUCT THINKING · UI/UX · FRONT-END · AI</p>
            </div>

            <h1 className={styles.heroTitle} id="hero-title">
              <span className={styles.heroTitleText}>
                Ideas
                <br />
                into
                <br />
                Reality
              </span>
              <span className={styles.circleAnnotation} aria-hidden="true">
                <svg
                  className={styles.circleDrawSvg}
                  viewBox="0 0 627.606 197.678"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <mask
                      id="hero-circle-start-mask"
                      x="-40"
                      y="-40"
                      width="710"
                      height="280"
                      maskUnits="userSpaceOnUse"
                    >
                      <path
                        className={`${styles.circleDrawPath} ${styles.circleDrawPathStart}`}
                        pathLength="1"
                        d={HERO_CIRCLE_START_PATH}
                      />
                    </mask>
                    <mask
                      id="hero-circle-body-mask"
                      x="-40"
                      y="-40"
                      width="710"
                      height="280"
                      maskUnits="userSpaceOnUse"
                    >
                      <path
                        className={`${styles.circleDrawPath} ${styles.circleDrawPathBody}`}
                        pathLength="1"
                        d={HERO_CIRCLE_BODY_PATH}
                      />
                    </mask>
                    <mask
                      id="hero-circle-end-mask"
                      x="-40"
                      y="-40"
                      width="710"
                      height="280"
                      maskUnits="userSpaceOnUse"
                    >
                      <path
                        className={`${styles.circleDrawPath} ${styles.circleDrawPathEnd}`}
                        pathLength="1"
                        d={HERO_CIRCLE_END_PATH}
                      />
                      <path
                        className={styles.circleDrawPathGuard}
                        d={HERO_CIRCLE_START_PATH}
                      />
                    </mask>
                  </defs>
                  <image
                    href={circleAnnotationSrc}
                    width="627.606"
                    height="197.678"
                    mask="url(#hero-circle-start-mask)"
                    preserveAspectRatio="none"
                  />
                  <image
                    href={circleAnnotationSrc}
                    width="627.606"
                    height="197.678"
                    mask="url(#hero-circle-body-mask)"
                    preserveAspectRatio="none"
                  />
                  <image
                    href={circleAnnotationSrc}
                    width="627.606"
                    height="197.678"
                    mask="url(#hero-circle-end-mask)"
                    preserveAspectRatio="none"
                  />
                </svg>
              </span>
              <span className={styles.copyAccent} aria-hidden="true">
                <svg
                  className={styles.circleAccentDrawSvg}
                  viewBox="0 0 153 101"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <mask
                      id="hero-circle-accent-draw-mask"
                      x="0"
                      y="0"
                      width="153"
                      height="101"
                      maskUnits="userSpaceOnUse"
                    >
                      <path
                        className={`${styles.circleDrawPath} ${styles.circleDrawPathBody}`}
                        pathLength="1"
                        d={HERO_CIRCLE_BODY_PATH}
                        transform="translate(-478.064 -97.274)"
                      />
                    </mask>
                  </defs>
                  <image
                    href={copyAccentSrc}
                    width="153"
                    height="101"
                    mask="url(#hero-circle-accent-draw-mask)"
                    preserveAspectRatio="none"
                  />
                </svg>
              </span>
            </h1>

            <p className={styles.beliefCopy}>
              좋은 경험은 작은 호기심에서 시작된다고 믿습니다.
              <br />
              질문에서 출발한 아이디어를 사람들에게 닿는 경험으로 연결하고,
              <br />
              그 과정 속에서 더 나은 답을 만들어갑니다.
            </p>
          </div>

          <HeroAmbientDots />
        </div>
      </section>
      <AboutSection />
      <div className={styles.journeyStack}>
        <JourneySection />
        <JourneyDiscoverySection />
        <JourneyObservationSection />
        <JourneyMovementSection />
        <JourneyExpansionSection />
        <JourneyRealitySection />
      </div>
      <ProjectsIntroSection />
      <SkillsSection />
      <ContactSection />
      <ClosingSection />
    </main>
  );
}
