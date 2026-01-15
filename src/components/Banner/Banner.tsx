import Image from "next/image";
import styles from "./Banner.module.scss";

const Banner = () => {
  return (
    <div className={styles.banner}>
      <Image
        src="/images/mobile_banner.webp"
        alt="Banner"
        fill
        className={`${styles.image} ${styles.mobile}`}
      />

      <Image
        src="/images/tablet_banner.webp"
        alt="Banner"
        fill
        className={`${styles.image} ${styles.tablet}`}
      />

      <Image
        src="/images/desktop_banner.webp"
        alt="Banner"
        fill
        className={`${styles.image} ${styles.desktop}`}
      />
    </div>
  );
};

export default Banner;
