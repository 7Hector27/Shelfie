import React from "react";
import Image from "next/image";

import Layout from "@/components/Layout";

import styles from "./FindFriendsContent.module.scss";
import FriendCard from "@/components/FriendCard";
import { redirectTo } from "@/util/clientUtils";

export const mockFriends = [
  {
    id: "1",
    name: "Alex Walker",
  },
  {
    id: "2",
    name: "Jenny Adams",
  },
  {
    id: "3",
    name: "Chris Morgan",
  },
];
const FindFriendsContent = () => {
  return (
    <Layout>
      <div className={styles.findFriends}>
        <div className={styles.titles}>
          <h1>Add Friends</h1>
          <p>Find a friend by name or email address</p>
        </div>
        <div className={styles.searchBarWrapper}>
          <div className={styles.search}>
            <Image
              src={"/images/magnifying_glass_white.webp"}
              alt="magnifying_glass"
              width={16}
              height={16}
              className={styles.icon}
            />
            <input
              type="search"
              name=""
              id=""
              placeholder="Search by name or email"
            />
          </div>
        </div>
        <div className={styles.results}>
          <h2 className={styles.resultsTitle}>Results for: </h2>
          <div className={styles.cards}>
            {mockFriends.map((friend) => {
              const { id, name } = friend;
              return (
                <FriendCard
                  key={id}
                  id={id}
                  name={name}
                  buttonCopy="+ Add"
                  buttonHandler={() => redirectTo(`/profile/view/${id}`)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FindFriendsContent;
