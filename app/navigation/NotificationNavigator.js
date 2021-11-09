import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import NotificationScreen from "../screens/NotificationScreen";
import SubscriptionNavigator from "./SubscriptionNavigator";
import Constant from "./NavigationConstants";

const Tab = createBottomTabNavigator();

function NotificationNavigator(props) {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false, tabBarStyle: { display: "none" } }}
    >
      <Tab.Screen
        name={Constant.NOTIFICATION_SCREEN}
        component={NotificationScreen}
      />
      <Tab.Screen
        name={Constant.SUBSCRIPTION_NAVIGATOR_FROM_NOTIFICATION}
        component={SubscriptionNavigator}
      />
    </Tab.Navigator>
  );
}

export default NotificationNavigator;
