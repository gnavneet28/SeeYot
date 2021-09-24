import apiClient from "./apiClient";

const endPoint = "/expoPushTokens";

const createExpoPushToken = (token) => apiClient.post(endPoint, { token });

const removeToken = () => apiClient.delete(endPoint + "/removeToken");

export default { createExpoPushToken, removeToken };
