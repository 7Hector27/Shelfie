import React, { useMemo, useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import Layout from "@/components/Layout";
import ConversationSkeleton from "@/components/ConversationSkeleton";

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
  sender_id: string | null;
  body: string;
  created_at: string;
};

type GetConversationResponse = {
  is_ai: boolean;
  friend: ConversationFriend | null;
  friend_last_read_at: string | null;
  book_title: string | null;
  book_author: string | null;
  messages: ConversationMessage[];
};

const ConversationContent = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { conversationId } = router.query;
  const { user } = useAuth();

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const [message, setMessage] = useState("");
  const [streamingText, setStreamingText] = useState<string | null>(null);

  const currentUserId = user?.user_id;

  const canFetch =
    typeof conversationId === "string" && conversationId.length > 0;

  /* ============================= */
  /* FETCH CONVERSATION            */
  /* ============================= */

  const { data, isLoading } = useQuery<GetConversationResponse>({
    queryKey: ["conversation", conversationId],
    queryFn: () => apiGet(`/messages/${conversationId}`),
    enabled: canFetch,
  });

  /* ============================= */
  /* DERIVED                       */
  /* ============================= */

  const isAi = data?.is_ai ?? false;

  const displayName = useMemo(() => {
    if (isAi) return data?.book_title ?? "AI";
    if (!data?.friend) return "";
    return `${data.friend.first_name} ${data.friend.last_name}`;
  }, [data, isAi]);

  const avatarFallback = isAi
    ? "📖"
    : (data?.friend?.first_name?.charAt(0) ?? "?");
  const avatarImage = isAi ? null : (data?.friend?.profile_image ?? null);

  /* ============================= */
  /* SCROLL                        */
  /* ============================= */

  const scrollToBottom = (smooth = true) => {
    bottomRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  };

  useEffect(() => {
    scrollToBottom(true);
  }, [data?.messages?.length, streamingText]);

  /* ============================= */
  /* MARK AS READ                  */
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
  /* SOCKET REAL-TIME              */
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
          return { ...old, messages: [...old.messages, newMessage] };
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
          return { ...old, friend_last_read_at: last_read_at };
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
  /* SEND MESSAGE                  */
  /* ============================= */

  const sendNormalMessage = useMutation<ConversationMessage, Error, string>({
    mutationFn: (text: string) =>
      apiPost(`/messages/${conversationId}`, { body: text }),
  });

  const sendAiMessage = async (text: string) => {
    // Optimistically add user message
    const tempUserMsg: ConversationMessage = {
      id: `temp-${Date.now()}`,
      sender_id: currentUserId ?? "",
      body: text,
      created_at: new Date().toISOString(),
    };

    queryClient.setQueryData<GetConversationResponse>(
      ["conversation", conversationId],
      (old) => {
        if (!old) return old;
        return { ...old, messages: [...old.messages, tempUserMsg] };
      },
    );

    setStreamingText("");
    scrollToBottom(true);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const res = await fetch(`${apiUrl}/messages/${conversationId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ body: text }),
    });

    if (!res.body) return;

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      fullText += chunk;
      setStreamingText(fullText);
      scrollToBottom(false);
    }

    // Stream done — add final AI message to query cache and clear streaming state
    const aiMsg: ConversationMessage = {
      id: `ai-${Date.now()}`,
      sender_id: null,
      body: fullText,
      created_at: new Date().toISOString(),
    };

    queryClient.setQueryData<GetConversationResponse>(
      ["conversation", conversationId],
      (old) => {
        if (!old) return old;
        // Replace temp user message with real one + add AI message
        const withoutTemp = old.messages.filter((m) => m.id !== tempUserMsg.id);
        return { ...old, messages: [...withoutTemp, tempUserMsg, aiMsg] };
      },
    );

    setStreamingText(null);
    scrollToBottom(true);
  };

  const handleSend = () => {
    if (!message.trim()) return;
    const text = message.trim();
    setMessage("");

    if (isAi) {
      sendAiMessage(text);
    } else {
      sendNormalMessage.mutate(text);
    }
  };

  /* ============================= */
  /* SEEN LOGIC                    */
  /* ============================= */

  const myMessages =
    data?.messages?.filter((m) => m.sender_id === currentUserId) ?? [];
  const lastSentMessage =
    myMessages.length > 0 ? myMessages[myMessages.length - 1] : null;

  /* ============================= */
  /* RENDER                        */
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
            <div className={`${styles.avatar} ${isAi ? styles.aiAvatar : ""}`}>
              {isLoading ? (
                <span className={styles.avatarFallback}>...</span>
              ) : avatarImage ? (
                <img
                  src={avatarImage}
                  alt={displayName}
                  className={styles.avatarImg}
                />
              ) : (
                <span className={styles.avatarFallback}>{avatarFallback}</span>
              )}
            </div>

            <div>
              <div className={styles.name}>
                {isLoading ? "Loading..." : displayName}
              </div>
              <div className={styles.subText}>
                {isLoading
                  ? ""
                  : isAi
                    ? `by ${data?.book_author}`
                    : "Friends on Shelfie"}
              </div>
            </div>
          </div>
        </div>

        {/* ================= BODY ================= */}
        <div className={styles.body} ref={messagesContainerRef}>
          {isLoading ? (
            <ConversationSkeleton />
          ) : (
            <div className={styles.messages}>
              {data?.messages.map((m) => {
                const isMine = !!currentUserId && m.sender_id === currentUserId;
                const isAiMessage = m.sender_id === null;

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
                    } ${isAiMessage ? styles.aiMessage : ""}`}
                  >
                    <div className={styles.messageInner}>
                      {!isMine && (
                        <div
                          className={`${styles.messageAvatar} ${isAiMessage ? styles.aiAvatar : ""}`}
                        >
                          {isAiMessage ? (
                            <span className={styles.avatarFallback}>📖</span>
                          ) : avatarImage ? (
                            <img
                              src={avatarImage}
                              alt={displayName}
                              className={styles.avatarImg}
                            />
                          ) : (
                            <span className={styles.avatarFallback}>
                              {avatarFallback}
                            </span>
                          )}
                        </div>
                      )}

                      <div className={styles.messageContent}>
                        <div
                          className={`${styles.bubble} ${isAiMessage ? styles.aiBubble : ""}`}
                        >
                          {m.body}
                        </div>

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

              {/* ── Streaming AI response ── */}
              {streamingText !== null && (
                <div className={`${styles.messageRow} ${styles.theirs}`}>
                  <div className={styles.messageInner}>
                    <div
                      className={`${styles.messageAvatar} ${styles.aiAvatar}`}
                    >
                      <span className={styles.avatarFallback}>📖</span>
                    </div>
                    <div className={styles.messageContent}>
                      <div className={`${styles.bubble} ${styles.aiBubble}`}>
                        {streamingText}
                        <span className={styles.cursor}>▋</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* ================= COMPOSER ================= */}
        <div className={styles.composer}>
          <input
            className={styles.input}
            placeholder={isAi ? "Ask about this book..." : "Message..."}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            disabled={streamingText !== null}
          />
          <button
            className={styles.sendBtn}
            disabled={!message.trim() || streamingText !== null}
            onClick={handleSend}
          >
            {streamingText !== null ? "..." : "Send"}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default ConversationContent;
