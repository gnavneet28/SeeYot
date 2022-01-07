import React, { useEffect } from "react";
import * as Notifications from "expo-notifications";
import expoPushTokensApi from "../api/expoPushTokens";
import useAuth from "../auth/useAuth";
import storeDetails from "../utilities/storeDetails";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});

export default useNotifications = (notificationListener) => {
  const { user, setUser } = useAuth();

  useEffect(() => {
    registerForPushNotifications();

    if (notificationListener)
      Notifications.addNotificationResponseReceivedListener(
        notificationListener
      );
  }, []);

  const registerForPushNotifications = async () => {
    try {
      const result = await Notifications.getPermissionsAsync();
      if (!result.granted) return;

      const response = await Notifications.getExpoPushTokenAsync();
      const { data, ok, problem } = await expoPushTokensApi.createExpoPushToken(
        response.data
      );
      if (ok) {
        await storeDetails(data);
        return setUser(data);
      }
      if (problem) return;
    } catch (error) {
      console.log("Error receiving the token", error);
    }
  };
};
