import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

import Layout from "@/components/Layout";
import { GetUserBooksResponse } from "@/util/types";
import { apiGet } from "@/lib/api";

const UserBookContent = () => {
  const router = useRouter();
  const { id: userId, shelf, page } = router.query;

  const currentShelf = (shelf as string) || "";
  const currentPage = (page as string) || "1";

  const { data, isLoading, isError } = useQuery<GetUserBooksResponse>({
    queryKey: ["userBooks", userId, currentShelf, currentPage],
    queryFn: () =>
      apiGet(`/user/${userId}/books?shelf=${currentShelf}&page=${currentPage}`),
    enabled: !!userId,
  });

  const changeShelf = (newShelf: string) => {
    router.push({
      pathname: `/user/books/${userId}`,
      query: { shelf: newShelf, page: 1 },
    });
  };

  const changePage = (newPage: number) => {
    router.push({
      pathname: `/user/books/${userId}`,
      query: { shelf: currentShelf, page: newPage },
    });
  };
  console.log(data);
  return (
    <Layout>
      <div
        style={{
          padding: "40px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <h1 style={{ marginBottom: "30px" }}>My Books</h1>

        {/* Shelf Tabs */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "30px" }}>
          {["", "want_to_read", "reading", "completed"].map((s) => (
            <button
              key={s}
              onClick={() => changeShelf(s)}
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                border: "1px solid #ccc",
                background: currentShelf === s ? "#111" : "transparent",
                color: currentShelf === s ? "#fff" : "#000",
                cursor: "pointer",
              }}
            >
              {s.replaceAll("_", " ")}
            </button>
          ))}

          <button
            onClick={() =>
              router.push({
                pathname: `/user/books/${userId}`,
                query: { favorite: true, page: 1 },
              })
            }
          >
            Favorites
          </button>
        </div>

        {isLoading && <p>Loading...</p>}
        {isError && <p>Something went wrong.</p>}

        {/* Books Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "20px",
          }}
        >
          {data?.data.map((book) => (
            <div
              key={book.id}
              style={{
                border: "1px solid #e5e5e5",
                padding: "12px",
                borderRadius: "12px",
              }}
            >
              <div
                style={{
                  height: "200px",
                  background: "#f3f3f3",
                  marginBottom: "10px",
                }}
              >
                {/* Later: OpenLibrary cover image */}
              </div>

              <p style={{ fontWeight: 600 }}>{book.book_id}</p>
              <p style={{ fontSize: "12px", opacity: 0.6 }}>{book.status}</p>
              {book.favorite && (
                <p style={{ fontSize: "12px", color: "gold" }}>★ Favorite</p>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        {data?.pagination && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "16px",
              marginTop: "40px",
            }}
          >
            {data.pagination.hasPrevPage && (
              <button onClick={() => changePage(data.pagination.page - 1)}>
                Prev
              </button>
            )}

            <span>
              Page {data.pagination.page} of {data.pagination.totalPages}
            </span>

            {data.pagination.hasNextPage && (
              <button onClick={() => changePage(data.pagination.page + 1)}>
                Next
              </button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserBookContent;
