import React from "react";

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
  return <div>FriendCard</div>;
};

export default FriendCard;
