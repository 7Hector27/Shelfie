import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { redirectTo } from "@/util/clientUtils";
import { apiGet } from "@/lib/api";

import Layout from "@/components/Layout";
import { UserProfileResponse } from "@/util/types";
import {
  getAgeFromISO,
  formatMonthYear,
  getBirthdayMonthDay,
} from "@/util/clientUtils";

import styles from "./UserProfileContent.module.scss";

const UserProfileContent = () => {
  const { query } = useRouter();
  const profileId = query.id;

  const fetchUserProfile = async () => {
    const data = await apiGet<UserProfileResponse>(
      `/user/profile/${profileId}`,
    );

    return data;
  };

  const { data: profileData, isLoading } = useQuery<UserProfileResponse>({
    queryKey: ["profile", profileId],
    queryFn: fetchUserProfile,
    enabled: typeof profileId === "string",
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const { user, shelves, friendsPreview, currentlyReading } = profileData || {};

  const { first_name, last_name, profile_image, birthdate, bio } = user || {};

  return (
    <Layout>
      <div className={styles.userProfile}>
        <div className={styles.header}>
          <Image
            key={profile_image}
            src={profile_image ?? "/images/user_profile.webp"}
            width={80}
            height={80}
            alt="Profile image"
            className={styles.avatar}
          />
          <div className={styles.details}>
            <h1 className={styles.username}>
              {first_name} {last_name}
            </h1>
            <button
              onClick={() => redirectTo("/user/edit")}
              className={styles.editBtn}
            >
              Edit Profile
            </button>
            <p className={styles.joined}>
              Joined {formatMonthYear(user?.created_at || null)}
            </p>
            <p className={styles.age}>
              Age {birthdate && getAgeFromISO(birthdate)} •{" "}
              {birthdate && getBirthdayMonthDay(birthdate)}
            </p>
            <p className={styles.bio}>{bio}</p>
          </div>
        </div>
        <div className={styles.currentlyReading}>
          <h2>Currently Reading</h2>
          {currentlyReading && currentlyReading.length > 0 ? (
            <div className={styles.list}>
              {currentlyReading.map((book) => (
                <Link
                  href={`/book/${book.book_id}`}
                  key={book.user_book_id}
                  className={styles.item}
                >
                  <Image
                    src={book.cover_url ?? "/images/book_placeholder.webp"}
                    width={50}
                    height={75}
                    alt={`${book.title} cover`}
                  />
                  <div>
                    <p>{book.title}</p>
                    <p> by {book.author}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p>No books currently being read.</p>
          )}
        </div>
        <div className={styles.shelves}>
          <h2>Book Shelves</h2>
          <div className={styles.shelfGrid}>
            <Link
              href={`/user/books/${profileId}?shelf=want_to_read`}
              className={styles.shelfCard}
            >
              <Image
                src="/images/want-to-read.webp"
                alt="Want to Read"
                width={38}
                height={38}
                className={styles.iconImg}
              />
              <span className={styles.count}>{shelves?.wantToRead ?? 0}</span>
              <span className={styles.label}>Want to Read</span>
            </Link>

            <Link
              href={`/user/books/${profileId}?shelf=reading`}
              className={styles.shelfCard}
            >
              <Image
                src="/images/reading.webp"
                alt="Currently Reading"
                width={38}
                height={38}
                className={styles.iconImg}
              />
              <span className={styles.count}>
                {shelves?.currentlyReading ?? 0}
              </span>
              <span className={styles.label}>Currently Reading</span>
            </Link>

            <Link
              href={`/user/books/${profileId}?shelf=completed`}
              className={styles.shelfCard}
            >
              <Image
                src="/images/read.webp"
                alt="Read"
                width={38}
                height={38}
                className={styles.iconImg}
              />
              <span className={styles.count}>{shelves?.read ?? 0}</span>
              <span className={styles.label}>Read</span>
            </Link>

            <Link
              href={`/user/books/${profileId}?shelf=dropped`}
              className={styles.shelfCard}
            >
              <Image
                src="/images/dropped.webp"
                alt="Dropped"
                width={38}
                height={38}
                className={styles.iconImg}
              />
              <span className={styles.count}>{shelves?.dropped ?? 0}</span>
              <span className={styles.label}>Dropped</span>
            </Link>

            <Link
              href={`/user/books/${profileId}?favorite=true`}
              className={styles.shelfCard}
            >
              <Image
                src="/images/favorite.webp"
                alt="Favorites"
                width={38}
                height={38}
                className={styles.iconImg}
              />
              <span className={styles.count}>{shelves?.favorites ?? 0}</span>
              <span className={styles.label}>Favorites</span>
            </Link>

            <Link
              href={`/user/books/${profileId}`}
              className={styles.shelfCard}
            >
              <Image
                src="/images/all-books.webp"
                alt="all-books"
                width={38}
                height={38}
                className={styles.iconImg}
              />
              <span className={styles.count}>{shelves?.favorites ?? 0}</span>
              <span className={styles.label}>All Books</span>
            </Link>
          </div>
        </div>
        <div className={styles.friends}>
          <h2>Friends</h2>
          {friendsPreview && friendsPreview.length > 0 ? (
            <ul>
              {friendsPreview.map((friend) => (
                <li
                  key={friend.user_id}
                  onClick={() => redirectTo(`/user/profile/${friend.user_id}`)}
                >
                  <Image
                    src={friend.profile_image ?? "/images/user_profile.webp"}
                    width={40}
                    height={40}
                    alt={`${friend.first_name} ${friend.last_name} profile image`}
                  />
                  <p>
                    {friend.first_name} {friend.last_name}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No friends to display.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UserProfileContent;
