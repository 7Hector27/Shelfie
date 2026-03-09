import styles from "./BookSkeleton.module.scss";

const BookSkeleton = () => {
  return (
    <div className={styles.wrapper}>
      {/* Book details top section */}
      <div className={styles.bookDetailsWrapper}>
        <div className={`${styles.shimmer} ${styles.cover}`} />

        <div className={styles.bookDetails}>
          <div className={`${styles.shimmer} ${styles.title}`} />
          <div className={`${styles.shimmer} ${styles.author}`} />
          <div className={`${styles.shimmer} ${styles.rating}`} />
          <div className={`${styles.shimmer} ${styles.statusBtn}`} />
        </div>
      </div>

      {/* Description */}
      <div className={styles.descriptionBlock}>
        <div className={`${styles.shimmer} ${styles.descLine}`} />
        <div className={`${styles.shimmer} ${styles.descLine}`} />
        <div className={`${styles.shimmer} ${styles.descLineShort}`} />
      </div>

      {/* Shelves stats */}
      <div className={styles.shelves}>
        <div className={styles.shelfStat}>
          <div className={`${styles.shimmer} ${styles.statNum}`} />
          <div className={`${styles.shimmer} ${styles.statLabel}`} />
        </div>
        <div className={styles.shelfStat}>
          <div className={`${styles.shimmer} ${styles.statNum}`} />
          <div className={`${styles.shimmer} ${styles.statLabel}`} />
        </div>
      </div>

      {/* Author section */}
      <div className={styles.authorBlock}>
        <div className={`${styles.shimmer} ${styles.authorHeading}`} />
        <div className={styles.authorDetails}>
          <div className={`${styles.shimmer} ${styles.authorPhoto}`} />
          <div className={styles.authorMeta}>
            <div className={`${styles.shimmer} ${styles.authorName}`} />
            <div className={`${styles.shimmer} ${styles.authorDate}`} />
          </div>
        </div>
        <div className={`${styles.shimmer} ${styles.descLine}`} />
        <div className={`${styles.shimmer} ${styles.descLine}`} />
        <div className={`${styles.shimmer} ${styles.descLineShort}`} />
      </div>
    </div>
  );
};

export default BookSkeleton;
