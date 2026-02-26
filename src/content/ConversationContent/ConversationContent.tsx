import React, { useMemo, useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import Layout from "@/components/Layout";
import { apiGet, apiPost } from "@/lib/api";
import { useAuth } from "@/context/AuthProvider";
import { socket } from "../../lib/socket";

import styles from "./ConversationContent.module.scss";

type ConversationFriend = {
  id: string;
  first_name: string;
  last_name: string;
  profile_image: string | null;
};

type ConversationMessage = {
  id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

type GetConversationResponse = {
  friend: ConversationFriend;
  messages: ConversationMessage[];
  friend_last_read_at: string | null;
};

const ConversationContent = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { conversationId } = router.query;
  const { user } = useAuth();

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const [message, setMessage] = useState("");

  const currentUserId = user?.user_id;

  const canFetch =
    typeof conversationId === "string" && conversationId.length > 0;

  /* ============================= */
  /* FETCH CONVERSATION */
  /* ============================= */

  const fetchConversation = async (): Promise<GetConversationResponse> => {
    return apiGet(`/messages/${conversationId}`);
  };

  const { data, isLoading } = useQuery<GetConversationResponse>({
    queryKey: ["conversation", conversationId],
    queryFn: fetchConversation,
    enabled: canFetch,
  });

  /* ============================= */
  /* FRIEND NAME */
  /* ============================= */

  const friendName = useMemo(() => {
    if (!data?.friend) return "";
    return `${data.friend.first_name} ${data.friend.last_name}`;
  }, [data?.friend]);

  /* ============================= */
  /* SCROLL */
  /* ============================= */

  const scrollToBottom = (smooth = true) => {
    bottomRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  };

  useEffect(() => {
    scrollToBottom(true);
  }, [data?.messages?.length]);

  /* ============================= */
  /* MARK AS READ */
  /* ============================= */

  const markReadMutation = useMutation({
    mutationFn: () => apiPost(`/messages/${conversationId}/read`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  useEffect(() => {
    if (!canFetch || !data) return;
    markReadMutation.mutate();
  }, [canFetch, data]);

  /* ============================= */
  /* SOCKET REAL-TIME */
  /* ============================= */

  useEffect(() => {
    if (typeof conversationId !== "string") return;

    socket.emit("join_conversation", conversationId);

    const handleNewMessage = (newMessage: ConversationMessage) => {
      queryClient.setQueryData<GetConversationResponse>(
        ["conversation", conversationId],
        (old) => {
          if (!old) return old;

          const exists = old.messages.some((m) => m.id === newMessage.id);
          if (exists) return old;

          return {
            ...old,
            messages: [...old.messages, newMessage],
          };
        },
      );

      if (newMessage.sender_id !== currentUserId) {
        markReadMutation.mutate();
      }

      scrollToBottom(true);
    };

    const handleConversationRead = ({
      userId,
      last_read_at,
    }: {
      userId: string;
      last_read_at: string;
    }) => {
      if (userId === currentUserId) return;

      queryClient.setQueryData<GetConversationResponse>(
        ["conversation", conversationId],
        (old) => {
          if (!old) return old;

          return {
            ...old,
            friend_last_read_at: last_read_at,
          };
        },
      );
    };

    socket.on("new_message", handleNewMessage);
    socket.on("conversation_read", handleConversationRead);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("conversation_read", handleConversationRead);
    };
  }, [conversationId, currentUserId, queryClient]);

  /* ============================= */
  /* SEND MESSAGE */
  /* ============================= */

  const sendMessageMutation = useMutation<ConversationMessage, Error, string>({
    mutationFn: (text: string) =>
      apiPost(`/messages/${conversationId}`, { body: text }),
  });

  const handleSend = () => {
    if (!message.trim()) return;
    sendMessageMutation.mutate(message.trim());
    setMessage("");
  };

  /* ============================= */
  /* SEEN LOGIC */
  /* ============================= */

  const myMessages =
    data?.messages?.filter((m) => m.sender_id === currentUserId) ?? [];

  const lastSentMessage =
    myMessages.length > 0 ? myMessages[myMessages.length - 1] : null;

  /* ============================= */
  /* RENDER */
  /* ============================= */

  return (
    <Layout>
      <div className={styles.wrapper}>
        {/* ================= HEADER ================= */}
        <div className={styles.header}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={() => router.push("/messages")}
          >
            ←
          </button>

          <div className={styles.headerInfo}>
            <div className={styles.avatar}>
              {data?.friend?.profile_image ? (
                <img
                  src={data.friend.profile_image}
                  alt={friendName}
                  className={styles.avatarImg}
                />
              ) : (
                <span className={styles.avatarFallback}>
                  {data?.friend?.first_name?.charAt(0) ?? "?"}
                </span>
              )}
            </div>

            <div>
              <div className={styles.name}>{friendName}</div>
              <div className={styles.subText}>Friends on Shelfie</div>
            </div>
          </div>
        </div>

        {/* ================= BODY ================= */}
        <div className={styles.body} ref={messagesContainerRef}>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div className={styles.messages}>
              {data?.messages.map((m) => {
                const isMine = !!currentUserId && m.sender_id === currentUserId;

                const isSeen =
                  isMine &&
                  lastSentMessage &&
                  m.id === lastSentMessage.id &&
                  data?.friend_last_read_at &&
                  new Date(m.created_at) <= new Date(data.friend_last_read_at);

                return (
                  <div
                    key={m.id}
                    className={`${styles.messageRow} ${
                      isMine ? styles.mine : styles.theirs
                    }`}
                  >
                    <div className={styles.messageInner}>
                      {!isMine && (
                        <div className={styles.messageAvatar}>
                          {data?.friend?.profile_image ? (
                            <img
                              src={data.friend.profile_image}
                              alt={friendName}
                              className={styles.avatarImg}
                            />
                          ) : (
                            <span className={styles.avatarFallback}>
                              {data?.friend?.first_name?.charAt(0) ?? "?"}
                            </span>
                          )}
                        </div>
                      )}

                      <div className={styles.messageContent}>
                        <div className={styles.bubble}>{m.body}</div>

                        <div className={styles.metaRow}>
                          <span className={styles.time}>
                            {new Date(m.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>

                          {isSeen && (
                            <span className={styles.seenIndicator}>Seen</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* ================= COMPOSER ================= */}
        <div className={styles.composer}>
          <input
            className={styles.input}
            placeholder="Message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <button
            className={styles.sendBtn}
            disabled={!message.trim()}
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default ConversationContent;
