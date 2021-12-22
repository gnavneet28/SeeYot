import asyncStorage from "./cache";
import DataConstants from "./DataConstants";

const storeDetails = async (data) => {
  const userDetails = {
    _id: data._id,
    name: data.name,
    picture: data.picture,
    phoneNumber: data.phoneNumber,
  };

  let prevAdsStats = await asyncStorage.get(DataConstants.ADSSTATS);
  const adStats = {
    joinedAt: data.joinedAt,
    numberOfAdsSeen: prevAdsStats ? prevAdsStats.numberOfAdsSeen : [],
  };
  await asyncStorage.store(DataConstants.VIP, data.vip);
  await asyncStorage.store(DataConstants.BLOCKED, data.blocked);
  await asyncStorage.store(DataConstants.CONTACTS, data.contacts);
  await asyncStorage.store(DataConstants.DETAILS, userDetails);
  await asyncStorage.store(DataConstants.ECHO_MESSAGE, data.echoMessage);
  await asyncStorage.store(DataConstants.ECHO_WHEN, data.echoWhen);
  await asyncStorage.store(DataConstants.NOTIFICATIONS, data.notifications);
  await asyncStorage.store(DataConstants.THOUGHTS, data.thoughts);
  await asyncStorage.store(DataConstants.SEARCH_HISTORY, data.searchHistory);
  await asyncStorage.store(DataConstants.PHONE_CONTACTS, data.phoneContacts);
  await asyncStorage.store(DataConstants.POINTS, data.points);
  await asyncStorage.store(DataConstants.FAVORITES, data.favorites);
  await asyncStorage.store(DataConstants.MESSAGES, data.messages);
  await asyncStorage.store(DataConstants.ADSSTATS, adStats);
};

export default storeDetails;
