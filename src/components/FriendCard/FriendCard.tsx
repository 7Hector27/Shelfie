import React from "react";
import Image from "next/image";
import styles from "./FriendCard.module.scss";
import { redirectTo } from "@/util/clientUtils";

type FriendCardProps = {
  name: string;
  id: string;
  currentlyReading?: string | string[];
  books?: number;
  friends?: number;
  buttonCopy?: string;
  buttonHandler?: () => void;
};
const FriendCard = ({
  name,
  id,
  currentlyReading,
  books,
  friends,
  buttonCopy,
  buttonHandler,
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
          <h2 onClick={() => redirectTo(`/profile/view/${id}`)}>{name}</h2>
          {currentlyReading && <p>Reading: {currentlyReading}</p>}{" "}
        </div>
      </div>

      {!buttonCopy && !buttonHandler && (
        <div className={styles.booksAndFriends}>
          <p>{books} books</p>
          <p>{friends} friends</p>
        </div>
      )}
      {buttonCopy && (
        <div className={styles.button}>
          <button onClick={buttonHandler}>{buttonCopy}</button>
        </div>
      )}
    </div>
  );
};

export default FriendCard;
