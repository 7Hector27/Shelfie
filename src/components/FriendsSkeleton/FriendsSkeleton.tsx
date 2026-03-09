import styles from "./FriendsSkeleton.module.scss";

const FriendCardSkeleton = () => (
  <div className={styles.card}>
    <div className={styles.userInfo}>
      <div className={`${styles.shimmer} ${styles.avatar}`} />
      <div className={styles.nameAndCurrent}>
        <div className={`${styles.shimmer} ${styles.name}`} />
        <div className={`${styles.shimmer} ${styles.reading}`} />
      </div>
    </div>
    <div className={styles.stats}>
      <div className={`${styles.shimmer} ${styles.stat}`} />
      <div className={`${styles.shimmer} ${styles.stat}`} />
    </div>
  </div>
);

const FriendsSkeleton = () => {
  return (
    <div className={styles.wrapper}>
      {/* Banner skeleton */}
      <div className={styles.banner}>
        <div className={styles.bannerContent}>
          <div className={`${styles.shimmer} ${styles.bannerTitle}`} />
          <div className={`${styles.shimmer} ${styles.bannerSubtitle}`} />
          <div className={`${styles.shimmer} ${styles.bannerBtn}`} />
        </div>
      </div>

      {/* Friends list skeleton */}
      <div className={styles.friendsList}>
        <div className={styles.sectionHeader}>
          <div className={`${styles.shimmer} ${styles.sectionTitle}`} />
        </div>
        <div className={styles.cards}>
          {[...Array(4)].map((_, i) => (
            <FriendCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendsSkeleton;
