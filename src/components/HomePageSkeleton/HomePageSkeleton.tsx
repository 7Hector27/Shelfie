import styles from "./HomePageSkeleton.module.scss";

const HomePageSkeleton = () => {
  return (
    <div className={styles.wrapper}>
      {/* WelcomeSection skeleton */}
      <div className={styles.welcomeCard}>
        <div className={styles.welcomeText}>
          <div className={`${styles.shimmer} ${styles.titleBar}`} />
          <div className={`${styles.shimmer} ${styles.subtitleBar}`} />
        </div>
        <div className={styles.welcomeButtons}>
          <div className={`${styles.shimmer} ${styles.btn}`} />
          <div className={`${styles.shimmer} ${styles.btn}`} />
        </div>
      </div>

      {/* NowReadingSection skeleton */}
      <div className={styles.section}>
        <div className={`${styles.shimmer} ${styles.sectionTitle}`} />
        <div className={styles.coverRow}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`${styles.shimmer} ${styles.cover}`} />
          ))}
        </div>
      </div>

      {/* ActivityFeed skeleton */}
      <div className={styles.section}>
        <div className={`${styles.shimmer} ${styles.sectionTitle}`} />
        {[...Array(3)].map((_, i) => (
          <div key={i} className={styles.activityCard}>
            <div className={`${styles.shimmer} ${styles.activityAvatar}`} />
            <div className={styles.activityLines}>
              <div className={`${styles.shimmer} ${styles.activityLineA}`} />
              <div className={`${styles.shimmer} ${styles.activityLineB}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePageSkeleton;
