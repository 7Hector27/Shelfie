import React from "react";
import { useRouter } from "next/router";

const UserProfile = () => {
  const { query } = useRouter();

  return <div>{query.id}</div>;
};

export default UserProfile;
