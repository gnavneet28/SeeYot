import * as SecureStore from "expo-secure-store";
import Bugsnag from "@bugsnag/react-native";

const key = "authToken";

const storeToken = async (authToken) => {
  try {
    await SecureStore.setItemAsync(key, authToken);
  } catch (error) {
    Bugsnag.notify(error);
  }
};

const getToken = async () => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    Bugsnag.notify(error);
  }
};

const getUser = async () => {
  const token = await getToken();
  return token ? token : null;
};

const removeToken = async () => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    Bugsnag.notify(error);
  }
};

export default {
  storeToken,
  getUser,
  removeToken,
  getToken,
};
