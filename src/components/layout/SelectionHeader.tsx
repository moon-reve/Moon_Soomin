import styles from '../../pages/GuideSelectionPage.module.scss';

export default function SelectionHeader() {
  return (
    <header className={styles.header} data-guide-theme="strategist">
      <p className={styles.wordmark}>Moon Soomin *</p>
      <div className={styles.sessionStatus}>
        <span className={styles.sessionStatusDot} aria-hidden="true" />
        <span>LIVE SESSION</span>
      </div>
    </header>
  );
}
