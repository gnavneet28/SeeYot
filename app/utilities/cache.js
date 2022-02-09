import Bugsnag from "@bugsnag/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const prefix = "cache";
const expiryInMinutes = 30;

// const isExpired = (item) => {
//   const now = moment(Date.now());
//   const storedTime = moment(item.timestamp);
//   return now.diff(storedTime, " minutes ") > expiryInMinutes;
// };

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

export default {
  store,
  get,
};
