import apiClient from "./apiClient";

const endPoint = "/echos";

const getEcho = (id) => apiClient.get(endPoint + "/" + id);

const deleteEcho = (id) => apiClient.delete(endPoint + "/" + id);

export default {
  getEcho,
  deleteEcho,
};
