import React from "react";
import Image from "next/image";
import styles from "./FriendCard.module.scss";

type FriendCardProps = {
  name: string;
  id: string;
  currentlyReading: string | string[];
  books: number;
  friends: number;
};
const FriendCard = ({
  name,
  id,
  currentlyReading,
  books,
  friends,
}: FriendCardProps) => {
  return (
    <div className={styles.friendCard}>
      <div className={styles.userInfo}>
        <div className={styles.profileImage}>
          <Image
            src="/images/user_profile.webp"
            alt="User Profile"
            width={30}
            height={30}
          />
        </div>
        <div className={styles.nameAndCurrent}>
          <h2>{name}</h2>
          <p>Reading: {currentlyReading}</p>
        </div>
      </div>

      <div className={styles.booksAndFriends}>
        <div>{books} books</div>
        <div>{friends} friends</div>
      </div>
    </div>
  );
};

export default FriendCard;
