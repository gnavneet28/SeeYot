import apiClient from "./apiClient";

const endPoint = "/favoritePosts";

const createNewPost = (text, audience, _id) =>
  apiClient.post(endPoint + "/new/post", { text, audience, _id });

const getPosts = () => apiClient.get(endPoint + "/all/favoritePosts", {});

const postSuggestion = (id, text) =>
  apiClient.post(endPoint + "/add/suggestions/" + id, { text });

const getPostDetails = (id) =>
  apiClient.get(endPoint + "/postDetails/" + id, {});

const getAllMyPosts = () => apiClient.get(endPoint + "/my/posts", {});

const addReaction = (postId, id, type) =>
  apiClient.put(endPoint + "/like/suggestion/" + postId, { id, type });

const disableReplies = (id) =>
  apiClient.put(endPoint + "/disable/suggestions/" + id, {});

const enableReplies = (id) =>
  apiClient.put(endPoint + "/enable/suggestions/" + id, {});

const deletePost = (id) => apiClient.delete(endPoint + "/post/" + id, {});

const removeFromFeed = (id) =>
  apiClient.put(endPoint + "/remove/fromFeed/" + id, {});

export default {
  addReaction,
  createNewPost,
  deletePost,
  disableReplies,
  enableReplies,
  getAllMyPosts,
  getPostDetails,
  getPosts,
  postSuggestion,
  removeFromFeed,
};
