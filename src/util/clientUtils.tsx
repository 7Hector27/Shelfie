import Router from "next/router";

export const redirectTo = (path: string) => {
  if (typeof window === "undefined") return;
  Router.push(path);
};
