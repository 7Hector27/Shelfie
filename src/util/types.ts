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

export type RequestType = {
  first_name: string;
  id: string;
  last_name: string;
  profile_image: null;
  user_id: string;
};

export type GetRequestsResponse = {
  requests: RequestType[];
};

export type FriendList = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePictureUrl: string;
};
export type GetFriendListResponse = {
  friends: FriendList[];
};
