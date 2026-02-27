import React from "react";
import WelcomeSection from "@/components/WelcomeSection";
import NowReadingSection from "@/components/NowReadingSection";
import ActivityFeed from "@/components/ActivityFeed";

import Navbar from "@/components/Navbar";

import Layout from "@/components/Layout";

const homepage = () => {
  return (
    <>
      <Layout>
        <WelcomeSection />
        <NowReadingSection />
        <ActivityFeed />
      </Layout>
    </>
  );
};

export default homepage;
