import React from "react";
import Image from "next/image";

import { useRouter } from "next/router";

import { redirectTo } from "@/util/clientUtils";

import Layout from "@/components/Layout";

import styles from "./UserProfileContent.module.scss";

const UserProfileContent = () => {
  const { query } = useRouter();

  return (
    <Layout>
      <div className={styles.userProfile}>
        <div className={styles.header}>
          <Image
            // key={user?.profile_image}
            src={"/images/user_profile.webp"}
            width={80}
            height={80}
            alt="Profile image"
            className={styles.avatar}
          />
          <div className={styles.details}>
            <h1 className={styles.username}> Name Placeholder</h1>
            <button onClick={() => redirectTo("/user/edit")}>
              Edit Profile
            </button>
            <p className={styles.bio}>Joined January 2026</p>
            <p>Age 28</p>
            <p>January 27</p>
            <p>
              bio Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Provident minima corrupti ab atque aliquam accusamus! Temporibus
              exercitationem quo nobis cumque ipsam ut cum ratione, officiis
              deserunt odio expedita dolorum at?
            </p>
          </div>
        </div>
        <div>Currently Reading</div>
        <div>Book Shelves</div>
        <div>Friends</div>
      </div>
    </Layout>
  );
};

export default UserProfileContent;
