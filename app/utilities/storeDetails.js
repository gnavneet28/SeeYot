import asyncStorage from "./cache";

const storeDetails = async (data) => {
  const userDetails = {
    _id: data._id,
    name: data.name,
    picture: data.picture,
    phoneNumber: data.phoneNumber,
  };
  await asyncStorage.store("vip", data.vip);
  await asyncStorage.store("blocked", data.blocked);
  await asyncStorage.store("userContacts", data.contacts);
  await asyncStorage.store("userDetails", userDetails);
  await asyncStorage.store("userEchoMessage", data.echoMessage);
  await asyncStorage.store("userEchoWhen", data.echoWhen);
  await asyncStorage.store("userNotifications", data.notifications);
  await asyncStorage.store("userThoughts", data.thoughts);
  await asyncStorage.store("userSearchHistory", data.searchHistory);
  await asyncStorage.store("userPhoneContacts", data.phoneContacts);
  await asyncStorage.store("userPoints", data.points);
};

export default storeDetails;
