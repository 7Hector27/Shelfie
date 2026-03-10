import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import ProfileMenu from "../ProfileMenu";
import { useAuth } from "../../context/AuthProvider";
import { apiGet } from "@/lib/api";

import styles from "./Navbar.module.scss";
import { redirectTo } from "@/util/clientUtils";

type OpenLibraryDoc = {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
};

const formatSearchQuery = (q: string) =>
  encodeURIComponent(q.replace(/[\[\]]/g, "").trim()).replace(/%20/g, "+");

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
      const res = await apiGet<{
        docs: OpenLibraryDoc[];
      }>(`/openlibrary/search?q=${formatSearchQuery(q)}&limit=5`, {
        silent: true,
      });

      const data: { docs: OpenLibraryDoc[] } = await res;
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

  const SearchResults = ({ books }: { books: OpenLibraryDoc[] }) => (
    <div className={styles.searchResults}>
      {books.map((book) => {
        const BookId = book.key.split("/").pop();
        return (
          <Link
            key={book.key}
            href={`/book/${BookId}`}
            className={styles.searchResultItem}
          >
            <Image
              src={
                book.cover_i
                  ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                  : "/images/book-placeholder.webp"
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
        );
      })}
    </div>
  );

  return (
    <>
      <div className={styles.navbar}>
        {/* Logo */}
        <div className={styles.icon} onClick={() => redirectTo("/")}>
          <Image
            src="/images/shelfie_icon.webp"
            alt="Shelfie Icon"
            className={styles.img}
            width={100}
            height={100}
          />
          <p>Shelfie</p>
        </div>

        {/* Mobile search icon */}
        <div
          className={styles.mobileSearch}
          onClick={() => setMobileSearchVisible(!mobileSearchVisible)}
        >
          <Image
            src="/images/magnifying_glass_white.webp"
            alt="Search"
            className={styles.magnifyingIcon}
            width={20}
            height={20}
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

          {results.length > 0 && <SearchResults books={results} />}
          {loading && <div className={styles.searchLoading}>Searching…</div>}
        </div>

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

          {results.length > 0 && <SearchResults books={results} />}
        </div>
      )}
    </>
  );
};

export default Navbar;
