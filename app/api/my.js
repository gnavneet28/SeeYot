import apiClient from "./apiClient";

const endPoint = "/my";

const getBlockList = () => apiClient.get(endPoint + "/blocked");
const getContactList = () => apiClient.get(endPoint + "/contacts");
const getNotifications = () => apiClient.get(endPoint + "/notifications");
const getEchoMessages = () => apiClient.get(endPoint + "/echoMessage");
const getMyThoughts = () => apiClient.get(endPoint + "/thoughts");

const updateMyContacts = () => apiClient.put(endPoint + "/contacts/update", {});

const updateMyEchoMessages = () =>
  apiClient.put(endPoint + "/echoMessages/update", {});

const updateMyFavorites = () =>
  apiClient.put(endPoint + "/favorites/update", {});

const updateThisEchoMessage = (id) =>
  apiClient.put(endPoint + "/echoMessage/update/" + id, {});

const updateThisContact = (id, savedName) =>
  apiClient.put(endPoint + "/contact/update/" + id, { savedName });

const setNotificationSeen = () =>
  apiClient.put(endPoint + "/notifications/read", {});

const deleteNotification = (id) =>
  apiClient.delete(endPoint + "/notification/" + id);

const deleteAllNotifications = (id) =>
  apiClient.delete(endPoint + "/notifications");

const clearExpiredData = () => apiClient.delete(endPoint + "/expired");

export default {
  clearExpiredData,
  deleteAllNotifications,
  deleteNotification,
  getBlockList,
  getContactList,
  getEchoMessages,
  getMyThoughts,
  getNotifications,
  setNotificationSeen,
  updateMyContacts,
  updateMyEchoMessages,
  updateMyFavorites,
  updateThisContact,
  updateThisEchoMessage,
};
