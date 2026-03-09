import styles from "./UserProfileSkeleton.module.scss";

const UserProfileSkeleton = () => {
  return (
    <div className={styles.userProfile}>
      {/* Header card */}
      <div className={styles.header}>
        <div className={`${styles.shimmer} ${styles.avatar}`} />
        <div className={styles.details}>
          <div className={`${styles.shimmer} ${styles.username}`} />
          <div className={`${styles.shimmer} ${styles.editBtn}`} />
          <div className={`${styles.shimmer} ${styles.joined}`} />
          <div className={`${styles.shimmer} ${styles.age}`} />
          <div className={`${styles.shimmer} ${styles.bio}`} />
        </div>
      </div>

      {/* Currently Reading */}
      <div className={styles.section}>
        <div className={`${styles.shimmer} ${styles.sectionHeading}`} />
        <div className={styles.readingList}>
          {[...Array(2)].map((_, i) => (
            <div key={i} className={styles.readingItem}>
              <div className={`${styles.shimmer} ${styles.bookCover}`} />
              <div className={styles.bookMeta}>
                <div className={`${styles.shimmer} ${styles.bookTitle}`} />
                <div className={`${styles.shimmer} ${styles.bookAuthor}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shelves */}
      <div className={styles.section}>
        <div className={`${styles.shimmer} ${styles.sectionHeading}`} />
        <div className={styles.shelfGrid}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className={styles.shelfCard}>
              <div className={`${styles.shimmer} ${styles.shelfIcon}`} />
              <div className={`${styles.shimmer} ${styles.shelfCount}`} />
              <div className={`${styles.shimmer} ${styles.shelfLabel}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Friends */}
      <div className={styles.section}>
        <div className={`${styles.shimmer} ${styles.sectionHeading}`} />
        <div className={styles.friendsList}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className={styles.friendItem}>
              <div className={`${styles.shimmer} ${styles.friendAvatar}`} />
              <div className={`${styles.shimmer} ${styles.friendName}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfileSkeleton;
