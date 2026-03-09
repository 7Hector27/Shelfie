import styles from "./UserBookSkeleton.module.scss";

const BookCardSkeleton = () => (
  <div className={styles.bookCard}>
    <div className={styles.topRow}>
      <div className={`${styles.shimmer} ${styles.cover}`} />
      <div className={styles.cardBody}>
        <div className={`${styles.shimmer} ${styles.title}`} />
        <div className={`${styles.shimmer} ${styles.author}`} />
        <div className={`${styles.shimmer} ${styles.pill}`} />
      </div>
    </div>
    <div className={`${styles.shimmer} ${styles.ratingBlock}`} />
    <div className={`${styles.shimmer} ${styles.dateMeta}`} />
    <div className={styles.cardDivider} />
    <div className={`${styles.shimmer} ${styles.review}`} />
    <div className={styles.cardFooter}>
      <div className={`${styles.shimmer} ${styles.footerBtn}`} />
      <div className={`${styles.shimmer} ${styles.footerBtn}`} />
    </div>
  </div>
);

const UserBookSkeleton = () => {
  return (
    <div className={styles.libraryPage}>
      <div className={styles.libraryContainer}>
        <div className={styles.libraryMain}>
          {/* Header */}
          <div className={styles.libraryHeader}>
            <div className={`${styles.shimmer} ${styles.heading}`} />
            <div className={`${styles.shimmer} ${styles.subheading}`} />
          </div>

          {/* Shelf tabs */}
          <div className={styles.shelfTabs}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`${styles.shimmer} ${styles.tab}`} />
            ))}
          </div>

          {/* Book cards */}
          <div className={styles.bookList}>
            {[...Array(3)].map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className={styles.librarySidebar}>
          <div className={styles.statsCard}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`${styles.shimmer} ${styles.statLine}`} />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default UserBookSkeleton;
