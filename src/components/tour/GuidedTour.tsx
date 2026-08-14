import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import type { GuideId } from '../../data/guides';
import { createGuidedTourSteps } from '../../data/guidedTour';
import {
  setPageScrollPosition,
  setSmoothScrollLocked,
} from '../../hooks/useSmoothScroll';
import styles from './GuidedTour.module.scss';

export const guidedSkillThrowEvent = 'guided-tour:throw-skill';
export const guidedSkillThrowAcceptedEvent = 'guided-tour:skill-throw-accepted';
export const guidedSkillCatchCompleteEvent = 'guided-tour:skill-catch-complete';
export const guidedProjectSelectEvent = 'guided-tour:select-project';
export const guidedProjectReadyEvent = 'guided-tour:project-ready';

type Props = {
  guide: GuideId;
  onSpeechChange: (message: string | null, visible: boolean) => void;
  onActiveChange: (active: boolean) => void;
};

const formatTime = (seconds: number) => {
  const rounded = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(rounded / 60)}:${String(rounded % 60).padStart(2, '0')}`;
};

export default function GuidedTour({ guide, onSpeechChange, onActiveChange }: Props) {
  const steps = useMemo(() => createGuidedTourSteps(guide), [guide]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const wheelIntentRef = useRef({ total: 0, lastAt: 0 });
  const touchStartYRef = useRef<number | null>(null);
  const skillSpeechDelayRef = useRef<gsap.core.Tween | null>(null);
  const skillThrowRetryRef = useRef<number | null>(null);

  const stop = (completed = false) => {
    const timeline = timelineRef.current;
    if (completed) setProgress(1);
    timeline?.kill();
    skillSpeechDelayRef.current?.kill();
    timelineRef.current = null;
    onSpeechChange(null, false);
    setIsConfirming(false);
    setIsExiting(true);
    window.setTimeout(() => {
      onActiveChange(false);
      setIsMounted(false);
    }, completed ? 1100 : 260);
  };

  const requestStop = () => {
    const timeline = timelineRef.current;
    if (!timeline || isConfirming) return;
    timeline.pause();
    skillSpeechDelayRef.current?.pause();
    setIsConfirming(true);
  };

  useEffect(() => {
    // The tour owns scrolling while active; each frame synchronizes both the
    // native position and Lenis through the shared scroll setter below.
    setSmoothScrollLocked(true);
    let pendingProjectSpeech: {
      project: 'marshall' | 'route' | 'viner';
      message: string;
    } | null = null;
    let pendingSkillSpeech: { skill: string; message: string } | null = null;
    const handleProjectReady = (event: Event) => {
      const project = (event as CustomEvent<'marshall' | 'route' | 'viner'>).detail;
      if (!pendingProjectSpeech || pendingProjectSpeech.project !== project) return;
      onSpeechChange(pendingProjectSpeech.message, true);
      pendingProjectSpeech = null;
    };
    window.addEventListener(guidedProjectReadyEvent, handleProjectReady);
    const handleSkillCatchComplete = (event: Event) => {
      const skill = (event as CustomEvent<string>).detail;
      if (!pendingSkillSpeech || pendingSkillSpeech.skill !== skill) return;
      if (skillThrowRetryRef.current !== null) {
        window.clearInterval(skillThrowRetryRef.current);
        skillThrowRetryRef.current = null;
      }
      const message = pendingSkillSpeech.message;
      pendingSkillSpeech = null;
      skillSpeechDelayRef.current?.kill();
      skillSpeechDelayRef.current = gsap.delayedCall(0.45, () => {
        skillSpeechDelayRef.current = null;
        onSpeechChange(message, true);
      });
    };
    window.addEventListener(guidedSkillCatchCompleteEvent, handleSkillCatchComplete);
    const handleSkillThrowAccepted = (event: Event) => {
      const skill = (event as CustomEvent<string>).detail;
      if (!pendingSkillSpeech || pendingSkillSpeech.skill !== skill) return;
      if (skillThrowRetryRef.current !== null) {
        window.clearInterval(skillThrowRetryRef.current);
        skillThrowRetryRef.current = null;
      }
    };
    window.addEventListener(guidedSkillThrowAcceptedEvent, handleSkillThrowAccepted);
    let lastOwnedScrollY = window.scrollY;

    const timeline = gsap.timeline({
      paused: true,
      onUpdate: () => setProgress(timelineRef.current?.progress() ?? 0),
      onComplete: () => stop(true),
    });
    timelineRef.current = timeline;

    steps.forEach((step) => {
      if (step.targetId) {
        const scrollState = {
          progress: 0,
          start: 0,
          target: null as HTMLElement | null,
        };
        timeline.to(scrollState, {
          progress: 1,
          duration: 1.8,
          ease: 'power2.inOut',
          onStart: () => {
            scrollState.start = Math.max(lastOwnedScrollY, window.scrollY);
            scrollState.target = document.getElementById(step.targetId!);
          },
          onUpdate: () => {
            const liveTargetScrollY = scrollState.target
              ? window.scrollY + scrollState.target.getBoundingClientRect().top
              : window.scrollY;
            const destination = Math.max(scrollState.start, liveTargetScrollY);
            const nextScrollY = scrollState.start
              + (destination - scrollState.start) * scrollState.progress;
            lastOwnedScrollY = Math.max(lastOwnedScrollY, nextScrollY);
            setPageScrollPosition(lastOwnedScrollY);
          },
        });
      }
      timeline.call(() => {
        if (step.project) {
          onSpeechChange(null, false);
          pendingProjectSpeech = step.speech
            ? { project: step.project, message: step.speech }
            : null;
          window.dispatchEvent(new CustomEvent(guidedProjectSelectEvent, {
            detail: step.project,
          }));
        } else if (step.skill) {
          onSpeechChange(null, false);
          pendingSkillSpeech = step.speech
            ? { skill: step.skill, message: step.speech }
            : null;
          const requestSkillThrow = () => {
            window.dispatchEvent(new CustomEvent(guidedSkillThrowEvent, { detail: step.skill }));
          };
          skillThrowRetryRef.current = window.setInterval(requestSkillThrow, 250);
          requestSkillThrow();
        } else {
          onSpeechChange(step.speech ?? null, Boolean(step.speech));
        }
      });
      timeline.to({}, { duration: step.duration });
      timeline.call(() => {
        pendingProjectSpeech = null;
        pendingSkillSpeech = null;
        if (skillThrowRetryRef.current !== null) {
          window.clearInterval(skillThrowRetryRef.current);
          skillThrowRetryRef.current = null;
        }
        skillSpeechDelayRef.current?.kill();
        skillSpeechDelayRef.current = null;
        onSpeechChange(null, false);
      });
    });

    setDuration(timeline.duration());
    onActiveChange(true);
    timeline.play(0);

    return () => {
      timeline.kill();
      skillSpeechDelayRef.current?.kill();
      if (skillThrowRetryRef.current !== null) {
        window.clearInterval(skillThrowRetryRef.current);
        skillThrowRetryRef.current = null;
      }
      setSmoothScrollLocked(false);
      window.removeEventListener(guidedProjectReadyEvent, handleProjectReady);
      window.removeEventListener(guidedSkillCatchCompleteEvent, handleSkillCatchComplete);
      window.removeEventListener(guidedSkillThrowAcceptedEvent, handleSkillThrowAccepted);
      onSpeechChange(null, false);
    };
    // This timeline is intentionally built once for the selected entry guide.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if ((event.target as Element).closest('[data-tour-control]')) return;
      event.preventDefault();
      event.stopPropagation();
      requestStop();
    };
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Element;
      if (target.closest('[data-tour-control]')) return;
      if (event.pointerType === 'touch') touchStartYRef.current = event.clientY;
      if (!target.closest('[class*="skillsPlayBox"], [class*="projectCard"], a, button')) return;
      event.preventDefault();
      event.stopPropagation();
      requestStop();
    };
    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'touch' || touchStartYRef.current === null) return;
      if (Math.abs(event.clientY - touchStartYRef.current) < 14) return;
      event.preventDefault();
      requestStop();
      touchStartYRef.current = null;
    };
    const clearTouchIntent = () => { touchStartYRef.current = null; };
    const handleWheel = (event: WheelEvent) => {
      const now = performance.now();
      const intent = wheelIntentRef.current;
      intent.total = now - intent.lastAt > 240 ? Math.abs(event.deltaY) : intent.total + Math.abs(event.deltaY);
      intent.lastAt = now;
      if (intent.total < 36) return;
      event.preventDefault();
      requestStop();
    };
    document.addEventListener('click', handleClick, true);
    document.addEventListener('pointerdown', handlePointerDown, true);
    document.addEventListener('pointermove', handlePointerMove, { capture: true, passive: false });
    document.addEventListener('pointerup', clearTouchIntent, true);
    document.addEventListener('pointercancel', clearTouchIntent, true);
    window.addEventListener('wheel', handleWheel, { capture: true, passive: false });
    return () => {
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('pointerdown', handlePointerDown, true);
      document.removeEventListener('pointermove', handlePointerMove, true);
      document.removeEventListener('pointerup', clearTouchIntent, true);
      document.removeEventListener('pointercancel', clearTouchIntent, true);
      window.removeEventListener('wheel', handleWheel, true);
    };
  });

  if (!isMounted) return null;
  const remaining = duration * (1 - progress);

  return (
    <>
      <div
        className={`${styles.controls} ${isExiting ? styles.exiting : ''}`}
        data-tour-control
        aria-label="가이드 투어 진행 상황"
      >
        <div className={styles.track} aria-hidden="true">
          <span style={{ transform: `scaleX(${progress})` }} />
        </div>
        <time className={styles.time}>{formatTime(remaining)}</time>
        <button type="button" className={styles.stop} onClick={requestStop}>STOP</button>
      </div>

      {isConfirming && (
        <div className={styles.backdrop} data-tour-control role="presentation">
          <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="tour-stop-title">
            <h2 id="tour-stop-title">가이드 투어를 종료할까요?</h2>
            <p>지금부터 자유롭게 둘러볼 수 있어요.</p>
            <div className={styles.actions}>
              <button
                type="button"
                onClick={() => {
                  setIsConfirming(false);
                  skillSpeechDelayRef.current?.resume();
                  timelineRef.current?.resume();
                }}
              >
                계속 보기
              </button>
              <button type="button" onClick={() => stop(false)}>투어 종료</button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
