import { useQuery } from "@tanstack/react-query";

import ActivityCard from "../ActivityCard";

import { ActivityFeedItem } from "@/util/types";

import styles from "./ActivityFeed.module.scss";

const fetchFeed = async (): Promise<ActivityFeedItem[]> => {
  const res = await fetch("/api/feed");

  if (!res.ok) {
    throw new Error("Failed to fetch feed");
  }

  return res.json();
};

const ActivityFeed = () => {
  const {
    data: feed = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["feed"],
    queryFn: fetchFeed,
  });

  if (isLoading) return null;

  if (isError) return null;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Updates</h3>

      {feed.length ? (
        feed.map((item) => <ActivityCard key={item.id} item={item} />)
      ) : (
        <p className={styles.empty}>
          No activity yet — add friends to see what they`re reading!
        </p>
      )}
    </div>
  );
};

export default ActivityFeed;
