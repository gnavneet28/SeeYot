import apiClient from "./apiClient";

const endPoint = "/echos";

const getEcho = (id) => apiClient.get(endPoint + "/" + id);

const deleteEcho = (id) => apiClient.delete(endPoint + "/" + id);

const updateEcho = (id) =>
  apiClient.put(endPoint + "/my/echo/update/" + id, {});

export default {
  getEcho,
  deleteEcho,
  updateEcho,
};
