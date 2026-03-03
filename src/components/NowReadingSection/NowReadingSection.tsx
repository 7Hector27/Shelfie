import Image from "next/image";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthProvider";
import { GetUserBooksResponse, UserBook } from "@/util/types";

import { apiGet } from "@/lib/api";
import styles from "./NowReadingSection.module.scss";

interface Book {
  id: string; // user_book id
  book_id: string; // external book id
  cover_url: string;
}

const NowReadingSection = () => {
  const router = useRouter();
  const { user } = useAuth();

  const currentUserId = user?.user_id;
  const { data, isLoading, isError } = useQuery<GetUserBooksResponse>({
    queryKey: ["userBooks", "reading"],
    queryFn: () => apiGet(`/user/${currentUserId}/books?shelf=reading`),
  });

  if (isLoading) return null;
  if (isError) return null;

  const { data: booksList, pagination, counts, profile } = data || {};

  if (!booksList?.length) return null;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Currently Reading</h3>

      <div className={styles.scrollRow}>
        {booksList?.map((b: UserBook) => (
          <Image
            key={b.id}
            src={b.cover_url || "/images/book-placeholder.webp"}
            alt={b.title}
            className={styles.cover}
            onClick={() => router.push(`/book/${b.book_id}`)}
            width={100}
            height={200}
          />
        ))}
      </div>
    </div>
  );
};

export default NowReadingSection;
