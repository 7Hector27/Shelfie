import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";

import FriendCard from "@/components/FriendCard";
import FriendRequestsModal from "@/components/FriendRequestsModal/FriendRequestsModal";

import { redirectTo } from "@/util/clientUtils";
import { apiGet, apiPost } from "@/lib/api";
import {
  FriendCardProps,
  RequestType,
  GetRequestsResponse,
} from "@/util/types";

import styles from "./FriendsContent.module.scss";

const FriendsContent = () => {
  const [displayModal, setDisplayModal] = useState<boolean>(false);

  const mockFriends: FriendCardProps[] = [
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

  const fetchFriendRequests = async () => {
    const data = await apiGet<GetRequestsResponse>("/friends/requests");
    return data.requests;
  };

  const { data: friendRequests = [], isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: fetchFriendRequests,
  });

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
        <div className={styles.sectionHeader}>
          <h2 className={styles.title}>FRIENDS</h2>
          <button
            className={styles.requestsBtn}
            title="Friend requests"
            onClick={() => setDisplayModal(true)}
          >
            <Image
              src="/images/bell-notification.webp"
              alt="Friend requests"
              width={24}
              height={24}
            />
            <span className={styles.badge}>{friendRequests?.length || 0}</span>
          </button>
        </div>
        {/* <div>
          <input
            type="search"
            name=""
            id=""
            placeholder="Filter friends"
            onChange={(e) => {}}
          />
        </div> */}

        {mockFriends.length ? (
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
        ) : (
          <div className={styles.addFriends}>
            <h2>No friends yet</h2>
            <p>Add friends to start sharing books</p>
            <button onClick={() => redirectTo("/friends/find")}>
              + Add Friends
            </button>
          </div>
        )}
      </div>
      <FriendRequestsModal
        displayModal={displayModal}
        setDisplayModal={setDisplayModal}
        requests={friendRequests || []}
      />
    </div>
  );
};

export default FriendsContent;
