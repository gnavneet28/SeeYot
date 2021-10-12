import asyncStorage from "./cache";
import DataConstants from "./DataConstants";

const getDetails = async () => {
  const currentUser = await asyncStorage.get(DataConstants.DETAILS);
  const contacts = await asyncStorage.get(DataConstants.CONTACTS);
  const thoughts = await asyncStorage.get(DataConstants.THOUGHTS);
  const echoMessage = await asyncStorage.get(DataConstants.ECHO_MESSAGE);
  const echoWhen = await asyncStorage.get(DataConstants.ECHO_WHEN);
  const notifications = await asyncStorage.get(DataConstants.NOTIFICATIONS);
  const searchHistory = await asyncStorage.get(DataConstants.SEARCH_HISTORY);
  const blocked = await asyncStorage.get(DataConstants.BLOCKED);
  const points = await asyncStorage.get(DataConstants.POINTS);
  const vip = await asyncStorage.get(DataConstants.VIP);
  const favorites = await asyncStorage.get(DataConstants.FAVORITES);
  const messages = await asyncStorage.get(DataConstants.MESSAGES);
  let cachedUser = {
    _id: currentUser._id,
    blocked,
    contacts: contacts,
    echoMessage: echoMessage,
    echoWhen: echoWhen,
    favorites,
    messages,
    name: currentUser.name,
    notifications: notifications,
    phoneNumber: currentUser.phoneNumber,
    picture: currentUser.picture,
    points,
    searchHistory: searchHistory,
    thoughts: thoughts,
    vip,
  };

  return cachedUser;
};

export default getDetails;
