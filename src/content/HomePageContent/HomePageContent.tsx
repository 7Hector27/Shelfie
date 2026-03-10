import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import Image from "next/image";

import WelcomeSection from "@/components/WelcomeSection";
import NowReadingSection from "@/components/NowReadingSection";
import ActivityFeed from "@/components/ActivityFeed";
import HomePageSkeleton from "@/components/HomePageSkeleton";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthProvider";

import styles from "./HomePageContent.module.scss";

/* =====================
   Trending Books
===================== */
type TrendingBook = {
  key: string;
  title: string;
  cover_id?: number;
  cover_edition_key?: string;
  authors?: { name: string }[];
};
const fetchTrending = async () => {
  const res = await fetch(
    "https://openlibrary.org/subjects/fiction.json?limit=12",
  );
  if (!res.ok) throw new Error("Failed to fetch");
  const data = await res.json();
  return data.works ?? [];
};

/* =====================
   Landing Page
===================== */

const LandingPage = () => {
  const router = useRouter();

  const { data: books = [] } = useQuery({
    queryKey: ["trendingBooks"],
    queryFn: fetchTrending,
    staleTime: 1000 * 60 * 10,
  });

  return (
    <div className={styles.landing}>
      {/* ── Hero ─────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.eyebrow}>✦ Your reading life, organized</div>
          <h1 className={styles.heroTitle}>
            Track every book.
            <br />
            Share every story.
          </h1>
          <p className={styles.heroSubtitle}>
            Shelfie is your personal reading companion — track what you`ve read,
            discover what to read next, and share your journey with friends.
          </p>
          <div className={styles.heroActions}>
            <button
              className={styles.primaryBtn}
              onClick={() => router.push("/register")}
            >
              Get Started Free
            </button>
            <button
              className={styles.secondaryBtn}
              onClick={() => router.push("/signin")}
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Floating book covers */}
        <div className={styles.heroBooks}>
          {books.slice(0, 3).map((book: TrendingBook, i: number) => {
            const coverId = book.cover_id || book.cover_edition_key;
            const src = coverId
              ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
              : "/images/book-placeholder.webp";
            return (
              <div
                key={book.key}
                className={`${styles.floatingBook} ${styles[`float${i}`]}`}
              >
                <Image
                  src={src}
                  alt={book.title}
                  width={100}
                  height={150}
                  unoptimized
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Features ─────────────────────────────── */}
      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>Everything you need</h2>
        <div className={styles.featureGrid}>
          {[
            {
              icon: "📚",
              title: "Track Your Library",
              desc: "Organize books into shelves — reading, want to read, finished, and more.",
            },
            {
              icon: "🤝",
              title: "Follow Friends",
              desc: "See what your friends are reading and discover books through people you trust.",
            },
            {
              icon: "💬",
              title: "AI Book Chat",
              desc: "Chat with an AI companion about any book — discuss themes, characters, and more.",
            },
            {
              icon: "⭐",
              title: "Rate & Review",
              desc: "Log your thoughts, rate books, and build a record of your reading history.",
            },
          ].map((f) => (
            <div key={f.title} className={styles.featureCard}>
              <span className={styles.featureIcon}>{f.icon}</span>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trending Books ────────────────────────── */}
      {books.length > 0 && (
        <section className={styles.trending}>
          <h2 className={styles.sectionTitle}>Popular Fiction</h2>
          <div className={styles.booksRow}>
            {books.map((book: TrendingBook) => {
              const coverId = book.cover_id || book.cover_edition_key;
              const src = coverId
                ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
                : "/images/book-placeholder.webp";
              const workId = book.key?.replace("/works/", "");
              return (
                <div
                  key={book.key}
                  className={styles.bookCard}
                  onClick={() => router.push(`/book/${workId}`)}
                >
                  <Image
                    src={src}
                    alt={book.title}
                    width={100}
                    height={150}
                    unoptimized
                    className={styles.bookCover}
                  />
                  <p className={styles.bookTitle}>{book.title}</p>
                  <p className={styles.bookAuthor}>
                    {book.authors?.[0]?.name ?? ""}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────── */}
      <section className={styles.cta}>
        <div className={styles.ctaCard}>
          <h2 className={styles.ctaTitle}>Ready to start your shelf?</h2>
          <p className={styles.ctaSubtitle}>
            Join readers who track their books with Shelfie.
          </p>
          <button
            className={styles.primaryBtn}
            onClick={() => router.push("/register")}
          >
            Create Your Free Account
          </button>
        </div>
      </section>
    </div>
  );
};

/* =====================
   Dashboard (logged in)
===================== */

const Dashboard = () => {
  const { isLoading } = useQuery({
    queryKey: ["feed"],
    queryFn: () => fetch("/api/feed").then((r) => r.json()),
    staleTime: 30_000,
  });

  if (isLoading) return <HomePageSkeleton />;

  return (
    <div className={styles.homepage}>
      <WelcomeSection />
      <NowReadingSection />
      <ActivityFeed />
    </div>
  );
};

/* =====================
   HomePageContent
===================== */

const HomePageContent = () => {
  const { user, loading } = useAuth();

  return (
    <Layout>
      {loading ? <HomePageSkeleton /> : user ? <Dashboard /> : <LandingPage />}
    </Layout>
  );
};

export default HomePageContent;
