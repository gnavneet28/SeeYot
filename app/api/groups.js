import apiClient from "./apiClient";

const endPoint = "/groups";

const createGroup = (
  name,
  qrCodeLink,
  information,
  category,
  subCategory,
  type
) => {
  return apiClient.post(endPoint + "/newGroup", {
    name,
    qrCodeLink,
    information,
    category,
    subCategory,
    type,
  });
};

const checkGroupName = (name) => {
  return apiClient.get(endPoint + "/checkNameAvailablity", { name: name });
};

const getGroupByName = (name, password) =>
  apiClient.get(endPoint + "/groupByName", { name, password });
const getGroupById = (id) => apiClient.get(endPoint + "/groupById/" + id, {});

const getMyGroups = () => apiClient.get(endPoint + "/myGroups", {});

const updateGroupPicture = (picture, id) => {
  const formData = new FormData();
  if (picture) {
    formData.append("picture", {
      name: picture.split("/").pop(),
      uri: picture,
      type: "image/jpg",
    });
  }

  return apiClient.put(endPoint + "/updatePicture/" + id, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const removeGroupPicture = (id) =>
  apiClient.put(endPoint + "/removePicture/" + id, {});

const updateGroupInformation = (information, id) =>
  apiClient.put(endPoint + "/updateInformation/" + id, { information });

const deleteGroup = (id) => apiClient.delete(endPoint + "/delete/" + id, {});

const reportGroup = (description, groupId) =>
  apiClient.post(endPoint + "/reportGroup", { description, groupId });

const addActive = (id, userId, name, picture) =>
  apiClient.put(endPoint + "/add/Active/" + id, { userId, name, picture });

const removeActive = (id, userId, name, picture) =>
  apiClient.put(endPoint + "/add/removeActive/" + id, {
    userId,
    name,
    picture,
  });

const setTyping = (id, userId) =>
  apiClient.put(endPoint + "/setTyping/" + id, { userId });
const stopTyping = (id, userId) =>
  apiClient.put(endPoint + "/stopTyping/" + id, { userId });

const sendNewGroupMessage = (newMessage) =>
  apiClient.put(endPoint + "/newGroupMessage", { newMessage });

const getMessages = (id) => apiClient.get(endPoint + "/messages/" + id, {});

const inviteUser = (userId, name) =>
  apiClient.put(endPoint + "/invite/" + userId, { name });

const blockUser = (id, userId) =>
  apiClient.put(endPoint + "/block/" + id, { userId });
const unBlockUser = (id, userId) =>
  apiClient.put(endPoint + "/unblock/" + id, { userId });

const exploreGroups = (category) =>
  apiClient.get(endPoint + "/explore", { category });

const modifyInvitePermission = (id) =>
  apiClient.put(endPoint + "/modify/canInvite/" + id, {});

const updatePassword = (id, password, qrCodeLink) =>
  apiClient.put(endPoint + "/update/password/" + id, { password, qrCodeLink });

const deleteMessage = (id, _id) =>
  apiClient.delete(endPoint + "/deleteMessage/" + id, { _id });

const notifyForNewVisitor = (id, groupName) =>
  apiClient.put(endPoint + "/notify/creator/newVisitor/" + id, { groupName });

const replyMessageCreator = (
  id,
  groupName,
  groupPassword,
  messageMedia,
  messageText,
  replyMedia,
  replyText
) =>
  apiClient.put(endPoint + "/notify/replied/" + id, {
    groupName,
    groupPassword,
    messageMedia,
    messageText,
    replyMedia,
    replyText,
  });

const requestActiveUsers = (id) =>
  apiClient.put(endPoint + "/requestActiveUsersCount/" + id, {});

const sendActiveUser = (id, totalActiveUsers, requestedBy) =>
  apiClient.put(endPoint + "/sendActiveUsersCount/" + id, {
    totalActiveUsers,
    requestedBy,
  });

export default {
  addActive,
  blockUser,
  checkGroupName,
  createGroup,
  deleteGroup,
  deleteMessage,
  exploreGroups,
  getGroupById,
  getGroupByName,
  getMessages,
  getMyGroups,
  inviteUser,
  modifyInvitePermission,
  notifyForNewVisitor,
  removeActive,
  removeGroupPicture,
  replyMessageCreator,
  reportGroup,
  requestActiveUsers,
  sendActiveUser,
  sendNewGroupMessage,
  setTyping,
  stopTyping,
  unBlockUser,
  updateGroupInformation,
  updateGroupPicture,
  updatePassword,
};
