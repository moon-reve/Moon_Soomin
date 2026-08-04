import liveDotSrc from '../../assets/guide-selection/live-dot.svg';
import styles from '../../pages/GuideSelectionPage.module.scss';

export default function SelectionHeader() {
  return (
    <header className={styles.header}>
      <p className={styles.wordmark}>Moon Soomin *</p>
      <div className={styles.sessionStatus}>
        <img src={liveDotSrc} alt="" aria-hidden="true" />
        <span>LIVE SESSION</span>
      </div>
    </header>
  );
}
