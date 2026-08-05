import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import guideChangeDotSrc from '../../assets/strategist-hero/guide-change-dot.svg';
import styles from '../../pages/StrategistPage.module.scss';

export default function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return undefined;
    const darkSections = ['journey', 'journey-movement', 'closing']
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    let frame = 0;

    const updateHeaderColor = () => {
      frame = 0;
      const headerRect = header.getBoundingClientRect();
      const headerAnchor = headerRect.top + (headerRect.height * 0.5);
      const isOnDarkSection = darkSections.some((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= headerAnchor && rect.bottom >= headerAnchor;
      });
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
    <header ref={headerRef} className={`${styles.mainHeader} site-header`}>
      <a className={styles.mainWordmark} href="#hero">Moon Soomin *</a>
      <nav className={styles.mainNavigation} aria-label="주요 메뉴">
        <Link className={styles.guideChangeLink} to="/">
          <img src={guideChangeDotSrc} alt="" aria-hidden="true" />
          <span>Guide Change</span>
        </Link>
        <a href="#about">About</a>
        <a href="#projects">Projects</a>
        <a className={styles.contactLink} href="#contact">Contact to ME</a>
      </nav>
    </header>
  );
}
