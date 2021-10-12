import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import SubscriptionScreen from "../screens/SubscriptionScreen";
import PointsScreen from "../screens/PointsScreen";
import ManageSubscriptionScreen from "../screens/ManageSubscriptionScreen";
import Constant from "./NavigationConstants";

const Tab = createBottomTabNavigator();

function SubscriptionNavigator(props) {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false, tabBarStyle: { display: "none" } }}
    >
      <Tab.Screen
        name={Constant.SUBSCRIPTION_SCREEN}
        component={SubscriptionScreen}
      />
      <Tab.Screen name={Constant.POINTS_SCREEN} component={PointsScreen} />
      <Tab.Screen
        name={Constant.MANAGER_SCREEN}
        component={ManageSubscriptionScreen}
      />
    </Tab.Navigator>
  );
}

export default SubscriptionNavigator;
