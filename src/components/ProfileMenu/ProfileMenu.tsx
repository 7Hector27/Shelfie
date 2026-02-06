import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

import { apiPost } from "../../lib/api";
import { useAuth } from "@/context/AuthProvider";
import { redirectTo } from "@/util/clientUtils";
import { useQueryClient } from "@tanstack/react-query";

import styles from "./ProfileMenu.module.scss";

const ProfileMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const logout = async () => {
    try {
      await apiPost("/auth/logout", {});
      await queryClient.invalidateQueries({ queryKey: ["me"] });

      redirectTo("/signin");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div className={styles.profileMenu} ref={menuRef}>
      <div
        className={styles.profileImage}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <Image
          src={user?.profile_image ?? "/images/user_profile.webp"}
          alt="User Profile"
          width={35}
          height={35}
        />
      </div>
      {menuOpen && (
        <div className={styles.menuOptions}>
          <ul>
            {user && <li>{user?.first_name}</li>}{" "}
            <li onClick={() => redirectTo(`/user/profile/${user?.user_id}`)}>
              Profile
            </li>
            <li onClick={() => redirectTo(`/user/books/${user?.user_id}`)}>
              My Books
            </li>
            <li onClick={() => redirectTo("/friends")}>Friends</li>
            <li onClick={() => redirectTo("/messages")}>Messages</li>
            <li onClick={logout}>Logout</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
