import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../pages/StrategistPage.module.scss';

export default function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return undefined;
    const darkSectionIds = new Set(['journey', 'journey-movement', 'skills', 'closing']);
    let frame = 0;

    const updateHeaderColor = () => {
      frame = 0;
      const headerRect = header.getBoundingClientRect();
      const headerAnchor = headerRect.top + (headerRect.height * 0.5);
      const visibleSection = Array.from(document.querySelectorAll<HTMLElement>('main section[id]'))
        .filter((section) => {
          const rect = section.getBoundingClientRect();
          return rect.top <= headerAnchor && rect.bottom >= headerAnchor;
        })
        .at(-1);
      const isOnDarkSection = visibleSection ? darkSectionIds.has(visibleSection.id) : false;
      header.classList.toggle('site-header--on-dark', isOnDarkSection);
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateHeaderColor);
    };

    updateHeaderColor();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className={`${styles.mainHeader} site-header`}
      data-guide-theme="strategist"
    >
      <a className={styles.mainWordmark} href="#hero">Moon Soomin *</a>
      <nav className={styles.mainNavigation} aria-label="주요 메뉴">
        <Link className={styles.guideChangeLink} to="/">
          <span className={styles.guideChangeDot} aria-hidden="true" />
          <span>Guide Change</span>
        </Link>
        <a href="#about">About</a>
        <a href="#projects">Projects</a>
        <a className={styles.contactLink} href="#contact">Contact to ME</a>
      </nav>
    </header>
  );
}
