import React, { useState } from "react";
import styles from "./PrivacyContent.module.scss";

const sections = [
  {
    title: "1. Information We Collect",
    body: `We collect information you provide directly, including your name, email address, and password when you register. We also collect content you create on Shelfie such as book reviews, ratings, reading lists, and messages sent to other users. Additionally, we collect usage data including pages visited, features used, and interactions with other users.`,
  },
  {
    title: "2. How We Use Your Information",
    body: `We use your information to provide and improve Shelfie's features, personalize your experience, enable social features such as friend connections and activity feeds, send you service-related notifications, and ensure the security of your account. We do not sell your personal data to third parties.`,
  },
  {
    title: "3. Book Data & Third Parties",
    body: `Shelfie uses the Open Library API provided by the Internet Archive to display book information, author data, and cover images. When you search for or view books, requests are made to Open Library's servers. This data is not personally identifiable and is governed by the Internet Archive's privacy policy.`,
  },
  {
    title: "4. Data Sharing",
    body: `We do not sell, rent, or trade your personal information. We may share data with trusted service providers who assist in operating our platform, subject to confidentiality agreements. We may disclose information if required by law or to protect the rights, safety, or property of Shelfie or its users.`,
  },
  {
    title: "5. Social Features",
    body: `Shelfie is a social platform. Information you choose to make public — such as your reading list, reviews, and activity — will be visible to other users. You can control what you share through your profile settings. Messages sent via our real-time messaging system are stored securely and are only visible to the intended recipients.`,
  },
  {
    title: "6. Data Retention",
    body: `We retain your personal data for as long as your account is active or as needed to provide our services. If you delete your account, we will remove your personal data within 30 days, except where retention is required by law or for legitimate business purposes such as fraud prevention.`,
  },
  {
    title: "7. Security",
    body: `We implement industry-standard security measures including encrypted connections (HTTPS), hashed passwords, and access controls to protect your data. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    title: "8. Children's Privacy",
    body: `Shelfie is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us and we will promptly delete it.`,
  },
  {
    title: "9. Your Rights",
    body: `Depending on your location, you may have rights regarding your personal data including the right to access, correct, or delete your data, the right to data portability, and the right to withdraw consent. To exercise these rights, contact us at privacy@shelfie.app.`,
  },
  {
    title: "10. Changes to This Policy",
    body: `We may update this Privacy Policy from time to time. We will notify you of significant changes via email or a prominent notice on the platform. Continued use of Shelfie after changes are posted constitutes your acceptance of the updated policy.`,
  },
];

const PrivacyContent = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className={styles.privacyContent}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Legal</p>
        <h1>Privacy Policy</h1>
        <p className={styles.lastUpdated}>Last updated: March 2025</p>
      </div>

      <div className={styles.intro}>
        At Shelfie, your privacy matters. This Privacy Policy explains what
        information we collect, how we use it, and the choices you have. We are
        committed to being transparent about our data practices.
      </div>

      <div className={styles.sections}>
        {sections.map((s, i) => (
          <div
            key={i}
            className={`${styles.section} ${openIndex === i ? styles.open : ""}`}
          >
            <button className={styles.sectionHeader} onClick={() => toggle(i)}>
              <span>{s.title}</span>
              <span className={styles.chevron}>
                {openIndex === i ? "−" : "+"}
              </span>
            </button>
            {openIndex === i && <p className={styles.sectionBody}>{s.body}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrivacyContent;
