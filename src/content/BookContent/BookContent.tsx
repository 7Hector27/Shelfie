import React, { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Status,
  OpenLibraryWork,
  OpenLibraryAuthor,
  OpenLibraryDescription,
} from "@/util/types";
import Layout from "../../components/Layout";

import { apiGet, apiPost, apiDelete } from "@/lib/api";

import styles from "./BookContent.module.scss";

const formatAuthorBio = (
  bio: string | { value?: string } | undefined,
): string | null => {
  if (!bio) return null;
  if (typeof bio === "string") return bio.trim();
  return bio.value?.trim() || null;
};

const formatDescription = (
  description: OpenLibraryDescription,
): string | null => {
  if (!description) return null;
  if (typeof description === "string") return description.trim();
  return description.value?.trim() || null;
};

const isStatus = (value: unknown): value is Status =>
  value === "want_to_read" || value === "reading" || value === "completed";

/* =====================
   Component
===================== */

const BookContent = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isAuthorExpanded, setIsAuthorExpanded] = useState(false);

  const labelMap: Record<Status, string> = {
    want_to_read: "Want to Read",
    reading: "Currently Reading",
    completed: "Read",
  };

  const id = useMemo(() => {
    const raw = router.query.id;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [router.query.id]);

  /* =====================
     Fetchers
  ===================== */

  const fetchWork = async (workId: string): Promise<OpenLibraryWork> =>
    apiGet(`/openlibrary/works/${workId}`);

  const fetchAuthor = async (key: string): Promise<OpenLibraryAuthor> =>
    apiGet(`/openlibrary/authors?key=${encodeURIComponent(key)}`);

  const fetchUserBookStatus = async (
    bookId: string,
  ): Promise<Status | null> => {
    try {
      const res = await apiGet<{ status: string | null }>(
        `/userbooks/getBookById/${bookId}`,
      );
      return isStatus(res.status) ? res.status : null;
    } catch {
      return null;
    }
  };

  const removeUserBook = async (bookId: string) => {
    try {
      await apiDelete(`/userbooks/${bookId}`);
      queryClient.invalidateQueries({
        queryKey: ["userBookStatus", bookId],
      });
    } catch (error) {
      console.error("Failed to remove book:", error);
    }
  };

  /* =====================
     Queries
  ===================== */

  const {
    data: bookData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["bookData", id],
    queryFn: () => fetchWork(id as string),
    enabled: typeof id === "string",
  });

  const authorId = bookData?.authors?.[0]?.author?.key;

  const { data: authorData, isLoading: isLoadingAuthor } = useQuery({
    queryKey: ["author", authorId],
    queryFn: () => fetchAuthor(authorId as string),
    enabled: typeof authorId === "string",
  });

  const { data: userBookStatus } = useQuery({
    queryKey: ["userBookStatus", id],
    queryFn: () => fetchUserBookStatus(id as string),
    enabled: typeof id === "string",
  });

  const status: Status = userBookStatus ?? "want_to_read";

  /* =====================
     Mutation
  ===================== */

  const upsertUserBook = useMutation({
    mutationFn: (nextStatus: Status) =>
      apiPost("/userbooks", {
        external_book_id: id,
        external_source: "open_library",
        status: nextStatus,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userBookStatus", id],
      });
    },
  });

  const saveStatus = (nextStatus: Status) => {
    setIsOpen(false);
    upsertUserBook.mutate(nextStatus);
  };

  /* =====================
     Guards
  ===================== */

  if (isLoading || isLoadingAuthor) return <p>Loading…</p>;
  if (isError) return <p>{(error as Error).message}</p>;

  /* =====================
     Derived UI
  ===================== */

  const coverId = bookData?.covers?.[0];
  const bookImageUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
    : null;

  const authorPhotoId = authorData?.photos?.[0];
  const authorImageUrl = authorPhotoId
    ? `https://covers.openlibrary.org/b/id/${authorPhotoId}-L.jpg`
    : null;

  /* =====================
     Render
  ===================== */

  return (
    <Layout>
      <div className={styles.bookContent}>
        <div className={styles.bookDetailsWrapper}>
          <Image
            src={bookImageUrl || "/images/book-placeholder.webp"}
            alt="Book Cover"
            width={200}
            height={300}
            unoptimized={!!bookImageUrl}
          />

          <div className={styles.bookDetails}>
            <h2>{bookData?.title}</h2>
            <p>{authorData?.name}</p>

            <div className={styles.statusWrapper}>
              <div className={`${styles.buttons} ${styles[status]}`}>
                <button
                  className={styles.actionBtn}
                  onClick={() => saveStatus(status)}
                  disabled={upsertUserBook.isPending}
                >
                  {labelMap[status]}
                </button>

                <button
                  className={styles.dropdownBtn}
                  onClick={() => setIsOpen((p) => !p)}
                  disabled={upsertUserBook.isPending}
                >
                  ▼
                </button>
              </div>

              {isOpen && (
                <div className={styles.dropdown}>
                  {(["want_to_read", "reading", "completed"] as Status[]).map(
                    (s) => (
                      <button
                        key={s}
                        className={status === s ? styles.active : ""}
                        onClick={() => saveStatus(s)}
                      >
                        {labelMap[s]}
                      </button>
                    ),
                  )}
                  {userBookStatus && (
                    <button onClick={() => removeUserBook(id as string)}>
                      Remove from my shelf
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          className={`${styles.description} ${
            isDescriptionExpanded ? styles.expanded : ""
          }`}
        >
          <p>{formatDescription(bookData?.description)}</p>
          <button
            className={styles.readMore}
            onClick={() => setIsDescriptionExpanded((p) => !p)}
          >
            {isDescriptionExpanded ? "Read less" : "Read more"}
          </button>
        </div>
        <div className={styles.shelves}>
          <div>
            <p className={styles.count}>1248</p>
            <p className={styles.text}>Currently Reading </p>
          </div>
          <div>
            <p className={styles.count}>5321</p>
            <p className={styles.text}>Want to read</p>
          </div>
        </div>
        <div
          className={`${styles.authorInfo} ${
            isAuthorExpanded ? styles.expanded : ""
          }`}
        >
          <p className={styles.aboutTheAuthor}>
            {!!formatAuthorBio(authorData?.bio) ? "About the Author" : "Author"}
          </p>

          <div className={styles.authorDetails}>
            <div className={styles.authorPhoto}>
              <Image
                src={authorImageUrl || "/images/book-placeholder.webp"}
                alt="Author"
                width={100}
                height={150}
                unoptimized={!!authorImageUrl}
              />
            </div>
            <div>
              <p>{authorData?.name}</p>
              <p>{authorData?.birth_date}</p>
            </div>
          </div>

          <p className={styles.authorBio}>{formatAuthorBio(authorData?.bio)}</p>

          {!!formatAuthorBio(authorData?.bio) && (
            <button
              className={styles.readMore}
              onClick={() => setIsAuthorExpanded((p) => !p)}
            >
              {isAuthorExpanded ? "Read less" : "Read more"}
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BookContent;
