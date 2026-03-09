import React from "react";
import { useQuery } from "@tanstack/react-query";
import WelcomeSection from "@/components/WelcomeSection";
import NowReadingSection from "@/components/NowReadingSection";
import ActivityFeed from "@/components/ActivityFeed";
import HomePageSkeleton from "@/components/HomePageSkeleton";
import Layout from "@/components/Layout";

import styles from "./HomePageContent.module.scss";

const HomePageContent = () => {
  const { isLoading } = useQuery({
    queryKey: ["feed"],
    queryFn: () => fetch("/api/feed").then((r) => r.json()),
    staleTime: 30_000,
  });

  return (
    <Layout>
      {isLoading ? (
        <HomePageSkeleton />
      ) : (
        <div className={styles.homepage}>
          <WelcomeSection />
          <NowReadingSection />
          <ActivityFeed />
        </div>
      )}
    </Layout>
  );
};

export default HomePageContent;
