import React from "react";
import BookContent from "@/content/BookContent";
import { useRouter } from "next/router";

const BookPage = () => {
  const router = useRouter();
  const id = Array.isArray(router.query.id)
    ? router.query.id[0]
    : router.query.id;

  return id ? <BookContent key={id} /> : null;
};

export default BookPage;
