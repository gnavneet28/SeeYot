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

const addFavorite = (id) => apiClient.put(endPoint + "/favorite/add/" + id, {});

const removeFavorite = (id) =>
  apiClient.put(endPoint + "/favorite/remove/" + id, {});

const updatePoints = () => apiClient.put(endPoint + "/me/points/add", {});

const searchUser = (searchQuery) =>
  apiClient.get(endPoint + "/search", { searchQuery });

const addToSearchHistory = (id) =>
  apiClient.put(endPoint + "/searchHistory/add/" + id, {});

const removeFromSearchHstory = (id) =>
  apiClient.put(endPoint + "/searchHistory/remove/" + id, {});

const getCurrentUser = () => apiClient.get(endPoint + "/me");

const updateCurrentUserPhoto = (picture) => {
  const formData = new FormData();

  formData.append("picture", {
    name: picture.split("/").pop(),
    uri: picture,
    type: "image/jpg",
  });

  return apiClient.put(endPoint + "/me/update/picture", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
const removeCurrentUserPhoto = () =>
  apiClient.put(endPoint + "/me/remove/picture", {});

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

const notifyUserForActiveChat = (id) =>
  apiClient.put(endPoint + "/activeChat/notify/" + id, {});

const sendNewActiveMessage = (newMessage) =>
  apiClient.put(endPoint + "/newActiveMessage", { newMessage });

const makeCurrentUserActiveFor = (forUser, byUser) =>
  apiClient.put(endPoint + "/setActiveFor", { for: forUser, by: byUser });

const makeCurrentUserInActiveFor = (forUser, byUser) =>
  apiClient.put(endPoint + "/setInActiveFor", { for: forUser, by: byUser });

export default {
  addContact,
  addFavorite,
  addToSearchHistory,
  blockContact,
  getCurrentUser,
  sendNewActiveMessage,
  makeCurrentUserActiveFor,
  makeCurrentUserInActiveFor,
  notifyUserForActiveChat,
  redeemPoints,
  registerUserWithoutPicture,
  registerUserWithPicture,
  removeContact,
  removeFavorite,
  removeFromSearchHstory,
  removeCurrentUserPhoto,
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
