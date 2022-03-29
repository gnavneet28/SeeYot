import apiClient from "./apiClient";

const endPoint = "/thoughts";

const sendThought = (message, messageFor, isVip, hint) =>
  apiClient.post(endPoint, { message, messageFor, isVip, hint });

const deleteThought = (id) => apiClient.delete(endPoint + "/" + id);

const deleteTemporaryThought = (key) =>
  apiClient.delete(endPoint + "/latest/" + key, {});

export default {
  sendThought,
  deleteThought,
  deleteTemporaryThought,
};
