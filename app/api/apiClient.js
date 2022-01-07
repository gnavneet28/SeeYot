import { create } from "apisauce";
import authStorage from "../auth/storage";

const apiClient = create({
  baseURL: "http://192.168.124.96:3000/api",
  timeout: 30000,
});

apiClient.addAsyncRequestTransform(async (request) => {
  const authToken = await authStorage.getToken();
  if (!authToken) return;
  request.headers["x-auth-token"] = authToken;
});

export default apiClient;
