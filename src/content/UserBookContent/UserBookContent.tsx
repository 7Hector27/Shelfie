import React, { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

import Layout from "@/components/Layout";
import StarRatingDisplay from "@/components/StarRatingDisplay";
import EditBookModal from "@/components/EditBookModal";

import { GetUserBooksResponse } from "@/util/types";
import { apiGet, apiPatch } from "@/lib/api";
import { formatMonthYear } from "@/util/clientUtils";

import styles from "./UserBookContent.module.scss";

const UserBookContent = () => {
  const router = useRouter();
  const { id: userId, shelf, page, favorite } = router.query;
  const isFavorite = favorite === "true";

  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  const currentShelf = (shelf as string) || "";
  const currentPage = (page as string) || "1";

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

  const { data: booksList, pagination, counts } = data || {};
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
    {
      label: "Read",
      value: "completed",
      icon: "🟣",
      count: counts?.read || 0,
    },
    {
      label: "DNF",
      value: "dropped", // IMPORTANT: keep backend value
      icon: "🛑",
      count: counts?.dropped || 0,
    },
  ];
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
  const selectedBook = useMemo(() => {
    if (!selectedBookId) return null;
    return booksList?.find((b) => b.book_id === selectedBookId) ?? null;
  }, [booksList, selectedBookId]);

  const openEdit = (bookId: string) => {
    setSelectedBookId(bookId);
    setIsEditOpen(true);
  };

  const closeEdit = () => {
    setIsEditOpen(false);
    setSelectedBookId(null);
  };
  console.log(data);
  return (
    <Layout>
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
            // TODO: adjust endpoint/body keys to match your backend
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
          {/* ================= LEFT ================= */}
          <div className={styles.libraryMain}>
            {/* Header */}
            <div className={styles.libraryHeader}>
              <h1>My Library</h1>
              <p>
                {pagination?.total || 0} books ·{" "}
                {booksList?.filter((b) => b.status === "reading").length || 0}{" "}
                currently reading
              </p>
            </div>

            {/* Shelf Tabs */}
            <div className={styles.shelfTabs}>
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

            {/* ================= BOOK CARDS ================= */}
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
                } = book;

                return (
                  <div key={book_id} className={styles.bookCard}>
                    {/* TOP ROW */}
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
                        <h2 className={styles.titleRow}>{title}</h2>
                        <p className={styles.largeAuthor}>{author}</p>
                        <span
                          className={`${styles.statusPill} ${styles[status]}`}
                        >
                          {status.replaceAll("_", " ")}
                        </span>
                      </div>{" "}
                    </div>{" "}
                    <div className={styles.ratingBlock}>
                      <StarRatingDisplay rating={rating} />
                    </div>
                    {(date_started || date_finished) && (
                      <p className={styles.dateMeta}>
                        {date_started &&
                          `Started ${formatMonthYear(date_started)}`}
                        {date_started && date_finished && " · "}
                        {date_finished &&
                          `Finished ${formatMonthYear(date_finished)}`}
                      </p>
                    )}
                    {/* RATING */}
                    <div className={styles.cardDivider} />
                    {/* REVIEW SECTION */}
                    <div className={styles.reviewSection}>
                      {review ? (
                        <p> {review}</p>
                      ) : (
                        <>
                          <h4>No review yet</h4>
                        </>
                      )}
                    </div>
                    {/* FOOTER AREA */}
                    <div className={styles.cardFooter}>
                      <button
                        className={styles.quickEditBtn}
                        onClick={() => openEdit(book_id)}
                      >
                        Quick Edit
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ================= PAGINATION ================= */}
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

          {/* ================= RIGHT SIDEBAR ================= */}
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
