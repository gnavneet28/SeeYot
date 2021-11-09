import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import BlockedUsersScreen from "../screens/BlockedUsersScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SubscriptionNavigator from "./SubscriptionNavigator";
import HelpScreen from "../screens/HelpScreen";
import Constant from "./NavigationConstants";

const Tab = createBottomTabNavigator();

function ProfileNavigator(props) {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false, tabBarStyle: { display: "none" } }}
    >
      <Tab.Screen name={Constant.PROFILE_SCREEN} component={ProfileScreen} />
      <Tab.Screen
        name={Constant.BLOCKED_SCREEN}
        component={BlockedUsersScreen}
      />
      <Tab.Screen
        name={Constant.SUBSCRIPTION_NAVIGATOR}
        component={SubscriptionNavigator}
      />
      <Tab.Screen name={Constant.HELP_SCREEN} component={HelpScreen} />
    </Tab.Navigator>
  );
}

export default ProfileNavigator;
