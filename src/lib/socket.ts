import { io } from "socket.io-client";

const URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const socket = io(URL, {
  withCredentials: true,
  transports: ["websocket", "polling"],
});
