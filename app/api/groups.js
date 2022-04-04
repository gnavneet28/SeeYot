import apiClient from "./apiClient";

const endPoint = "/groups";

const createGroup = (name, picture, info) => {
  const formData = new FormData();
  if (picture) {
    formData.append("picture", {
      name: picture.split("/").pop(),
      uri: picture,
      type: "image/jpg",
    });
  }
  formData.append("information", info);
  formData.append("name", name);

  return apiClient.post(endPoint + "/newGroup", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const checkGroupName = (name) => {
  return apiClient.get(endPoint + "/checkNameAvailablity", { name: name });
};

const getGroupByName = (name) =>
  apiClient.get(endPoint + "/groupByName", { name });
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

export default {
  addActive,
  checkGroupName,
  createGroup,
  deleteGroup,
  getGroupById,
  getGroupByName,
  getMessages,
  getMyGroups,
  inviteUser,
  removeActive,
  removeGroupPicture,
  reportGroup,
  sendNewGroupMessage,
  setTyping,
  stopTyping,
  updateGroupInformation,
  updateGroupPicture,
};
