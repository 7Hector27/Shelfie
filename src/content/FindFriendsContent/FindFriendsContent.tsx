import React, { useState, useEffect } from "react";
import Image from "next/image";

import Layout from "@/components/Layout";

import styles from "./FindFriendsContent.module.scss";
import FriendCard from "@/components/FriendCard";
import { redirectTo } from "@/util/clientUtils";
import { apiGet, apiPost } from "@/lib/api";
import { FriendSearchResult } from "@/util/types";

export const mockFriends = [
  {
    id: "1",
    name: "Alex Walker",
  },
  {
    id: "2",
    name: "Jenny Adams",
  },
  {
    id: "3",
    name: "Chris Morgan",
  },
];

const FindFriendsContent = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FriendSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setLoading(true);
    try {
      const data = await apiGet<{
        users: FriendSearchResult[];
      }>(`/friends/search?q=${encodeURIComponent(query)}`);

      setResults(data.users);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(() => {
      search();
    }, 300); // debounce delay

    return () => clearTimeout(timeout);
  }, [query]);

  const sendFriendRequest = async (receiverId: string) => {
    setLoading(true);

    try {
      await apiPost("/friends/request", {
        receiverId,
      });

      // TODO: Validate sent request
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className={styles.findFriends}>
        <div className={styles.titles}>
          <h1>Add Friends</h1>
          <p>Find a friend by name or email address</p>
        </div>
        <div className={styles.searchBarWrapper}>
          <div className={styles.search}>
            <Image
              src={"/images/magnifying_glass_white.webp"}
              alt="magnifying_glass"
              width={16}
              height={16}
              className={styles.icon}
            />
            <input
              type="search"
              name=""
              id=""
              placeholder="Search by name or email"
              onChange={(e) => {
                setQuery(e.target.value);
              }}
            />
          </div>
        </div>
        {!!results.length && (
          <div className={styles.results}>
            <h2 className={styles.resultsTitle}>Results for: {query}</h2>
            <div className={styles.cards}>
              {results.map((friend) => {
                const { id, firstName, lastName, email } = friend;
                return (
                  <FriendCard
                    key={id}
                    id={id}
                    name={`${firstName} ${lastName}`}
                    buttonCopy="+ Add"
                    buttonHandler={() => sendFriendRequest(id)}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FindFriendsContent;
