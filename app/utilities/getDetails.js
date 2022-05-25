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
  const phoneContacts = await asyncStorage.get(DataConstants.PHONE_CONTACTS);
  const groupHistory = await asyncStorage.get(DataConstants.GROUP_HISTORY);
  //const statsPresent = await asyncStorage.get(DataConstants.STATS);
  let cachedUser = {
    _id: currentUser ? currentUser._id : "",
    blocked,
    contacts: contacts,
    echoMessage: echoMessage,
    echoWhen: echoWhen,
    favorites,
    messages,
    name: currentUser ? currentUser.name : "",
    notifications: notifications,
    phoneNumber: currentUser ? currentUser.phoneNumber : parseInt(""),
    phoneContacts,
    picture: currentUser ? currentUser.picture : "",
    points,
    searchHistory: searchHistory,
    thoughts: thoughts,
    vip,
    groupHistory,
    //statsPresent,
  };

  return cachedUser;
};

export default getDetails;
