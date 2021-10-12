import apiClient from "./apiClient";

const endPoint = "/messages";

const sendMessage = (id, message, mood) =>
  apiClient.post(endPoint + "/create/" + id, { message, mood });

const markRead = (id) => apiClient.put(endPoint + "/read/" + id, {});

const reply = (id, reply) =>
  apiClient.put(endPoint + "/reply/" + id, { reply });

const deleteMessage = (id) => apiClient.delete(endPoint + "/delete/" + id);

export default {
  deleteMessage,
  markRead,
  reply,
  sendMessage,
};
