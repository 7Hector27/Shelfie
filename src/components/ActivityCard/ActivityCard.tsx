import Image from "next/image";
import { useRouter } from "next/router";

import BookStatusDropdown from "../BookStatusDropdown";
import { ActivityType, ActivityFeedItem } from "@/util/types";

import styles from "./ActivityCard.module.scss";

interface Props {
  item: ActivityFeedItem;
}

const ActivityCard = ({ item }: Props) => {
  const router = useRouter();

  const actionText = getActionText(item.type, item.metadata);

  function formatActivityDate(dateString: string): string {
    const created = new Date(dateString);
    const now = new Date();

    const diffMs = now.getTime() - created.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffDays < 7) {
      // Format as MM/DD
      const month = created.getMonth() + 1;
      const day = created.getDate();
      return `${month}/${day}`;
    }

    const weeks = Math.floor(diffDays / 7);
    return `${weeks}w`;
  }

  console.log(item);
  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Image
            src={item.profile_image}
            alt={`${item.first_name} ${item.last_name}`}
            width={40}
            height={40}
            className={styles.avatar}
            onClick={() => router.push(`/user/profile/${item.actor_id}`)}
          />

          <div className={styles.headerText}>
            <span
              className={styles.actorName}
              onClick={() => router.push(`/user/profile/${item.actor_id}`)}
            >
              {item.first_name} {item.last_name}
            </span>{" "}
            {actionText}
          </div>
        </div>

        <div className={styles.date}>{formatActivityDate(item.created_at)}</div>
      </div>

      {/* Book Section */}
      <div className={styles.bookRow}>
        <Image
          src={item.cover_url}
          alt={item.title}
          width={80}
          height={120}
          className={styles.cover}
          onClick={() => router.push(`/book/${item.book_id}`)}
        />

        <div className={styles.bookInfo}>
          <div className={styles.title}>{item.title}</div>
          <div className={styles.author}>{item.author}</div>

          {/* Dropdown aligned under title/author */}
          <div className={styles.statusWrapper}>
            <BookStatusDropdown
              bookId={item.book_id}
              externalSource="open_library"
              book={{
                title: item.title,
                author: item.author,
                cover_url: item.cover_url,
              }}
            />
          </div>
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
