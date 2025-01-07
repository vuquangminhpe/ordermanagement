import envConfig from "@/config";
import { getAccessTokenFromLocalStorage } from "./utils";
import { io } from "socket.io-client";
const socket = io(envConfig.NEXT_PUBLIC_API_ENDPOINT, {
  auth: {
    Authorization: `Bearer ${getAccessTokenFromLocalStorage()}`,
  },
  autoConnect: false,
});
export default socket;
