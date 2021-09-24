import apiClient from "./apiClient";

const endPoint = "/thoughts";

const sendThought = (message, messageFor) =>
  apiClient.post(endPoint, { message, messageFor });

const deleteThought = (id) => apiClient.delete(endPoint + "/" + id);

const setThoughtSeen = (id) => apiClient.put(endPoint + "/" + id, {});

export default {
  sendThought,
  deleteThought,
  setThoughtSeen,
};
