import React, { useState } from "react";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";

import { RequestType } from "@/util/types";
import { apiPost } from "@/lib/api";

import styles from "./FriendRequestsModal.module.scss";

type FriendRequestsType = {
  displayModal: boolean;
  setDisplayModal: (display: boolean) => void;
  requests: RequestType[];
};

const FriendRequests = ({
  displayModal,
  setDisplayModal,
  requests,
}: FriendRequestsType) => {
  const [requestStatus, setRequestStatus] = useState<
    Record<string, "accepted" | "declined">
  >({});
  const queryClient = useQueryClient();

  const acceptRequest = async (requestId: string) => {
    try {
      await apiPost(`/friends/requests/${requestId}/accept`, {});
      setRequestStatus((prev) => ({
        ...prev,
        [requestId]: "accepted",
      }));
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const declineRequest = async (requestId: string) => {
    try {
      await apiPost(`/friends/requests/${requestId}/decline`, {});
      setRequestStatus((prev) => ({
        ...prev,
        [requestId]: "declined",
      }));
    } catch (error) {
      console.error("Error declining friend request:", error);
    }
  };

  return (
    displayModal && (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <header className={styles.header}>
            <h3>Friend Requests</h3>
            <button
              className={styles.close}
              onClick={() => {
                setDisplayModal(false);
                queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
              }}
            >
              ×
            </button>
          </header>
          <div className={styles.list}>
            {requests.length ? (
              requests.map((request) => {
                const {
                  id: requestId,
                  first_name,
                  last_name,
                  user_id,
                  profile_image,
                } = request;
                return (
                  <div key={requestId} className={styles.requestCard}>
                    <div className={styles.requestInfo}>
                      <Image
                        src={profile_image ?? "/images/user_profile.webp"}
                        alt="User Profile"
                        width={30}
                        height={30}
                      />
                      <p className={styles.name}>
                        {first_name} {last_name}
                      </p>
                    </div>
                    <div className={styles.requestActions}>
                      {requestStatus[requestId] === "accepted" && (
                        <span className={styles.accepted}>
                          Request Accepted
                        </span>
                      )}

                      {requestStatus[requestId] === "declined" && (
                        <span className={styles.declined}>
                          Request Declined
                        </span>
                      )}

                      {!requestStatus[requestId] && (
                        <>
                          <button
                            className={styles.accept}
                            onClick={() => acceptRequest(requestId)}
                          >
                            Accept
                          </button>
                          <button
                            className={styles.decline}
                            onClick={() => declineRequest(requestId)}
                          >
                            Decline
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className={styles.noRequests}>No friend requests</p>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default FriendRequests;
