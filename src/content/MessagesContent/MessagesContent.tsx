import React, { useState } from "react";
import Image from "next/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";

import Layout from "@/components/Layout";
import FriendPicker from "@/components/FriendPicker";
import ConfirmationModal from "@/components/ConfirmationModal";

import { apiGet, apiDelete } from "@/lib/api";

import styles from "./MessagesContent.module.scss";

type ConversationListItem = {
  conversation_id: string;
  is_ai: boolean;
  book_title: string | null;
  book_author: string | null;
  friend_id: string | null;
  first_name: string | null;
  last_name: string | null;
  profile_image: string | null;
  last_message: string | null;
  last_message_at: string | null;
  sender_id: string | null;
  unread_count: number;
};

const MessagesContent = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [showPicker, setShowPicker] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<
    string | null
  >(null);

  const getUserConversations = async (): Promise<ConversationListItem[]> => {
    return apiGet("/messages");
  };

  const { data, isLoading } = useQuery<ConversationListItem[]>({
    queryKey: ["conversations"],
    queryFn: getUserConversations,
  });

  const conversations = data ?? [];

  const handleDeleteConversation = async () => {
    if (!conversationToDelete) return;

    try {
      await apiDelete(`/messages/conversation/${conversationToDelete}`);

      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });

      setConversationToDelete(null);
    } catch (err) {
      console.error("Failed to delete conversation", err);
    }
  };

  const goToConversation = (conversationId: string) => {
    router.push(`/messages/${conversationId}`);
  };

  return (
    <Layout>
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!conversationToDelete}
        onClose={() => setConversationToDelete(null)}
        title="Delete conversation?"
        copy="This will remove the conversation from your messages."
        confirmCopy="Delete"
        cancelCopy="Cancel"
        onConfirm={handleDeleteConversation}
      />

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
                const isAi = c.is_ai;

                const displayName = isAi
                  ? (c.book_title ?? "AI Chat")
                  : `${c.first_name} ${c.last_name}`;

                const avatarLetter = isAi
                  ? "📖"
                  : (c.first_name?.charAt(0) ?? "?");

                return (
                  <div
                    key={c.conversation_id}
                    className={`${styles.conversationCard} ${
                      hasUnread ? styles.unreadCard : ""
                    } ${isAi ? styles.aiCard : ""}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => goToConversation(c.conversation_id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        goToConversation(c.conversation_id);
                      }
                    }}
                  >
                    <div className={styles.avatar}>
                      {!isAi && c.profile_image ? (
                        <Image
                          src={c.profile_image}
                          alt={displayName}
                          className={styles.avatarImg}
                          width={100}
                          height={100}
                        />
                      ) : (
                        <span className={styles.avatarFallback}>
                          {avatarLetter}
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
                          {displayName}
                        </span>

                        <div className={styles.rightActions}>
                          <span className={styles.timestamp}>
                            {c.last_message_at
                              ? new Date(c.last_message_at).toLocaleDateString()
                              : ""}
                          </span>

                          <button
                            type="button"
                            className={styles.deleteBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              setConversationToDelete(c.conversation_id);
                            }}
                            aria-label="Delete conversation"
                            title="Delete conversation"
                          >
                            <Image
                              src="/images/trash-white.webp"
                              alt="Delete"
                              width={14}
                              height={14}
                            />
                          </button>
                        </div>
                      </div>

                      <div className={styles.bottomRow}>
                        <div
                          className={`${styles.preview} ${
                            hasUnread ? styles.unreadText : ""
                          }`}
                        >
                          {isAi
                            ? (c.last_message ?? `Chat about ${c.book_author}`)
                            : (c.last_message ?? "")}
                        </div>

                        {hasUnread && (
                          <span className={styles.unreadBadge}>
                            {c.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
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
