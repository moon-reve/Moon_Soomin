import { useEffect, useRef, type RefObject } from 'react';
import styles from './NuniSpeechBubble.module.scss';

interface NuniSpeechBubbleProps {
  anchorRef: RefObject<HTMLElement | null>;
  sizeAnchorRef?: RefObject<HTMLElement | null>;
  message: string | null;
  isVisible: boolean;
}

export function NuniSpeechBubble({
  anchorRef,
  sizeAnchorRef,
  message,
  isVisible,
}: NuniSpeechBubbleProps) {
  const bubbleRef = useRef<HTMLElement>(null);
  const normalizedMessage = message?.replace(/\s*\n\s*/g, ' ') ?? null;

  useEffect(() => {
    const anchor = anchorRef.current;
    const bubble = bubbleRef.current;
    if (!anchor || !bubble) return undefined;

    let frame = 0;
    const updatePosition = () => {
      const anchorRect = anchor.getBoundingClientRect();
      const sizeAnchorRect = sizeAnchorRef?.current?.getBoundingClientRect() ?? anchorRect;
      bubble.style.setProperty(
        '--nuni-speech-max-width',
        `${sizeAnchorRect.width * 2.75}px`,
      );
      const bubbleWidth = bubble.offsetWidth;
      const bubbleHeight = bubble.offsetHeight;
      const viewportPadding = 16;
      const gap = 24;
      const centeredX = anchorRect.left + anchorRect.width / 2;
      const x = Math.max(
        viewportPadding + bubbleWidth / 2,
        Math.min(window.innerWidth - viewportPadding - bubbleWidth / 2, centeredX),
      );
      const bubbleLeft = x - bubbleWidth / 2;
      const tailX = Math.max(14, Math.min(bubbleWidth - 14, centeredX - bubbleLeft));
      const hasRoomAbove = anchorRect.top - gap - bubbleHeight >= viewportPadding;

      bubble.style.left = `${x}px`;
      bubble.style.top = `${hasRoomAbove ? anchorRect.top : anchorRect.bottom}px`;
      bubble.style.setProperty('--nuni-speech-tail-x', `${tailX}px`);
      bubble.dataset.placement = hasRoomAbove ? 'above' : 'below';
    };

    const followAnchor = () => {
      updatePosition();
      frame = window.requestAnimationFrame(followAnchor);
    };

    updatePosition();
    if (isVisible) frame = window.requestAnimationFrame(followAnchor);
    window.addEventListener('resize', updatePosition);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', updatePosition);
    };
  }, [anchorRef, sizeAnchorRef, isVisible, normalizedMessage]);

  return (
    <aside
      ref={bubbleRef}
      className={styles.anchor}
      data-placement="above"
      data-animation-state={isVisible ? 'visible' : 'hidden'}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-hidden={!isVisible}
    >
      <div className={styles.bubble}>
        <p>{normalizedMessage}</p>
        <span className={styles.tail} aria-hidden="true" />
      </div>
    </aside>
  );
}
