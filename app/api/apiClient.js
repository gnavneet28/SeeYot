import { create } from "apisauce";
import authStorage from "../auth/storage";
import apiUrl from "../config/apiUrl";

const apiClient = create({
  baseURL: apiUrl.baseApiUrl + "/api",
  timeout: 30000,
  timeoutErrorMessage: "Connection Timed-Out",
});

apiClient.addAsyncRequestTransform(async (request) => {
  const authToken = await authStorage.getToken();
  if (!authToken) return;
  request.headers[apiUrl.headerToken] = authToken;
});

export default apiClient;
