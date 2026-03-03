import React from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../Navbar";

import styles from "./Layout.module.scss";

type LayoutProps = {
  children?: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <span className={styles.brandName}>
              <Image
                src="/images/open_book.webp"
                alt="Shelfie Logo"
                width={22}
                height={18}
              />{" "}
              Shelfie
            </span>
            <p>Track books. Share reads. Find your next obsession.</p>
          </div>

          <div className={styles.footerLinks}>
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
            <a
              href="https://github.com/7Hector27"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>

          <p className={styles.footerCopy}>
            © {new Date().getFullYear()} Shelfie. Built with Next.js & Open
            Library.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
