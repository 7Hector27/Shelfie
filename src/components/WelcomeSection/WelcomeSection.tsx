import { useRouter } from "next/router";

import styles from "./WelcomeSection.module.scss";
interface Props {
  firstName?: string;
  userId?: string;
}

const WelcomeSection = ({ firstName, userId }: Props) => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        Welcome back{firstName ? `, ${firstName}` : ""} 👋
      </h2>

      <div className={styles.buttonRow}>
        <button className={styles.button} onClick={() => router.push("/book")}>
          Add a Book
        </button>

        <button
          className={styles.button}
          onClick={() => router.push("/friends/find")}
        >
          Find Friends
        </button>

        {userId && (
          <button
            className={styles.button}
            onClick={() => router.push(`/user/books/${userId}`)}
          >
            My Books
          </button>
        )}
      </div>
    </div>
  );
};

export default WelcomeSection;
