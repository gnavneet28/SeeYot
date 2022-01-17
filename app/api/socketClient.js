import io from "socket.io-client";

const socket = io("http://192.168.197.96:3000", {
  transports: ["websocket", "polling"],
});

export default socket;
