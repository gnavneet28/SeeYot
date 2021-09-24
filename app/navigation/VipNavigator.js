import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import AddEchoScreen from "../screens/AddEchoScreen";
import VipSearchScreen from "../screens/VipSearchScreen";
import SendThoughtsScreen from "../screens/SendThoughtsScreen";

const Tab = createBottomTabNavigator();

const VipNavigator = () => (
  <Tab.Navigator
    screenOptions={{ headerShown: false, tabBarStyle: { display: "none" } }}
  >
    <Tab.Screen name="VipSearch" component={VipSearchScreen} />
    <Tab.Screen name="VipSendThought" component={SendThoughtsScreen} />
    <Tab.Screen name="VipAddEcho" component={AddEchoScreen} />
  </Tab.Navigator>
);

export default VipNavigator;
