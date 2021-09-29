import apiClient from "./apiClient";

const endPoint = "/users";

const registerUserWithPicture = (phoneNumber, picture, name, verificationId) =>
  apiClient.post(endPoint, {
    phoneNumber: phoneNumber,
    picture: picture,
    name: name,
    verificationId,
  });

const registerUserWithoutPicture = (phoneNumber, name, verificationId) =>
  apiClient.post(endPoint, {
    phoneNumber: phoneNumber,
    name: name,
    verificationId,
  });

const updatePoints = () => apiClient.put(endPoint + "/me/points/add", {});

const searchUser = (searchQuery) =>
  apiClient.get(endPoint + "/search", { searchQuery });

const addToSearchHstory = (user) =>
  apiClient.put(endPoint + "/searchHistory/add", user);

const removeFromSearchHstory = (user) =>
  apiClient.put(endPoint + "/searchHistory/remove", user);

const getCurrentUser = () => apiClient.get(endPoint + "/me");

const updateCurrentUserPhoto = (picture) =>
  apiClient.put(endPoint + "/me/update/picture", { picture: picture });

const updateCurrentUserName = (name) =>
  apiClient.put(endPoint + "/me/update/name", { name: name });

const updateEcho = (messageFor, message) =>
  apiClient.put(endPoint + "/me/echos", { messageFor, message });

const updateEchoWhenMessage = () =>
  apiClient.put(endPoint + "/me/echoWhen/message", {});

const updateEchoWhenPhotoTap = () =>
  apiClient.put(endPoint + "/me/echoWhen/photoTap", {});

const vipSubscribe = () => apiClient.put(endPoint + "/me/vip/subscribe", {});

const vipUnSubscribe = () =>
  apiClient.put(endPoint + "/me/vip/unsubscribe", {});

const addContact = (phoneNumber, savedName) =>
  apiClient.put(endPoint + "/me/add", {
    phoneNumber: phoneNumber,
    savedName: savedName,
  });

const removeContact = (id) => apiClient.put(endPoint + "/me/remove/" + id, {});

const blockContact = (id) => apiClient.put(endPoint + "/me/block/" + id, {});

const unBlockContact = (id) =>
  apiClient.put(endPoint + "/me/unblock/" + id, {});

const setPrivacySearch = () =>
  apiClient.put(endPoint + "/me/privacy/search", {});

const setPrivacyMessage = () =>
  apiClient.put(endPoint + "/me/privacy/message", {});

const syncContacts = (phoneContacts) =>
  apiClient.put(endPoint + "/sync/contacts", { phoneContacts });

const redeemPoints = (pointsToRedeem) =>
  apiClient.put(endPoint + "/me/redeem", { pointsToRedeem });

export default {
  addContact,
  addToSearchHstory,
  blockContact,
  getCurrentUser,
  redeemPoints,
  registerUserWithoutPicture,
  registerUserWithPicture,
  removeContact,
  removeFromSearchHstory,
  searchUser,
  setPrivacyMessage,
  setPrivacySearch,
  syncContacts,
  unBlockContact,
  updateCurrentUserName,
  updateCurrentUserPhoto,
  updateEcho,
  updateEchoWhenMessage,
  updateEchoWhenPhotoTap,
  updatePoints,
  vipSubscribe,
  vipUnSubscribe,
};
