import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./NowReadingSection.module.scss";

interface Book {
  id: string;
  book_id: string;
  cover_url: string;
}

const NowReadingSection = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchReading() {
      const res = await fetch("/api/user-books?status=reading");
      if (!res.ok) return;
      const data = await res.json();
      setBooks(data);
    }

    fetchReading();
  }, []);

  if (!books.length) return null;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Currently Reading</h3>

      <div className={styles.scrollRow}>
        {books.map((b) => (
          <img
            key={b.id}
            src={b.cover_url}
            className={styles.cover}
            onClick={() => router.push(`/user/books/${b.id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default NowReadingSection;
