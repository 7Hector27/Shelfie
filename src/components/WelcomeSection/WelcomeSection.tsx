import styles from "./WelcomeSection.module.scss";

interface Props {
  firstName?: string;
}

const WelcomeSection = ({ firstName }: Props) => {
  return (
    <section className={styles.container}>
      <div className={styles.overlay} />
      <div className={styles.inner}>
        <div className={styles.eyebrow}>✦ your reading life</div>
        <h2 className={styles.title}>
          Welcome back{firstName ? `, ${firstName}` : ""}
        </h2>
        <p className={styles.subtitle}>Ready to continue where you left off?</p>
      </div>
    </section>
  );
};

export default WelcomeSection;
