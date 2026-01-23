import Image from "next/image";
import styles from "./Banner.module.scss";

type BannerProps = {
  title: string;
  subtitle?: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
  images: {
    desktop: string;
    tablet: string;
    mobile: string;
  };
};

export default function Banner({
  title,
  subtitle,
  buttonLabel,
  onButtonClick,
  images,
}: BannerProps) {
  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}

        {buttonLabel && onButtonClick && (
          <button onClick={onButtonClick}>{buttonLabel}</button>
        )}
      </div>

      <div className={styles.image}>
        <picture>
          <source media="(max-width: 600px)" srcSet={images.mobile} />
          <source media="(max-width: 1024px)" srcSet={images.tablet} />
          <Image
            src={images.desktop}
            alt=""
            fill
            priority
            className={styles.bannerImage}
          />
        </picture>
      </div>
    </div>
  );
}
