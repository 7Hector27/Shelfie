import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

import Layout from "../Layout";

import styles from "./BookContent.module.scss";

const BookContent = () => {
  const { query } = useRouter();
  const id = Array.isArray(query.id) ? query.id[0] : query.id;
  const [isDescriptionExpanded, setIsDescriptionExpanded] =
    React.useState(false);
  const [isAuthorExpanded, setIsAuthorExpanded] = React.useState(false);

  const fetchWork = async (id: string) => {
    const res = await fetch(`https://openlibrary.org/works/${id}.json`);
    if (!res.ok) throw new Error("Failed to fetch work");
    return res.json();
  };

  const fetchAuthor = async (authorKey: string) => {
    const res = await fetch(`https://openlibrary.org${authorKey}.json`);
    if (!res.ok) throw new Error("Failed to fetch author");
    return res.json();
  };
  type OpenLibraryDescription = string | { value?: string } | undefined;

  const formatDescription = (
    description: OpenLibraryDescription,
  ): string | null => {
    if (!description) return null;

    if (typeof description === "string") {
      return description.trim();
    }

    if (typeof description === "object" && "value" in description) {
      return description.value?.trim() || null;
    }

    return null;
  };
  const {
    data: bookData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["bookData", id],
    queryFn: () => fetchWork(id as string),
    enabled: !!id,
  });

  const authorId = bookData?.authors?.[0]?.author?.key;
  const { title, description } = bookData || {};
  const coverId = bookData?.covers?.[0];
  const bookImageUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
    : null;
  const { data: authorData, isLoading: isLoadingAuthor } = useQuery({
    queryKey: ["author", authorId],
    queryFn: () => fetchAuthor(authorId as string),
    enabled: !!authorId,
  });

  const {
    bio: authorBio,
    birth_date: authorBirthDate,
    name: authorName,
    photos: authorPhotos,
  } = authorData || {};
  const authorPhotoId = authorPhotos?.[0];
  const authorImageUrl = authorPhotoId
    ? `https://covers.openlibrary.org/b/id/${authorPhotoId}-L.jpg`
    : null;

  if (isLoading || isLoadingAuthor) return <p>Loading…</p>;
  if (isError) return <p>{(error as Error).message}</p>;
  console.log(bookData);
  console.log(authorData, "authorData");
  return (
    <Layout>
      <div className={styles.bookContent}>
        <div className={styles.bookDetailsWrapper}>
          {bookImageUrl ? (
            <Image
              src={bookImageUrl}
              alt="Book Cover"
              width={200}
              height={300}
              unoptimized
            />
          ) : (
            <Image
              src="/images/book-placeholder.webp"
              alt="Book Cover"
              width={200}
              height={300}
            />
          )}

          <div className={styles.bookDetails}>
            <h2> {title}</h2>
            <p>{authorData?.name}</p>
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
            <div className={`${styles.buttons} ${styles.want}`}>
              <button className={styles.actionBtn}>Want to Read</button>
              <button className={styles.dropdownBtn}>▼</button>
            </div>
          </div>
        </div>
        <div
          className={`${styles.description} ${
            isDescriptionExpanded ? styles.expanded : ""
          }`}
        >
          <p>{formatDescription(description)}</p>

          <button
            className={styles.readMore}
            onClick={() => setIsDescriptionExpanded((prev) => !prev)}
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
          <p className={styles.aboutTheAuthor}>About the Author</p>

          <div className={styles.authorDetails}>
            <div className={styles.authorPhoto}>
              <Image
                src={authorImageUrl || "/images/bopk-placeholder.webp"}
                alt="Author Photo"
                width={100}
                height={150}
                unoptimized={!!authorImageUrl}
              />
            </div>

            <div className={styles.authorText}>
              <p>{authorName}</p>
              <p>{authorBirthDate}</p>
            </div>
          </div>
          <p className={styles.authorBio}>{authorBio?.value ?? authorBio}</p>

          <button
            className={styles.readMore}
            onClick={() => setIsAuthorExpanded((prev) => !prev)}
          >
            {isAuthorExpanded ? "Read less" : "Read more"}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default BookContent;
