import { create } from "apisauce";
import authStorage from "../auth/storage";
import apiUrl from "../config/apiUrl";

let api_url = __DEV__ ? apiUrl.DEV_API_URL : apiUrl.PROD_API_URL;
let auth_token = __DEV__ ? apiUrl.DEV_AUTH_TOKEN : apiUrl.PROD_AUTH_TOKEN;

const apiClient = create({
  baseURL: api_url + "api",
  timeout: 30000,
  timeoutErrorMessage: "Connection Timed-Out",
});

apiClient.addAsyncRequestTransform(async (request) => {
  const authToken = await authStorage.getToken();
  if (!authToken) return;
  request.headers[auth_token] = authToken;
});

export default apiClient;
