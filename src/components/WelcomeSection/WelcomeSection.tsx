import { useRouter } from "next/router";
import styles from "./WelcomeSection.module.scss";

interface Props {
  firstName?: string;
  userId?: string;
}

const WelcomeSection = ({ firstName, userId }: Props) => {
  const router = useRouter();

  return (
    <section className={styles.container}>
      <div className={styles.books} />
      <div className={styles.overlay} />

      <div className={styles.inner}>
        <div className={styles.copy}>
          <h2 className={styles.title}>
            Welcome back{firstName ? `, ${firstName}` : ""}
          </h2>
          <p className={styles.subtitle}>
            Ready to continue where you left off?
          </p>
        </div>

        <div className={styles.buttonGroup}>
          <button
            className={styles.actionBtn}
            onClick={() => router.push("/book")}
          >
            Add a Book <span>›</span>
          </button>

          {userId && (
            <button
              className={styles.actionBtn}
              onClick={() => router.push(`/user/books/${userId}`)}
            >
              My Books <span>›</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
