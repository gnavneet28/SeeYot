import asyncStorage from "./cache";
import users from "../api/users";

const getDetails = async () => {
  const currentUser = await asyncStorage.get("userDetails");
  const contacts = await asyncStorage.get("userContacts");
  const thoughts = await asyncStorage.get("userThoughts");
  const echoMessage = await asyncStorage.get("userEchoMessage");
  const echoWhen = await asyncStorage.get("userEchoWhen");
  const notifications = await asyncStorage.get("userNotifications");
  const searchHistory = await asyncStorage.get("userSearchHistory");
  const blocked = await asyncStorage.get("blocked");
  const points = await asyncStorage.get("userPoints");
  const vip = await asyncStorage.get("vip");
  let cachedUser = {
    _id: currentUser._id,
    blocked,
    contacts: contacts,
    echoMessage: echoMessage,
    echoWhen: echoWhen,
    name: currentUser.name,
    notifications: notifications,
    phoneNumber: currentUser.phoneNumber,
    points,
    picture: currentUser.picture,
    thoughts: thoughts,
    vip,
    searchHistory: searchHistory,
  };

  return cachedUser;
};

export default getDetails;
