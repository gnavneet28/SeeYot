import apiClient from "./apiClient";

const endPoint = "/messages";

const sendMessage = (id, message, mood, optionalAnswer) =>
  apiClient.post(endPoint + "/create/" + id, { message, mood, optionalAnswer });

const markRead = (id) => apiClient.put(endPoint + "/read/" + id, {});

const reply = (id, reply, selectedMessageId) =>
  apiClient.put(
    endPoint + "/reply/" + id,
    { reply, selectedMessageId },
    { timeout: 5000, timeoutErrorMessage: "Slow Connection" }
  );

const deleteMessage = (id) => apiClient.delete(endPoint + "/delete/" + id);

const getAllRepliedMessages = () => apiClient.get(endPoint + "/allReplied");

const updateAllMessages = () =>
  apiClient.put(endPoint + "/update/allReadMessages", {});

export default {
  deleteMessage,
  getAllRepliedMessages,
  markRead,
  reply,
  sendMessage,
  updateAllMessages,
};
