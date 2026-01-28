import React, { useState } from "react";
import Image from "next/image";

import { apiPost } from "../../lib/api";
import { useAuth } from "@/context/AuthProvider";
import { redirectTo } from "@/util/clientUtils";

import styles from "./ProfileMenu.module.scss";

const ProfileMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { setUser, user } = useAuth();

  const logout = async () => {
    try {
      await apiPost("/auth/logout", {});
      setUser(null);
      redirectTo("/signin");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const redirect = (path: string) => {
    redirectTo(path);
  };

  return (
    <div className={styles.profileMenu}>
      <div
        className={styles.profileImage}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <Image
          src="/images/user_profile.webp"
          alt="User Profile"
          width={30}
          height={30}
        />
      </div>
      {menuOpen && (
        <div className={styles.menuOptions}>
          <ul>
            {user && <li>{user?.first_name}</li>}{" "}
            <li onClick={() => redirect("/friends")}>Profile</li>
            <li onClick={() => redirect("/friends")}>My Books</li>
            <li onClick={() => redirect("/friends")}>Friends</li>
            <li onClick={() => redirect("/friends")}>Messages</li>
            <li onClick={logout}>Logout</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
