import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

import Layout from "@/components/Layout";
import FriendPicker from "@/components/FriendPicker";
import { apiGet } from "@/lib/api";

import styles from "./MessagesContent.module.scss";

type ConversationListItem = {
  conversation_id: string;
  friend_id: string;
  first_name: string;
  last_name: string;
  profile_image: string | null;
  last_message: string | null;
  last_message_at: string | null;
  sender_id: string | null;
  unread_count: number;
};

const MessagesContent = () => {
  const router = useRouter();
  const [showPicker, setShowPicker] = useState(false);

  const getUserConversations = async (): Promise<ConversationListItem[]> => {
    return apiGet("/messages");
  };

  const { data, isLoading } = useQuery<ConversationListItem[]>({
    queryKey: ["conversations"],
    queryFn: getUserConversations,
  });

  const conversations = data ?? [];

  return (
    <Layout>
      <div className={styles.wrapper}>
        {/* Filter Pills */}
        <div className={styles.pills}>
          <button className={`${styles.pill} ${styles.active}`}>All</button>
          <button className={styles.pill}>Unread</button>
        </div>

        {/* Plus Button */}
        <button
          className={styles.newMessageBtn}
          onClick={() => setShowPicker(true)}
        >
          ➕
        </button>

        {/* Friend Picker */}
        {showPicker && <FriendPicker onClose={() => setShowPicker(false)} />}

        {/* Loading */}
        {isLoading && <p className={styles.emptyState}>Loading...</p>}

        {/* Conversation List */}
        {!isLoading && (
          <div className={styles.conversationList}>
            {conversations.length === 0 ? (
              <p className={styles.emptyState}>No messages</p>
            ) : (
              conversations.map((c) => {
                const hasUnread = c.unread_count > 0;

                return (
                  <button
                    key={c.conversation_id}
                    className={`${styles.conversationCard} ${
                      hasUnread ? styles.unreadCard : ""
                    }`}
                    onClick={() =>
                      router.push(`/messages/${c.conversation_id}`)
                    }
                  >
                    <div className={styles.avatar}>
                      {c.profile_image ? (
                        <img
                          src={c.profile_image}
                          alt={`${c.first_name} ${c.last_name}`}
                          className={styles.avatarImg}
                        />
                      ) : (
                        <span className={styles.avatarFallback}>
                          {c.first_name.charAt(0)}
                        </span>
                      )}
                    </div>

                    <div className={styles.conversationInfo}>
                      <div className={styles.topRow}>
                        <span
                          className={`${styles.name} ${
                            hasUnread ? styles.unreadText : ""
                          }`}
                        >
                          {c.first_name} {c.last_name}
                        </span>

                        <span className={styles.timestamp}>
                          {c.last_message_at
                            ? new Date(c.last_message_at).toLocaleDateString()
                            : ""}
                        </span>
                      </div>

                      <div className={styles.bottomRow}>
                        <div
                          className={`${styles.preview} ${
                            hasUnread ? styles.unreadText : ""
                          }`}
                        >
                          {c.last_message ?? ""}
                        </div>

                        {hasUnread && (
                          <span className={styles.unreadBadge}>
                            {c.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MessagesContent;
