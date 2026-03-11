import React, { useMemo, useState, useRef, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";

import Layout from "@/components/Layout";
import StarRatingDisplay from "@/components/StarRatingDisplay";
import EditBookModal from "@/components/EditBookModal";
import ConfirmationModal from "@/components/ConfirmationModal";
import UserBookSkeleton from "@/components/UserBookSkeleton";

import { GetUserBooksResponse } from "@/util/types";
import { apiGet, apiPatch, apiDelete, apiPost } from "@/lib/api";
import { formatMonthYear, redirectTo, toPossessive } from "@/util/clientUtils";
import { useAuth } from "@/context/AuthProvider";

import styles from "./UserBookContent.module.scss";

type StartAiChatResponse = {
  conversation_id: string;
};
const UserBookContent = () => {
  const { user: owner, loading } = useAuth();

  const router = useRouter();
  const { id: userId, shelf, page, favorite } = router.query;
  const isOwner = userId === owner?.user_id;

  const currentShelf = (shelf as string) || "";
  const currentPage = (page as string) || "1";
  const isFavorite = favorite === "true";

  const queryClient = useQueryClient();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);

  const tabsRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError } = useQuery<GetUserBooksResponse>({
    queryKey: ["userBooks", userId, currentShelf, currentPage, isFavorite],
    queryFn: () =>
      apiGet(
        `/user/${userId}/books?shelf=${currentShelf}${
          isFavorite ? "&favorite=true" : ""
        }&page=${currentPage}`,
      ),
    enabled: !!userId,
  });

  const { data: booksList, pagination, counts, profile } = data || {};
  const { first_name } = profile || {};

  const selectedBook = useMemo(() => {
    if (!selectedBookId) return null;
    return booksList?.find((b) => b.book_id === selectedBookId) ?? null;
  }, [booksList, selectedBookId]);

  const SHELVES = [
    { label: "All", value: "", icon: "📚", count: counts?.total || 0 },
    {
      label: "Currently Reading",
      value: "reading",
      icon: "🟢",
      count: counts?.currentlyReading || 0,
    },
    {
      label: "Want to Read",
      value: "want_to_read",
      icon: "🩷",
      count: counts?.wantToRead || 0,
    },
    { label: "Read", value: "completed", icon: "🟣", count: counts?.read || 0 },
    { label: "DNF", value: "dropped", icon: "🛑", count: counts?.dropped || 0 },
  ];

  const statusLabel: Record<string, string> = {
    reading: "Reading",
    want_to_read: "Want to Read",
    completed: "Read",
    dropped: "Dropped",
  };

  const changeShelf = (newShelf: string) => {
    router.push({
      pathname: `/user/books/${userId}`,
      query: { shelf: newShelf, page: 1 },
    });
  };

  const changePage = (newPage: number) => {
    router.push({
      pathname: `/user/books/${userId}`,
      query: { shelf: currentShelf, page: newPage },
    });
  };

  const openEdit = (bookId: string) => {
    setSelectedBookId(bookId);
    setIsEditOpen(true);
  };

  const closeEdit = () => {
    setIsEditOpen(false);
    setSelectedBookId(null);
  };

  const handleDeleteBook = async () => {
    if (!bookToDelete) return;
    await apiDelete(`/userbooks/${bookToDelete}`);
    queryClient.invalidateQueries({
      queryKey: ["userBooks", userId, currentShelf, currentPage, isFavorite],
    });
    setBookToDelete(null);
  };

  const handleStartAiChat = async (book: {
    title: string;
    author: string | null;
  }) => {
    try {
      const res = (await apiPost("/messages/start-ai", {
        title: book.title,
        author: book.author ?? "Unknown",
        description: null,
      })) as StartAiChatResponse;
      router.push(`/messages/${res.conversation_id}`);
    } catch (err) {
      console.error("Failed to start AI chat:", err);
    }
  };

  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDown = true;
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };
    const handleMouseUp = () => (isDown = false);
    const handleMouseLeave = () => (isDown = false);
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      el.scrollLeft = scrollLeft - (x - startX) * 1.5;
    };

    el.addEventListener("mousedown", handleMouseDown);
    el.addEventListener("mouseup", handleMouseUp);
    el.addEventListener("mouseleave", handleMouseLeave);
    el.addEventListener("mousemove", handleMouseMove);

    return () => {
      el.removeEventListener("mousedown", handleMouseDown);
      el.removeEventListener("mouseup", handleMouseUp);
      el.removeEventListener("mouseleave", handleMouseLeave);
      el.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  if (isLoading)
    return (
      <Layout>
        <UserBookSkeleton />
      </Layout>
    );

  return (
    <Layout>
      <ConfirmationModal
        isOpen={!!bookToDelete}
        onClose={() => setBookToDelete(null)}
        title="Remove from shelf?"
        copy="This will remove the book from all your shelves."
        confirmCopy="Remove"
        cancelCopy="Cancel"
        onConfirm={handleDeleteBook}
      />

      {selectedBook && (
        <EditBookModal
          isOpen={isEditOpen}
          onClose={closeEdit}
          book={{
            title: selectedBook.title,
            author: selectedBook.author || "",
            cover_url: selectedBook.cover_url,
            status: selectedBook.status,
            rating: selectedBook.rating,
            review: selectedBook.review,
            date_started: selectedBook.date_started
              ? selectedBook.date_started.slice(0, 10)
              : null,
            date_finished: selectedBook.date_finished
              ? selectedBook.date_finished.slice(0, 10)
              : null,
            favorite: selectedBook.favorite,
          }}
          onSave={async (values) => {
            await apiPatch(`/userbooks/${selectedBook.id}`, {
              status: values.status,
              rating: values.rating,
              review: values.review,
              date_started: values.date_started,
              date_finished: values.date_finished,
              favorite: values.favorite,
            });
            await queryClient.invalidateQueries({
              queryKey: ["userBooks", userId, currentShelf, currentPage],
            });
          }}
        />
      )}

      <div className={styles.libraryPage}>
        <div className={styles.libraryContainer}>
          <div className={styles.libraryMain}>
            <div className={styles.libraryHeader}>
              <h1>
                {!isOwner
                  ? `${first_name && toPossessive(first_name)} Library`
                  : "My Library"}
              </h1>
              <p>
                {pagination?.total || 0} books ·{" "}
                {booksList?.filter((b) => b.status === "reading").length || 0}{" "}
                currently reading
              </p>
            </div>

            <div className={styles.shelfTabs} ref={tabsRef}>
              {SHELVES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => changeShelf(s.value)}
                  className={`${styles.tab} ${
                    currentShelf === s.value && !router.query.favorite
                      ? styles.active
                      : ""
                  }`}
                >
                  <span className={styles.icon}>{s.icon}</span>
                  <span>
                    {s.label} ({s.count})
                  </span>
                </button>
              ))}
              <button
                onClick={() =>
                  router.push({
                    pathname: `/user/books/${userId}`,
                    query: { favorite: true, page: 1 },
                  })
                }
                className={`${styles.tab} ${
                  router.query.favorite ? styles.active : ""
                }`}
              >
                <span className={styles.icon}>⭐</span>
                <span>Favorites ({counts?.favorites || 0})</span>
              </button>
            </div>

            {isLoading && <p>Loading...</p>}
            {isError && <p>Something went wrong.</p>}

            <div className={styles.bookList}>
              {booksList?.map((book) => {
                const {
                  author,
                  book_id,
                  cover_url,
                  date_finished,
                  date_started,
                  favorite,
                  rating,
                  review,
                  status,
                  title,
                  created_at,
                  author_id,
                } = book;

                return (
                  <div key={book_id} className={styles.bookCard}>
                    {isOwner && (
                      <button
                        className={styles.deleteBtn}
                        onClick={() => setBookToDelete(book_id)}
                        aria-label="Remove book"
                        title="Remove from shelf"
                      >
                        <Image
                          src="/images/trash-white.webp"
                          alt="trash Logo"
                          width={16}
                          height={20}
                        />
                      </button>
                    )}

                    <div className={styles.topRow}>
                      <div className={styles.bookCover}>
                        <Image
                          src={cover_url || "/images/book-placeholder.webp"}
                          alt={title}
                          width={110}
                          height={160}
                          unoptimized={!!cover_url}
                        />
                      </div>
                      <div className={styles.cardBody}>
                        <h2
                          className={styles.titleRow}
                          onClick={() => redirectTo(`/book/${book_id}`)}
                        >
                          {title}
                        </h2>
                        <p
                          className={styles.largeAuthor}
                          onClick={() => redirectTo(`${author_id}`)}
                        >
                          {author}
                        </p>
                        <span
                          className={`${styles.statusPill} ${styles[status]}`}
                        >
                          {statusLabel[status]}
                        </span>
                      </div>
                    </div>

                    <div className={styles.ratingBlock}>
                      <StarRatingDisplay rating={rating} />
                    </div>

                    {(date_started || date_finished || created_at) && (
                      <p className={styles.dateMeta}>
                        {date_started &&
                          `Started ${formatMonthYear(date_started)}`}
                        {date_started && date_finished && " · "}
                        {date_finished &&
                          `Finished ${formatMonthYear(date_finished)}`}
                        {(date_started || date_finished) && " · "}
                        {created_at && `Saved ${formatMonthYear(created_at)}`}
                      </p>
                    )}

                    <div className={styles.cardDivider} />

                    <div className={styles.reviewSection}>
                      {review ? <p>{review}</p> : <h4>No review yet</h4>}
                    </div>

                    {isOwner && (
                      <div className={styles.cardFooter}>
                        <button
                          className={styles.quickEditBtn}
                          onClick={() => openEdit(book_id)}
                        >
                          Quick Edit
                        </button>

                        <button
                          className={styles.chatBtn}
                          onClick={() =>
                            handleStartAiChat({
                              title,
                              author: author ?? null,
                            })
                          }
                        >
                          💬 Chat
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {pagination && (
              <div className={styles.pagination}>
                {pagination.hasPrevPage && (
                  <button onClick={() => changePage(pagination.page - 1)}>
                    Prev
                  </button>
                )}
                <span>
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                {pagination.hasNextPage && (
                  <button onClick={() => changePage(pagination.page + 1)}>
                    Next
                  </button>
                )}
              </div>
            )}
          </div>

          <aside className={styles.librarySidebar}>
            <div className={styles.statsCard}>
              <p>Books this year: 23</p>
              <p>Reading streak: 33 days</p>
              <p>Avg rating: 4.2</p>
              <p>Friends reading: 18</p>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
};

export default UserBookContent;
