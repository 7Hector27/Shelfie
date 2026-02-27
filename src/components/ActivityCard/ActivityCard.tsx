import Image from "next/image";
import { useRouter } from "next/router";

import { ActivityType, ActivityFeedItem } from "@/util/types";

import styles from "./ActivityCard.module.scss";

/* =========================
   Types
========================= */

interface Props {
  item: ActivityFeedItem;
}

/* =========================
   Component
========================= */

const ActivityCard = ({ item }: Props) => {
  const router = useRouter();

  const actionText = getActionText(item.type, item.metadata);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Image
          src={item.profile_image}
          alt={`${item.first_name} ${item.last_name}`}
          className={styles.avatar}
          onClick={() => router.push(`/user/profile/${item.actor_id}`)}
          width={100}
          height={100}
        />

        <span>
          <span
            className={styles.actorName}
            onClick={() => router.push(`/user/profile/${item.actor_id}`)}
          >
            {item.first_name} {item.last_name}
          </span>{" "}
          {actionText}
        </span>
      </div>

      <div
        className={styles.bookRow}
        onClick={() => router.push(`/book/${item.book_id}`)}
      >
        <Image
          src={item.cover_url}
          alt={item.title}
          className={styles.cover}
          width={100}
          height={100}
        />

        <div className={styles.bookInfo}>
          <div className={styles.title}>{item.title}</div>
          <div className={styles.author}>{item.author}</div>
        </div>
      </div>
    </div>
  );
};

/* =========================
   Helpers
========================= */

function getActionText(
  type: ActivityType,
  metadata: ActivityFeedItem["metadata"],
): string {
  switch (type) {
    case "book_added":
      return "added this book";

    case "started_reading":
      return "started reading";

    case "finished_reading":
      return "finished reading";

    case "rated_book":
      return metadata.rating
        ? `rated this ${metadata.rating}★`
        : "rated this book";

    case "review_posted":
      return "wrote a review for";

    case "dropped":
      return "dropped";

    default:
      return "";
  }
}

export default ActivityCard;
