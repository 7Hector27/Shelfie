import React from "react";

import Navbar from "../Navbar";

import styles from "./Layout.module.scss";

type LayoutProps = {
  children?: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={styles.layout}>
      <Navbar />
      {children}
    </div>
  );
};

export default Layout;
