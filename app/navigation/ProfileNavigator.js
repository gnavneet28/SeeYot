import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import BlockedUsersScreen from "../screens/BlockedUsersScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SubscriptionNavigator from "./SubscriptionNavigator";
import HelpScreen from "../screens/HelpScreen";
import Constant from "./NavigationConstants";
import SettingsScreen from "../screens/SettingsScreen";
import InsightsScreen from "../screens/InsightsScreen";
import PostDetailsScreen from "../screens/PostDetailsScreen";

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
      <Tab.Screen name={Constant.SETTINGS} component={SettingsScreen} />
      <Tab.Screen name={Constant.INSIGHTS_SCREEN} component={InsightsScreen} />
      <Tab.Screen
        name={Constant.POST_DETAILS_POFILE}
        component={PostDetailsScreen}
      />
    </Tab.Navigator>
  );
}

export default ProfileNavigator;
