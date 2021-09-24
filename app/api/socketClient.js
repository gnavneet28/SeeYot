import io from "socket.io-client";

const socket = io("http://192.168.115.96:3000");

export default socket;
