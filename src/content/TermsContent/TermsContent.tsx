import React, { useState } from "react";
import styles from "./TermsContent.module.scss";

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: `By accessing or using Shelfie, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service. We reserve the right to update these terms at any time, and continued use of Shelfie constitutes acceptance of any changes.`,
  },
  {
    title: "2. Use of the Service",
    body: `Shelfie is a personal book tracking and social reading platform. You agree to use Shelfie only for lawful purposes and in a manner that does not infringe the rights of others. You may not use Shelfie to distribute spam, harmful content, or any material that violates applicable laws.`,
  },
  {
    title: "3. User Accounts",
    body: `You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account. Shelfie is not liable for any loss or damage arising from your failure to protect your account information.`,
  },
  {
    title: "4. User Content",
    body: `You retain ownership of any content you submit to Shelfie, including reviews, ratings, and reading lists. By submitting content, you grant Shelfie a non-exclusive, royalty-free license to display and distribute that content within the platform. You are solely responsible for the content you post.`,
  },
  {
    title: "5. Intellectual Property",
    body: `All design, code, branding, and non-user content on Shelfie is the property of Shelfie and protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.`,
  },
  {
    title: "6. Third-Party Data",
    body: `Shelfie uses the Open Library API to provide book data. This data is provided by the Internet Archive and is subject to their terms of use. We make no guarantees about the accuracy or completeness of third-party book data displayed on the platform.`,
  },
  {
    title: "7. Termination",
    body: `We reserve the right to suspend or terminate your account at our discretion if you violate these terms or engage in conduct we deem harmful to other users or the platform. Upon termination, your right to use Shelfie ceases immediately.`,
  },
  {
    title: "8. Disclaimer of Warranties",
    body: `Shelfie is provided "as is" without warranties of any kind, either express or implied. We do not guarantee that the service will be uninterrupted, error-free, or free of harmful components. Your use of Shelfie is at your own risk.`,
  },
  {
    title: "9. Limitation of Liability",
    body: `To the fullest extent permitted by law, Shelfie shall not be liable for any indirect, incidental, special, or consequential damages arising out of your use of or inability to use the service, even if we have been advised of the possibility of such damages.`,
  },
  {
    title: "10. Contact",
    body: `If you have any questions about these Terms of Service, please contact us at support@shelfie.app. We aim to respond to all inquiries within 5 business days.`,
  },
];

const TermsContent = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className={styles.termsContent}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Legal</p>
        <h1>Terms of Service</h1>
        <p className={styles.lastUpdated}>Last updated: March 2025</p>
      </div>

      <div className={styles.intro}>
        Welcome to Shelfie. Please read these Terms of Service carefully before
        using our platform. These terms govern your access to and use of
        Shelfies features, including book tracking, social reading, and
        messaging.
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

export default TermsContent;
