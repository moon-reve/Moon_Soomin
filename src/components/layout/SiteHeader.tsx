import { Link } from 'react-router-dom';
import guideChangeDotSrc from '../../assets/strategist-hero/guide-change-dot.svg';
import styles from '../../pages/StrategistPage.module.scss';

export default function SiteHeader() {
  return (
    <header className={styles.mainHeader}>
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
