import { useGuide } from '../../hooks/useGuide';
import styles from '../../pages/GuideSelectionPage.module.scss';

export default function SelectionHeader() {
  const { selectedGuide } = useGuide();

  return (
    <header className={styles.header} data-guide-theme={selectedGuide}>
      <p className={styles.wordmark}>Moon Soomin *</p>
      <div className={styles.sessionStatus}>
        <span className={styles.sessionStatusDot} aria-hidden="true" />
        <span>LIVE SESSION</span>
      </div>
    </header>
  );
}
