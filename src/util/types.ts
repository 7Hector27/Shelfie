export type FriendSearchResult = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePictureUrl: string | null;
};
export type FriendCardProps = {
  name: string;
  id: string;
  currentlyReading: string | string[];
  books: number;
  friends: number;
};

export type UserType = {
  first_name: string;
  id: string;
  last_name: string;
  profile_image: null;
  user_id: string;
  bio?: string;
  created_at?: string;
  birthdate?: string;
};

export type GetRequestsResponse = {
  requests: UserType[];
};

export type BookType = {
  id: string;
  title: string;
  author: string;
  author_id: string;
  cover_url: string;
  description: string;
};

export type FriendList = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePictureUrl: string;
  currently_reading: {
    book: BookType;
    favorite: boolean;
    rating: string;
    status: Date;
    updated_at: string;
    user_book_id: string;
  }[];
  friend_count: number;
  book_count: number;
};
export type GetFriendListResponse = {
  friends: FriendList[];
};

export type Status = "want_to_read" | "reading" | "completed" | "dropped";

export type OpenLibraryWork = {
  title?: string;
  description?: string | { value?: string };
  covers?: number[];
  authors?: {
    author?: {
      key?: string;
    };
  }[];
};

export type OpenLibraryAuthor = {
  name?: string;
  birth_date?: string;
  bio?: string | { value?: string };
  photos?: number[];
  by_statement?: string;
};

export type OpenLibraryDescription = string | { value?: string } | undefined;
export type ProfileStats = {
  friendsCount: number;
  currentlyReadingCount: number;
  readCount: number;
};
export type CurrentlyReadingBook = {
  user_book_id: string; // comes back as string from PG
  book_id: string;
  status: "want_to_read" | "reading" | "read" | "dropped";
  shelf_updated_at: string; // ISO date
  title: string;
  cover_url: string | null;
  author: string;
};
export type ShelfCounts = {
  wantToRead: number;
  currentlyReading: number;
  read: number;
  dropped: number;
  favorites: number;
  total: number;
};
export type FriendPreview = {
  user_id: string;
  first_name: string;
  last_name: string;
  profile_image: string | null;
  friends_count?: number;
  books_count?: number;
};

export type UserProfileResponse = {
  user: UserType;
  stats: ProfileStats;
  currentlyReading: CurrentlyReadingBook[];
  shelves: ShelfCounts;
  friendsPreview: FriendPreview[];
};
export type UserBook = {
  id: string;
  user_id: string;
  book_id: string;
  external_source: string;
  status: "want_to_read" | "reading" | "completed" | "dropped";
  date_started: string | null;
  date_finished: string | null;
  rating: number | null;
  review: string | null;
  created_at: string;
  updated_at: string;
  favorite: boolean;
  title: string;
  author?: string;
  author_id?: string;
  cover_url?: string | null;
  description?: string | null;
};
export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type UserBooksCountResponse = {
  total: number;
  wantToRead: number;
  currentlyReading: number;
  read: number;
  dropped: number;
  favorites: number;
};

export type GetUserBooksResponse = {
  data: UserBook[];
  pagination: Pagination;
  counts: UserBooksCountResponse;
  profile: UserType;
};
export type ActivityType =
  | "started_reading"
  | "finished_reading"
  | "rated_book"
  | "review_posted"
  | "book_added"
  | "dropped";
export type ActivityMetadata = {
  status?: "want_to_read" | "reading" | "completed" | "dropped";
  rating?: number;
};
export interface ActivityFeedItem {
  id: string;
  type: ActivityType;

  metadata: ActivityMetadata;

  created_at: string;

  actor_id: string;
  first_name: string;
  last_name: string;
  profile_image: string;

  book_id: string;
  title: string;
  author: string;
  cover_url: string;
}
export type RequestType = {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  profile_image: string | null;
};
