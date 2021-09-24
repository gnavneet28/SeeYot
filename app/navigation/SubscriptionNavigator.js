import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import SubscriptionScreen from "../screens/SubscriptionScreen";
import PointsScreen from "../screens/PointsScreen";
import ManageSubscriptionScreen from "../screens/ManageSubscriptionScreen";

const Tab = createBottomTabNavigator();

function SubscriptionNavigator(props) {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false, tabBarStyle: { display: "none" } }}
    >
      <Tab.Screen name="Subscription" component={SubscriptionScreen} />
      <Tab.Screen name="PointsScreen" component={PointsScreen} />
      <Tab.Screen name="Manager" component={ManageSubscriptionScreen} />
    </Tab.Navigator>
  );
}

export default SubscriptionNavigator;
