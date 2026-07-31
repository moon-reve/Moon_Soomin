import { forwardRef, useImperativeHandle, useRef, type Ref } from 'react';
import bodySrc from '../../../assets/nuni/body/Nuni_Body_v1.svg';
import leftEyeSrc from '../../../assets/nuni/eyes/eyes_left.svg';
import rightEyeSrc from '../../../assets/nuni/eyes/eyes_righteyes_right.svg';
import shadowSrc from '../../../assets/nuni/shadows/shadow_base.svg';
import styles from './Nuni.module.scss';

export type NuniProps = {
  className?: string;
  'aria-label'?: string;
};

export type NuniDomRefs = {
  characterWrapperRef: HTMLSpanElement;
  bodyRef: HTMLSpanElement;
  eyesRef: HTMLSpanElement;
  leftEyeRef: HTMLSpanElement;
  rightEyeRef: HTMLSpanElement;
  leftEyeBlinkRef: HTMLSpanElement;
  rightEyeBlinkRef: HTMLSpanElement;
  shadowRef: HTMLSpanElement;
};

export type NuniHandle = {
  getDomRefs: () => NuniDomRefs | null;
};

export const Shadow = forwardRef<HTMLSpanElement>(function Shadow(_, ref) {
  return (
    <span ref={ref} className={styles.shadow} data-nuni-part="shadow" aria-hidden="true">
      <img src={shadowSrc} alt="" draggable="false" />
    </span>
  );
});

export const Body = forwardRef<HTMLSpanElement>(function Body(_, ref) {
  return (
    <span ref={ref} className={styles.body} data-nuni-part="body" aria-hidden="true">
      <img src={bodySrc} alt="" draggable="false" />
    </span>
  );
});

type EyesProps = {
  leftEyeRef: Ref<HTMLSpanElement>;
  rightEyeRef: Ref<HTMLSpanElement>;
  leftEyeBlinkRef: Ref<HTMLSpanElement>;
  rightEyeBlinkRef: Ref<HTMLSpanElement>;
};

export const Eyes = forwardRef<HTMLSpanElement, EyesProps>(function Eyes({
  leftEyeRef,
  rightEyeRef,
  leftEyeBlinkRef,
  rightEyeBlinkRef,
}, ref) {
  return (
    <span ref={ref} className={styles.eyes} data-nuni-part="eyes" aria-hidden="true">
      <span ref={leftEyeRef} className={`${styles.eye} ${styles.leftEye}`} data-nuni-part="left-eye-direction">
        <span ref={leftEyeBlinkRef} className={styles.eyeBlink} data-nuni-part="left-eye-blink">
          <img src={leftEyeSrc} alt="" draggable="false" />
        </span>
      </span>
      <span ref={rightEyeRef} className={`${styles.eye} ${styles.rightEye}`} data-nuni-part="right-eye-direction">
        <span ref={rightEyeBlinkRef} className={styles.eyeBlink} data-nuni-part="right-eye-blink">
          <img src={rightEyeSrc} alt="" draggable="false" />
        </span>
      </span>
    </span>
  );
});

const Nuni = forwardRef<NuniHandle, NuniProps>(function Nuni({
  className,
  'aria-label': ariaLabel = '누니',
}, ref) {
  const characterWrapperRef = useRef<HTMLSpanElement>(null);
  const bodyRef = useRef<HTMLSpanElement>(null);
  const eyesRef = useRef<HTMLSpanElement>(null);
  const leftEyeRef = useRef<HTMLSpanElement>(null);
  const rightEyeRef = useRef<HTMLSpanElement>(null);
  const leftEyeBlinkRef = useRef<HTMLSpanElement>(null);
  const rightEyeBlinkRef = useRef<HTMLSpanElement>(null);
  const shadowRef = useRef<HTMLSpanElement>(null);
  const classNames = [styles.nuni, className].filter(Boolean).join(' ');

  useImperativeHandle(ref, () => ({
    getDomRefs() {
      if (!characterWrapperRef.current
        || !bodyRef.current
        || !eyesRef.current
        || !leftEyeRef.current
        || !rightEyeRef.current
        || !leftEyeBlinkRef.current
        || !rightEyeBlinkRef.current
        || !shadowRef.current) return null;

      return {
        characterWrapperRef: characterWrapperRef.current,
        bodyRef: bodyRef.current,
        eyesRef: eyesRef.current,
        leftEyeRef: leftEyeRef.current,
        rightEyeRef: rightEyeRef.current,
        leftEyeBlinkRef: leftEyeBlinkRef.current,
        rightEyeBlinkRef: rightEyeBlinkRef.current,
        shadowRef: shadowRef.current,
      };
    },
  }), []);

  return (
    <div className={classNames} role="img" aria-label={ariaLabel}>
      <Shadow ref={shadowRef} />
      <span
        ref={characterWrapperRef}
        className={styles.character}
        data-nuni-part="character-wrapper"
      >
        <Body ref={bodyRef} />
        <Eyes
          ref={eyesRef}
          leftEyeRef={leftEyeRef}
          rightEyeRef={rightEyeRef}
          leftEyeBlinkRef={leftEyeBlinkRef}
          rightEyeBlinkRef={rightEyeBlinkRef}
        />
      </span>
    </div>
  );
});

export default Nuni;
