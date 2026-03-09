import styles from "./UserEditSkeleton.module.scss";

const UserEditSkeleton = () => {
  return (
    <div className={styles.editProfile}>
      <div className={`${styles.shimmer} ${styles.title}`} />

      <div className={styles.editProfileSection}>
        {/* Avatar */}
        <div className={styles.avatarSection}>
          <div className={`${styles.shimmer} ${styles.avatar}`} />
          <div className={`${styles.shimmer} ${styles.changePhotoBtn}`} />
        </div>

        {/* Form */}
        <div className={styles.form}>
          {/* Name row */}
          <div className={styles.nameRow}>
            <div className={styles.fieldGroup}>
              <div className={`${styles.shimmer} ${styles.label}`} />
              <div className={`${styles.shimmer} ${styles.input}`} />
            </div>
            <div className={styles.fieldGroup}>
              <div className={`${styles.shimmer} ${styles.label}`} />
              <div className={`${styles.shimmer} ${styles.input}`} />
            </div>
          </div>

          {/* Email */}
          <div className={`${styles.shimmer} ${styles.label}`} />
          <div className={`${styles.shimmer} ${styles.input}`} />

          {/* Birthdate */}
          <div className={`${styles.shimmer} ${styles.label}`} />
          <div className={`${styles.shimmer} ${styles.input}`} />

          {/* Bio */}
          <div className={`${styles.shimmer} ${styles.label}`} />
          <div className={`${styles.shimmer} ${styles.textarea}`} />

          {/* Submit */}
          <div className={`${styles.shimmer} ${styles.submitBtn}`} />
        </div>
      </div>
    </div>
  );
};

export default UserEditSkeleton;
