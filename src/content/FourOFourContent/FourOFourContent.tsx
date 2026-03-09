import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import styles from "./FourOFourContent.module.scss";

const NotFoundPage = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <Layout>
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <div className={styles.glyphRow}>
            <span className={styles.book}>📚</span>
          </div>

          <h1 className={styles.code}>404</h1>
          <p className={styles.title}>Page not found</p>
          <p className={styles.subtitle}>
            Looks like this page got lost somewhere between the shelves.
          </p>

          <div className={styles.actions}>
            <button
              className={styles.primaryBtn}
              onClick={() => router.push("/")}
            >
              Go Home
            </button>
            <button
              className={styles.secondaryBtn}
              onClick={() => router.back()}
            >
              Go Back
            </button>
          </div>

          <p className={styles.countdown}>
            Redirecting in <span>{countdown}s</span>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default NotFoundPage;
