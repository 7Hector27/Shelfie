import React, { useState } from "react";
import Image from "next/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import FriendCard from "@/components/FriendCard";
import FriendRequestsModal from "@/components/FriendRequestsModal/FriendRequestsModal";
import ConfirmationModal from "@/components/ConfirmationModal";
import FriendsSkeleton from "@/components/FriendsSkeleton";

import { redirectTo } from "@/util/clientUtils";
import { apiGet, apiDelete } from "@/lib/api";
import { GetRequestsResponse, GetFriendListResponse } from "@/util/types";

import styles from "./FriendsContent.module.scss";

const FriendsContent = () => {
  const [displayModal, setDisplayModal] = useState(false);
  const [friendToDelete, setFriendToDelete] = useState<string | null>(null); // ✅

  const queryClient = useQueryClient(); // ✅

  const fetchFriendRequests = async () => {
    const data = await apiGet<GetRequestsResponse>("/friends/requests");
    return data.requests;
  };

  const { data: friendRequests = [], isLoading: loadingRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: fetchFriendRequests,
  });

  const fetchFriendList = async () => {
    const data = await apiGet<GetFriendListResponse>("/friends/list");
    return data.friends;
  };

  const { data: friendList = [], isLoading: loadingList } = useQuery({
    queryKey: ["friendList"],
    queryFn: fetchFriendList,
  });

  const handleDeleteFriend = async () => {
    if (!friendToDelete) return;
    await apiDelete(`/friends/${friendToDelete}`);
    queryClient.invalidateQueries({ queryKey: ["friendList"] });
    setFriendToDelete(null);
  };

  const isLoading = loadingRequests || loadingList;
  if (isLoading) return <FriendsSkeleton />;

  return (
    <div className={styles.friendsContent}>
      <ConfirmationModal
        isOpen={!!friendToDelete}
        onClose={() => setFriendToDelete(null)}
        title="Remove friend?"
        copy="They won't be notified, but you'll no longer see each other's activity."
        confirmCopy="Remove"
        onConfirm={handleDeleteFriend}
      />

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

        {friendList.length ? (
          <div className={styles.cards}>
            {friendList.map((friend) => {
              const {
                id,
                firstName,
                lastName,
                profilePictureUrl,
                currently_reading,
                friend_count,
                book_count,
              } = friend;

              const titles = currently_reading?.map((item) => item.book?.title);

              return (
                <FriendCard
                  key={id}
                  id={id}
                  name={`${firstName} ${lastName}`}
                  currentlyReading={titles}
                  books={book_count}
                  friends={friend_count}
                  profilePictureUrl={profilePictureUrl}
                  onDelete={() => setFriendToDelete(id)} // ✅
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
