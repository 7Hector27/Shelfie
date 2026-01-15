import React from "react";

import Navbar from "@/components/Navbar";

import styles from "./index.module.scss";

const homepage = () => {
  return (
    <div className={styles.homepage}>
      <Navbar />
    </div>
  );
};

export default homepage;
