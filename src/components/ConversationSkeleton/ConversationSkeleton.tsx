import styles from "./ConversationSkeleton.module.scss";

const ConversationSkeleton = () => {
  return (
    <div className={styles.messages}>
      {/* Theirs */}
      <div className={`${styles.row} ${styles.theirs}`}>
        <div className={`${styles.shimmer} ${styles.avatar}`} />
        <div className={styles.bubbleStack}>
          <div
            className={`${styles.shimmer} ${styles.bubble} ${styles.bubbleMd}`}
          />
          <div className={`${styles.shimmer} ${styles.meta}`} />
        </div>
      </div>

      {/* Mine */}
      <div className={`${styles.row} ${styles.mine}`}>
        <div className={styles.bubbleStack}>
          <div
            className={`${styles.shimmer} ${styles.bubble} ${styles.bubbleSm}`}
          />
          <div className={`${styles.shimmer} ${styles.meta}`} />
        </div>
      </div>

      {/* Theirs */}
      <div className={`${styles.row} ${styles.theirs}`}>
        <div className={`${styles.shimmer} ${styles.avatar}`} />
        <div className={styles.bubbleStack}>
          <div
            className={`${styles.shimmer} ${styles.bubble} ${styles.bubbleLg}`}
          />
          <div className={`${styles.shimmer} ${styles.meta}`} />
        </div>
      </div>

      {/* Mine */}
      <div className={`${styles.row} ${styles.mine}`}>
        <div className={styles.bubbleStack}>
          <div
            className={`${styles.shimmer} ${styles.bubble} ${styles.bubbleMd}`}
          />
          <div className={`${styles.shimmer} ${styles.meta}`} />
        </div>
      </div>

      {/* Theirs */}
      <div className={`${styles.row} ${styles.theirs}`}>
        <div className={`${styles.shimmer} ${styles.avatar}`} />
        <div className={styles.bubbleStack}>
          <div
            className={`${styles.shimmer} ${styles.bubble} ${styles.bubbleSm}`}
          />
          <div className={`${styles.shimmer} ${styles.meta}`} />
        </div>
      </div>

      {/* Mine */}
      <div className={`${styles.row} ${styles.mine}`}>
        <div className={styles.bubbleStack}>
          <div
            className={`${styles.shimmer} ${styles.bubble} ${styles.bubbleLg}`}
          />
          <div className={`${styles.shimmer} ${styles.meta}`} />
        </div>
      </div>
    </div>
  );
};

export default ConversationSkeleton;
