import React from "react";
import { useRouter } from "next/router";

import { redirectTo } from "@/util/clientUtils";

import Layout from "@/components/Layout";

import styles from "./UserProfileContent.module.scss";

const UserProfileContent = () => {
  const { query } = useRouter();

  return (
    <Layout>
      <div className={styles.userProfile}>
        {query.id}
        <button onClick={() => redirectTo("/user/edit")}>Edit Profile</button>
      </div>
    </Layout>
  );
};

export default UserProfileContent;
