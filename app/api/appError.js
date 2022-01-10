import apiClient from "./apiClient";

const endPoint = "/appErrors";

const submitError = (error) => apiClient.post(endPoint + "/newError", error);

export default {
  submitError,
};
