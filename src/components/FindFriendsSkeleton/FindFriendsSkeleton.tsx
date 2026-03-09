import styles from "./FindFriendsSkeleton.module.scss";

const FindFriendCardSkeleton = () => (
  <div className={styles.card}>
    <div className={styles.userInfo}>
      <div className={`${styles.shimmer} ${styles.avatar}`} />
      <div className={styles.nameAndCurrent}>
        <div className={`${styles.shimmer} ${styles.name}`} />
        <div className={`${styles.shimmer} ${styles.sub}`} />
      </div>
    </div>
    <div className={`${styles.shimmer} ${styles.btn}`} />
  </div>
);

const FindFriendsSkeleton = () => (
  <div className={styles.results}>
    <div className={`${styles.shimmer} ${styles.resultsTitle}`} />
    <div className={styles.cards}>
      {[...Array(3)].map((_, i) => (
        <FindFriendCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

export default FindFriendsSkeleton;
