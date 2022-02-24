import Bugsnag from "@bugsnag/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";

const prefix = "cache";

const isExpired = (item) => {
  const now = dayjs(Date.now());
  const storedTime = dayjs(item.timestamp);
  return now.diff(storedTime, "days") >= item.expiryInDays;
};

const store = async (key, value) => {
  const item = {
    value,
    timestamp: Date.now(),
  };
  try {
    await AsyncStorage.setItem(prefix + key, JSON.stringify(item));
  } catch (error) {
    Bugsnag.notify(error);
  }
};
const storeWithExpiry = async (key, value, expiryInDays) => {
  const item = {
    value,
    timestamp: Date.now(),
    expiryInDays,
  };
  try {
    await AsyncStorage.setItem(prefix + key, JSON.stringify(item));
  } catch (error) {
    Bugsnag.notify(error);
  }
};

const get = async (key) => {
  try {
    const value = await AsyncStorage.getItem(prefix + key);
    const item = JSON.parse(value);

    if (!item) return;

    // if (isExpired(item)) {
    //   await AsyncStorage.removeItem(prefix + key);
    //   return null;
    // }

    return item.value;
  } catch (error) {
    Bugsnag.notify(error);
  }
};
const getWithExpiry = async (key) => {
  try {
    const value = await AsyncStorage.getItem(prefix + key);
    const item = JSON.parse(value);

    if (!item) return null;

    if (isExpired(item)) {
      await AsyncStorage.removeItem(prefix + key);
      return null;
    }

    return item;
  } catch (error) {
    Bugsnag.notify(error);
  }
};

export default {
  store,
  get,
  storeWithExpiry,
  getWithExpiry,
};
