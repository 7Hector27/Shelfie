import React from "react";
import styles from "./StarRatingDisplay.module.scss";

type Props = {
  rating: number | null | undefined;
  onClick?: () => void;
  max?: number;
};

const roundToQuarter = (n: number) => Math.round(n * 4) / 4;

const StarRatingDisplay = ({ rating, onClick, max = 5 }: Props) => {
  const hasRating = typeof rating === "number" && !Number.isNaN(rating);
  const rounded = hasRating ? roundToQuarter(rating as number) : 0;

  const fillPercent = hasRating ? (rounded / max) * 100 : 0;
  return (
    <button type="button" onClick={onClick} className={styles.starsButton}>
      <div className={styles.starContainer}>
        <div className={styles.starBase}>{"★".repeat(max)}</div>

        <div className={styles.starFill} style={{ width: `${fillPercent}%` }}>
          {"★".repeat(max)}
        </div>
      </div>

      {!hasRating && <span className={styles.unratedText}>Not rated</span>}
      {hasRating && <span className={styles.ratingText}>{rounded}</span>}
    </button>
  );
};

export default StarRatingDisplay;
