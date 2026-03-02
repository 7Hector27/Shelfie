import React from "react";
import WelcomeSection from "@/components/WelcomeSection";
import NowReadingSection from "@/components/NowReadingSection";
import ActivityFeed from "@/components/ActivityFeed";

import Layout from "@/components/Layout";

import styles from "./HomePageContent.module.scss";

const HomePageContent = () => {
  return (
    <Layout>
      <div className={styles.homepage}>
        <WelcomeSection />
        <NowReadingSection />
        <ActivityFeed />
      </div>
    </Layout>
  );
};

export default HomePageContent;
