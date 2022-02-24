import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import AddEchoScreen from "../screens/AddEchoScreen";
import SendThoughtsScreen from "../screens/SendThoughtsScreen";
import VipSearchNavigator from "./VipSearchNavigator";
import Constant from "./NavigationConstants";

const Tab = createBottomTabNavigator();

const VipNavigator = () => (
  <Tab.Navigator
    screenOptions={{ headerShown: false, tabBarStyle: { display: "none" } }}
  >
    <Tab.Screen
      name={Constant.VIP_SEARCH_NAVIGATOR}
      component={VipSearchNavigator}
    />
    <Tab.Screen
      name={Constant.VIP_SENDTHOUGHT_SCREEN}
      component={SendThoughtsScreen}
    />
    <Tab.Screen name={Constant.VIP_ADDECHO_SCREEN} component={AddEchoScreen} />
  </Tab.Navigator>
);

export default VipNavigator;
