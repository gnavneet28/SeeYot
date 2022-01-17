import io from "socket.io-client";
import apiUrl from "../config/apiUrl";

const socket = io(apiUrl.baseApiUrl, {
  transports: ["websocket", "polling"],
});

export default socket;
