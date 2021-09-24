import apiClient from "./apiClient";

const endPoint = "/problems";

const registerProblem = (description) =>
  apiClient.post(endPoint, { description });

export default {
  registerProblem,
};
