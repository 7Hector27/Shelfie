import React, { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import {
  OpenLibraryWork,
  OpenLibraryAuthor,
  OpenLibraryDescription,
} from "@/util/types";

import Layout from "../../components/Layout";
import BookSkeleton from "@/components/BookSkeleton";
import BookStatusDropdown from "@/components/BookStatusDropdown";

import { apiGet } from "@/lib/api";
import { redirectTo } from "@/util/clientUtils";

import styles from "./BookContent.module.scss";

/* =====================
   Helpers
===================== */

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

/* =====================
   Component
===================== */

const BookContent = () => {
  const router = useRouter();

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isAuthorExpanded, setIsAuthorExpanded] = useState(false);

  const id = useMemo(() => {
    const raw = router.query.id;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [router.query.id]);

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
    queryFn: () => apiGet<OpenLibraryWork>(`/openlibrary/works/${id}`),
    enabled: typeof id === "string",
  });

  const authorId = bookData?.authors?.[0]?.author?.key;

  const { data: authorData, isLoading: isLoadingAuthor } = useQuery({
    queryKey: ["author", authorId],
    queryFn: () =>
      apiGet<OpenLibraryAuthor>(
        `/openlibrary/authors?key=${encodeURIComponent(authorId as string)}`,
      ),
    enabled: typeof authorId === "string",
  });

  /* =====================
     Guards
  ===================== */

  if (isLoading || isLoadingAuthor)
    return (
      <Layout>
        <BookSkeleton />
      </Layout>
    );
  if (isError) return <p>{(error as Error).message}</p>;

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
            <p onClick={() => redirectTo(`${authorId}`)}>{authorData?.name}</p>

            <div className={styles.ratingTop}>
              <div className={styles.starsRow}>
                <div className={styles.stars}>
                  <span className={styles.filled}>★</span>
                  <span className={styles.filled}>★</span>
                  <span className={styles.filled}>★</span>
                  <span className={styles.filled}>★</span>
                  <span className={styles.empty}>★</span>
                </div>
                <span className={styles.ratingNumber}>4.09</span>
              </div>
            </div>

            <BookStatusDropdown
              bookId={id as string}
              externalSource="open_library"
              book={{
                title: bookData?.title,
                author: authorData?.name,
                description: formatDescription(bookData?.description),
                cover_url: bookImageUrl,
                author_id: authorId,
              }}
            />
          </div>
        </div>

        {bookData?.description && (
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
        )}

        <div className={styles.shelves}>
          <div>
            <p className={styles.count}>1248</p>
            <p className={styles.text}>Currently Reading</p>
          </div>
          <div>
            <p className={styles.count}>5321</p>
            <p className={styles.text}>Want to read</p>
          </div>
        </div>

        {authorData?.bio && (
          <div
            className={`${styles.authorInfo} ${
              isAuthorExpanded ? styles.expanded : ""
            }`}
          >
            <p className={styles.aboutTheAuthor}>
              {!!formatAuthorBio(authorData?.bio)
                ? "About the Author"
                : "Author"}
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

            <p className={styles.authorBio}>
              {formatAuthorBio(authorData?.bio)}
            </p>

            {!!formatAuthorBio(authorData?.bio) && (
              <button
                className={styles.readMore}
                onClick={() => setIsAuthorExpanded((p) => !p)}
              >
                {isAuthorExpanded ? "Read less" : "Read more"}
              </button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookContent;
