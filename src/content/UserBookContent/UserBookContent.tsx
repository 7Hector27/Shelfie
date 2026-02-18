import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

import Layout from "@/components/Layout";
import StarRatingDisplay from "@/components/StarRatingDisplay";

import { GetUserBooksResponse } from "@/util/types";
import { apiGet } from "@/lib/api";

import styles from "./UserBookContent.module.scss";

const SHELVES = [
  { label: "All", value: "", icon: "📚" },
  { label: "Reading", value: "reading", icon: "🟢" },
  { label: "Want", value: "want_to_read", icon: "🩷" },
  { label: "Read", value: "completed", icon: "🟣" },
];

const UserBookContent = () => {
  const router = useRouter();
  const { id: userId, shelf, page } = router.query;

  const currentShelf = (shelf as string) || "";
  const currentPage = (page as string) || "1";

  const { data, isLoading, isError } = useQuery<GetUserBooksResponse>({
    queryKey: ["userBooks", userId, currentShelf, currentPage],
    queryFn: () =>
      apiGet(`/user/${userId}/books?shelf=${currentShelf}&page=${currentPage}`),
    enabled: !!userId,
  });

  const { data: booksList, pagination } = data || {};

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

  return (
    <Layout>
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
                    currentShelf === s.value ? styles.active : ""
                  }`}
                >
                  <span className={styles.icon}>{s.icon}</span>
                  <span>{s.label}</span>
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
                <span>Favorites</span>
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
                        {date_started && `Started ${date_started}`}
                        {date_started && date_finished && " · "}
                        {date_finished && `Finished ${date_finished}`}
                      </p>
                    )}
                    {/* RATING */}
                    <div className={styles.cardDivider} />
                    {/* REVIEW SECTION */}
                    <div className={styles.reviewSection}>
                      {review ? (
                        <p>{review}</p>
                      ) : (
                        <>
                          <h4>No review yet</h4>
                        </>
                      )}
                    </div>
                    {/* FOOTER AREA */}
                    <div className={styles.cardFooter}>
                      <button className={styles.quickEditBtn}>
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
