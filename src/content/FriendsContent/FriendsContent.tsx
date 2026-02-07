import React, { useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";

import FriendCard from "@/components/FriendCard";
import FriendRequestsModal from "@/components/FriendRequestsModal/FriendRequestsModal";

import { redirectTo } from "@/util/clientUtils";
import { apiGet } from "@/lib/api";
import { GetRequestsResponse, GetFriendListResponse } from "@/util/types";

import styles from "./FriendsContent.module.scss";

const FriendsContent = () => {
  const [displayModal, setDisplayModal] = useState<boolean>(false);

  // Fetch friend requests
  const fetchFriendRequests = async () => {
    const data = await apiGet<GetRequestsResponse>("/friends/requests");
    return data.requests;
  };

  const { data: friendRequests = [], isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: fetchFriendRequests,
  });

  // Fetching Friends list
  const fetchFriendList = async () => {
    const data = await apiGet<GetFriendListResponse>("/friends/list");
    return data.friends;
  };

  const { data: friendList = [], isLoading: isLoadingFriendList } = useQuery({
    queryKey: ["friendList"],
    queryFn: fetchFriendList,
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
          {friendRequests.length > 0 && (
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
              <span className={styles.badge}>
                {friendRequests?.length || 0}
              </span>
            </button>
          )}
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

        {friendList.length ? (
          <div className={styles.cards}>
            {friendList.map((friend) => {
              const { id, firstName, lastName, email, profilePictureUrl } =
                friend;
              return (
                <FriendCard
                  key={id}
                  id={id}
                  name={`${firstName} ${lastName}`}
                  currentlyReading={"Nothing"}
                  books={1}
                  friends={1}
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
