import apiClient from "./apiClient";

const endPoint = "/thoughts";

const sendThought = (message, messageFor, isVip) =>
  apiClient.post(endPoint, { message, messageFor, isVip });

const deleteThought = (id) => apiClient.delete(endPoint + "/" + id);

const deleteTemporaryThought = (key) =>
  apiClient.delete(endPoint + "/latest/" + key, {});

export default {
  sendThought,
  deleteThought,
  deleteTemporaryThought,
};
