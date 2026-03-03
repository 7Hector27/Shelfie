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

  if (isLoading) {
    return <div className={styles.container}>Loading activity...</div>;
  }

  if (isError) {
    return <div className={styles.container}>Failed to load activity.</div>;
  }

  if (!feed.length) return null;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Updates</h3>

      {feed.map((item) => (
        <ActivityCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default ActivityFeed;
