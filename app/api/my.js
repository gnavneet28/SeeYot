import apiClient from "./apiClient";

const endPoint = "/my";

const getBlockList = () => apiClient.get(endPoint + "/blocked");

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
  setNotificationSeen,
};
