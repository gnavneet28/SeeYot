import { create } from "apisauce";
import authStorage from "../auth/storage";
import apiUrl from "../config/apiUrl";

const apiClient = create({
  baseURL: apiUrl.baseApiUrl,
  timeout: 30000,
});

apiClient.addAsyncRequestTransform(async (request) => {
  const authToken = await authStorage.getToken();
  if (!authToken) return;
  request.headers["x-auth-token"] = authToken;
});

export default apiClient;
