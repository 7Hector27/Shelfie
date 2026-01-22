import React from "react";
import Image from "next/image";

import FriendCard from "@/components/FriendCard";
import { redirectTo } from "@/util/clientUtils";

import styles from "./FriendsContent.module.scss";

type FriendCardProps = {
  name: string;
  id: string;
  currentlyReading: string | string[];
  books: number;
  friends: number;
};

export const mockFriends: FriendCardProps[] = [
  {
    id: "1",
    name: "Alex Walker",
    currentlyReading: "Dune",
    books: 12,
    friends: 8,
  },
  {
    id: "2",
    name: "Jenny Adams",
    currentlyReading: "Atomic Habits",
    books: 20,
    friends: 15,
  },
  {
    id: "3",
    name: "Chris Morgan",
    currentlyReading: "The Midnight Library",
    books: 8,
    friends: 5,
  },
];

const FriendsContent = () => {
  return (
    <div className={styles.friendsContent}>
      <div className={styles.banner}>
        <div className={styles.bannerContent}>
          <h2>Friends</h2>
          <p>See what your friends are reading</p>
          <button onClick={() => redirectTo("/friends/find")}>
            + Add Friends
          </button>
        </div>
        <Image
          src={"/images/quiet-night.webp"}
          alt="shelf icon"
          width={500}
          height={500}
          className={styles.mobileShelfIcon}
        />
        <Image
          src={"/images/quiet-night.webp"}
          alt="shelf icon"
          width={1000}
          height={1000}
          className={styles.shelfIcon}
        />
      </div>
      <div className={styles.friendsList}>
        <h2 className={styles.title}>FRIENDS</h2>
        <div className={styles.cards}>
          {mockFriends.map((friend) => {
            const { id, name, currentlyReading, books, friends } = friend;
            return (
              <FriendCard
                key={id}
                id={id}
                name={name}
                currentlyReading={currentlyReading}
                books={books}
                friends={friends}
              />
            );
          })}
        </div>
      </div>
      <div className={styles.addFriends}>
        <h2>No friends yet</h2>
        <p>Add friends to start sharing books</p>
        <button onClick={() => redirectTo("/friends/find")}>
          + Add Friends
        </button>
      </div>
    </div>
  );
};

export default FriendsContent;
