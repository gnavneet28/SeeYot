import io from "socket.io-client";
import apiUrl from "../config/apiUrl";
import React from "react";

let api_url = __DEV__ ? apiUrl.DEV_API_URL : apiUrl.PROD_API_URL;

export const socket = io(api_url, {
  transports: ["websocket", "polling"],
});

export const SocketContext = React.createContext();
