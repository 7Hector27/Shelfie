import React, { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

import Layout from "@/components/Layout";
import AuthorSkeleton from "@/components/AuthorSkeleton";

import { apiGet } from "@/lib/api";
import { redirectTo } from "@/util/clientUtils";

import styles from "./AuthorContent.module.scss";

export interface OpenLibraryAuthor {
  name: string;
  personal_name?: string;
  birth_date?: string;
  bio?: { value: string } | string;
  photos?: number[];
  alternate_names?: string[];
  remote_ids?: Record<string, string>;
  links?: { title: string; url: string }[];
  key: string;
  last_modified?: { value: string };
}

interface OpenLibraryAuthorWork {
  key: string; // "/works/OLxxxxxW"
  title: string;
  covers?: number[];
  first_publish_date?: string;
  edition_count?: number;
}

interface OpenLibraryAuthorWorksResponse {
  entries: OpenLibraryAuthorWork[];
  size?: number;
  links?: { next?: string; prev?: string };
}

/* =========================
   FETCHERS
========================= */

const fetchAuthor = async (key: string): Promise<OpenLibraryAuthor> =>
  apiGet(`/openlibrary/authors?key=${encodeURIComponent(key)}`);

const fetchAuthorWorks = async (
  authorId: string,
  limit = 100,
  offset = 0,
): Promise<OpenLibraryAuthorWorksResponse> => {
  const res = await fetch(
    `https://openlibrary.org/authors/${encodeURIComponent(
      authorId,
    )}/works.json?limit=${limit}&offset=${offset}`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch author works");
  }

  return res.json();
};

/* =========================
   COMPONENT
========================= */

const AuthorPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [isAuthorExpanded, setIsAuthorExpanded] = useState(false);

  /* -------------------------
     Build author key safely
  ------------------------- */
  const key = useMemo(() => {
    if (!id) return null;
    return `/authors/${id}`;
  }, [id]);

  /* -------------------------
     AUTHOR QUERY
  ------------------------- */
  const {
    data: authorData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["author", key],
    queryFn: () => fetchAuthor(key as string),
    enabled: !!key,
  });

  /* -------------------------
     AUTHOR WORKS QUERY
  ------------------------- */
  const { data: authorWorksData } = useQuery({
    queryKey: ["authorWorks", id],
    queryFn: () => fetchAuthorWorks(id as string, 100, 0),
    enabled: !!id,
  });

  /* -------------------------
     DERIVED DATA
  ------------------------- */

  const formattedBio = useMemo(() => {
    if (!authorData?.bio) return "";
    if (typeof authorData.bio === "string") return authorData.bio;
    return authorData.bio.value;
  }, [authorData]);

  const authorImageUrl = useMemo(() => {
    if (!authorData?.photos?.[0]) return null;
    return `https://covers.openlibrary.org/a/id/${authorData.photos[0]}-L.jpg`;
  }, [authorData]);

  const topPicks = useMemo(() => {
    if (!authorWorksData?.entries) return [];

    return authorWorksData.entries
      .filter((work) => work.covers?.length)
      .sort((a, b) => (b.edition_count || 0) - (a.edition_count || 0))
      .slice(0, 12);
  }, [authorWorksData]);

  /* -------------------------
     CAROUSEL CONTROLS
  ------------------------- */

  const carouselRef = useRef<HTMLDivElement | null>(null);

  const scrollLeft = () => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: -420, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: 420, behavior: "smooth" });
  };

  /* -------------------------
     LOADING / ERROR
  ------------------------- */

  // with:
  if (isLoading)
    return (
      <Layout>
        <AuthorSkeleton />
      </Layout>
    );

  if (isError || !authorData) return <Layout>Author not found</Layout>;

  /* =========================
     RENDER
  ========================= */

  return (
    <Layout>
      <div className={styles.authorPage}>
        {/* =========================
            AUTHOR CARD
        ========================= */}
        <section
          className={`${styles.authorInfo} ${
            isAuthorExpanded ? styles.expanded : ""
          }`}
        >
          <p className={styles.sectionTitle}>
            {formattedBio ? "About the Author" : "Author"}
          </p>

          <div className={styles.authorDetails}>
            <div className={styles.authorPhoto}>
              <Image
                src={authorImageUrl || "/images/book-placeholder.webp"}
                alt={authorData.name}
                width={140}
                height={180}
                unoptimized={!!authorImageUrl}
              />
            </div>

            <div className={styles.authorMeta}>
              <h1 className={styles.authorName}>{authorData.name}</h1>

              {authorData.birth_date && (
                <p className={styles.birthDate}>Born {authorData.birth_date}</p>
              )}
            </div>
          </div>

          {formattedBio && (
            <>
              <p className={styles.authorBio}>{formattedBio}</p>

              <button
                className={styles.readMore}
                onClick={() => setIsAuthorExpanded((prev) => !prev)}
              >
                {isAuthorExpanded ? "Read less" : "Read more"}
              </button>
            </>
          )}
        </section>

        {/* =========================
            TOP PICKS (CAROUSEL)
        ========================= */}
        {topPicks.length > 0 && (
          <section className={styles.topPicks}>
            <div className={styles.topPicksHeader}>
              <h2>Top Picks</h2>

              <div className={styles.carouselControls}>
                <button
                  type="button"
                  onClick={scrollLeft}
                  aria-label="Scroll left"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={scrollRight}
                  aria-label="Scroll right"
                >
                  →
                </button>
              </div>
            </div>

            <div ref={carouselRef} className={styles.topPicksRow}>
              {topPicks.map((work) => {
                const workId = work.key.replace("/works/", "");

                return (
                  <div
                    key={work.key}
                    className={styles.bookCard}
                    onClick={() => redirectTo(`/book/${workId}`)}
                  >
                    <Image
                      src={`https://covers.openlibrary.org/b/id/${work.covers?.[0]}-L.jpg`}
                      alt={work.title}
                      width={180}
                      height={270}
                      unoptimized
                    />
                    <p className={styles.bookTitle}>{work.title}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* =========================
            IDENTIFIERS
        ========================= */}
        {authorData.remote_ids && (
          <section className={styles.identifiers}>
            <h2>Identifiers</h2>
            <div className={styles.idGrid}>
              {Object.entries(authorData.remote_ids).map(([idKey, value]) => (
                <div key={idKey} className={styles.idRow}>
                  <span className={styles.idKey}>{idKey}</span>
                  <span className={styles.idValue}>{value}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default AuthorPage;
