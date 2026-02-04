import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import ProfileMenu from "../ProfileMenu";
import { useAuth } from "../../context/AuthProvider";

import styles from "./Navbar.module.scss";

/* =====================
   Types (Open Library)
===================== */
type OpenLibraryDoc = {
  key: string; // "/works/OLxxxxW"
  title: string;
  author_name?: string[];
  cover_i?: number;
};

/* =====================
   Helpers
===================== */
const formatSearchQuery = (q: string) =>
  encodeURIComponent(q.replace(/[\[\]]/g, "").trim()).replace(/%20/g, "+");

/* =====================
   Component
===================== */
const Navbar = () => {
  const { user } = useAuth();

  const [mobileSearchVisible, setMobileSearchVisible] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<OpenLibraryDoc[]>([]);
  const [loading, setLoading] = useState(false);

  const searchBooks = async (q: string) => {
    if (q.length < 3) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?q=${formatSearchQuery(q)}&limit=5`,
      );

      const data: { docs: OpenLibraryDoc[] } = await res.json();
      setResults(data.docs || []);
    } catch (err) {
      console.error("Book search failed", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setQuery(value);
    searchBooks(value);
  };

  return (
    <>
      <div className={styles.navbar}>
        <div className={styles.icon}>
          <Image
            src="/images/shelfie_icon.webp"
            alt="Shelfie Icon"
            className={styles.img}
            width={40}
            height={40}
          />
          Shelfie
        </div>
        {/* Mobile search icon */}
        <div
          className={styles.mobileSearch}
          onClick={() => setMobileSearchVisible(!mobileSearchVisible)}
        >
          <Image
            src="/images/magnifying_glass.png"
            alt="Search"
            className={styles.icon}
            width={24}
            height={24}
          />
        </div>

        {/* Desktop search */}
        <div className={styles.searchbar}>
          <input
            type="search"
            placeholder="Search books..."
            value={query}
            onChange={(e) => handleSearchChange(e.target.value)}
          />

          {results.length > 0 && (
            <div className={styles.searchResults}>
              {results.map((book) => (
                <Link
                  key={book.key}
                  href={`/book${book.key}`}
                  className={styles.searchResultItem}
                >
                  <Image
                    src={
                      book.cover_i
                        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                        : "/images/book_placeholder.webp"
                    }
                    alt={book.title}
                    width={40}
                    height={60}
                  />
                  <div>
                    <p>{book.title}</p>
                    <span>{book.author_name?.[0]}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {loading && <div className={styles.searchLoading}>Searching…</div>}
        </div>

        {/* Profile */}
        {!user ? (
          <div className={styles.profile}>
            <Link href="/register">Sign Up</Link>
          </div>
        ) : (
          <div className={styles.profile}>
            <ProfileMenu />
          </div>
        )}
      </div>

      {/* Mobile search dropdown */}
      {mobileSearchVisible && (
        <div className={styles.mobileSearchbar}>
          <input
            type="search"
            placeholder="Search books..."
            value={query}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <button onClick={() => setMobileSearchVisible(false)}>Cancel</button>

          {results.length > 0 && (
            <div className={styles.searchResults}>
              {results.map((book) => (
                <Link
                  key={book.key}
                  href={`/book${book.key}`}
                  className={styles.searchResultItem}
                >
                  <Image
                    src={
                      book.cover_i
                        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                        : "/images/book_placeholder.webp"
                    }
                    alt={book.title}
                    width={40}
                    height={60}
                  />
                  <div>
                    <p>{book.title}</p>
                    <span>{book.author_name?.[0]}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
