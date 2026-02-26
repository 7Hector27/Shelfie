import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";

import { apiGet, apiPost } from "@/lib/api";
import { GetFriendListResponse } from "@/util/types";

import styles from "./FriendPicker.module.scss";

interface Props {
  onClose: () => void;
}

type StartConversationResponse = {
  conversation_id: string;
};

const FriendPicker = ({ onClose }: Props) => {
  const router = useRouter();

  const fetchFriendList = async () => {
    const data = await apiGet<GetFriendListResponse>("/friends/list");
    return data.friends;
  };

  const { data: friendList = [], isLoading: isLoadingFriendList } = useQuery({
    queryKey: ["friendList"],
    queryFn: fetchFriendList,
  });

  const startConversation = useMutation<
    StartConversationResponse,
    Error,
    string
  >({
    mutationFn: (friendId: string) =>
      apiPost<StartConversationResponse>("/messages/start", {
        friendId,
      }),

    onSuccess: (data) => {
      onClose();
      router.push(`/messages/${data.conversation_id}`);
    },
  });
  console.log(friendList);
  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>New Message</h2>
          <button onClick={onClose}>Close</button>
        </div>

        {isLoadingFriendList ? (
          <p className={styles.empty}>Loading friends...</p>
        ) : friendList.length === 0 ? (
          <p className={styles.empty}>No friends found</p>
        ) : (
          <div className={styles.list}>
            {friendList.map((friend) => (
              <button
                key={friend.id}
                className={styles.friendCard}
                onClick={() => startConversation.mutate(friend.id)}
              >
                <div className={styles.avatar}>
                  {friend.profilePictureUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={friend.profilePictureUrl}
                      alt={`${friend.firstName} ${friend.lastName}`}
                      className={styles.avatarImg}
                    />
                  ) : (
                    <span className={styles.avatarFallback}>
                      {friend.firstName.charAt(0)}
                    </span>
                  )}
                </div>

                <span>
                  {friend.firstName} {friend.lastName}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendPicker;
