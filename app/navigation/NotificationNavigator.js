import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import NotificationScreen from "../screens/NotificationScreen";
import SubscriptionNavigator from "./SubscriptionNavigator";
import Constant from "./NavigationConstants";

const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

function NotificationNavigator(props) {
  return (
    <Stack.Navigator
      initialRouteName={Constant.NOTIFICATION_SCREEN}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        options={{ animation: "none" }}
        name={Constant.NOTIFICATION_SCREEN}
        component={NotificationScreen}
      />
      <Stack.Screen
        options={{ animation: "none" }}
        name={Constant.SUBSCRIPTION_NAVIGATOR_FROM_NOTIFICATION}
        component={SubscriptionNavigator}
      />
    </Stack.Navigator>
  );
}
// function NotificationNavigator(props) {
//   return (
//     <Tab.Navigator
//       screenOptions={{ headerShown: false, tabBarStyle: { display: "none" } }}
//     >
//       <Tab.Screen
//         name={Constant.NOTIFICATION_SCREEN}
//         component={NotificationScreen}
//       />
//       <Tab.Screen
//         name={Constant.SUBSCRIPTION_NAVIGATOR_FROM_NOTIFICATION}
//         component={SubscriptionNavigator}
//       />
//     </Tab.Navigator>
//   );
// }

export default NotificationNavigator;
