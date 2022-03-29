import asyncStorage from "./cache";

const onboardingKeys = {
  ECHO: "echo",
  FAVORITES: "favorites",
  VIP_INFO: "vipInfo",
  HOME_PROFILE_PICTURE: "homeProfilePicture",
  REPLIES: "replies",
  THOUGHT_HISTORY: "thoughtHistory",
};

const isInfoSeen = async (key) => {
  const infoSeen = await asyncStorage.get(key);
  if (infoSeen) return infoSeen;
  return null;
};

const updateInfoSeen = async (key) => {
  await asyncStorage.store(key, `${key}seen`);
};

export default {
  onboardingKeys,
  isInfoSeen,
  updateInfoSeen,
};
