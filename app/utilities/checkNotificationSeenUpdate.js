import getDetails from "./getDetails";
import storeDetails from "./storeDetails";

const updateNotificationSeenStatus = async () => {
  const user = await getDetails();

  if (user) {
    user.notifications.forEach((n) => (n.seen = true));
    await storeDetails(user);
    return user;
  }

  return;
};

export default updateNotificationSeenStatus;
