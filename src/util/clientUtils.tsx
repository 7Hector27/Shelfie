import Router from "next/router";

export const redirectTo = (path: string) => {
  if (typeof window === "undefined") return;
  Router.push(path);
};

export const getAgeFromISO = (isoDate: string | null): number | null => {
  if (!isoDate) return null;

  const birthDate = new Date(isoDate);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const hasHadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  if (!hasHadBirthdayThisYear) {
    age--;
  }

  return age;
};

export const formatMonthYear = (isoDate: string | null): string | null => {
  if (!isoDate) return null;

  const date = new Date(isoDate);

  return date.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
};
export const getBirthdayMonthDay = (isoDate: string | null): string | null => {
  if (!isoDate) return null;

  const date = new Date(isoDate);

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
};
