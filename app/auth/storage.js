import * as SecureStore from "expo-secure-store";
import crashlytics from "@react-native-firebase/crashlytics";

const key = "authToken";

const storeToken = async (authToken) => {
  try {
    await SecureStore.setItemAsync(key, authToken);
  } catch (error) {
    if (typeof error === "string") {
      crashlytics().recordError(new Error(error));
    }
  }
};

const getToken = async () => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    if (typeof error === "string") {
      crashlytics().recordError(new Error(error));
    }
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
    if (typeof error === "string") {
      crashlytics().recordError(new Error(error));
    }
  }
};

export default {
  storeToken,
  getUser,
  removeToken,
  getToken,
};
