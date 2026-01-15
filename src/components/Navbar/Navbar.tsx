import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import styles from "./Navbar.module.scss";

const Navbar = () => {
  const [mobileSearchVisible, setMobileSearchVisible] = useState(false);

  return (
    <>
      <div className={styles.navbar}>
        <div className={styles.icon}>
          <Image
            src="/images/shelfie_icon.webp"
            alt="Shelfie Icon"
            className={styles.img}
            width={100}
            height={100}
          />
          Shelfie
        </div>
        <div
          className={styles.mobileSearch}
          onClick={() => setMobileSearchVisible(!mobileSearchVisible)}
        >
          <Image
            src="/images/magnifying_glass.png"
            alt="magnifying glass"
            className={styles.icon}
            width={100}
            height={100}
          />
        </div>
        <div className={styles.searchbar}>
          <input type="search" name="search" id="search" autoFocus />
        </div>
        <div className={styles.profile}>
          <Link href="/register">Sign Up</Link>
        </div>
      </div>
      {mobileSearchVisible && (
        <div className={styles.mobileSearchbar}>
          <input type="search" name="search" id="search" autoFocus />
          <button onClick={() => setMobileSearchVisible(false)}>cancel</button>
        </div>
      )}
    </>
  );
};

export default Navbar;
