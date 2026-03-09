import styles from "./AuthorSkeleton.module.scss";

const AuthorSkeleton = () => {
  return (
    <div className={styles.wrapper}>
      {/* Author card */}
      <div className={styles.authorInfo}>
        <div className={`${styles.shimmer} ${styles.sectionTitle}`} />
        <div className={styles.authorDetails}>
          <div className={`${styles.shimmer} ${styles.photo}`} />
          <div className={styles.authorMeta}>
            <div className={`${styles.shimmer} ${styles.name}`} />
            <div className={`${styles.shimmer} ${styles.birthDate}`} />
          </div>
        </div>
        <div className={`${styles.shimmer} ${styles.bioLine}`} />
        <div className={`${styles.shimmer} ${styles.bioLine}`} />
        <div className={`${styles.shimmer} ${styles.bioLineShort}`} />
      </div>

      {/* Top picks carousel */}
      <div className={styles.topPicks}>
        <div className={styles.topPicksHeader}>
          <div className={`${styles.shimmer} ${styles.heading}`} />
          <div className={styles.carouselControls}>
            <div className={`${styles.shimmer} ${styles.ctrlBtn}`} />
            <div className={`${styles.shimmer} ${styles.ctrlBtn}`} />
          </div>
        </div>
        <div className={styles.booksRow}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className={styles.bookCard}>
              <div className={`${styles.shimmer} ${styles.cover}`} />
              <div className={`${styles.shimmer} ${styles.bookTitle}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Identifiers */}
      <div className={styles.identifiers}>
        <div className={`${styles.shimmer} ${styles.heading}`} />
        <div className={styles.idGrid}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className={styles.idRow}>
              <div className={`${styles.shimmer} ${styles.idKey}`} />
              <div className={`${styles.shimmer} ${styles.idValue}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthorSkeleton;
