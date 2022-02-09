import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AddEchoScreen from "../screens/AddEchoScreen";
import VipSearchScreen from "../screens/VipSearchScreen";
import SendThoughtsScreen from "../screens/SendThoughtsScreen";
import VipSearchNavigator from "./VipSearchNavigator";
import Constant from "./NavigationConstants";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const VipNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen
      options={{ animation: "none" }}
      name={Constant.VIP_SEARCH_NAVIGATOR}
      component={VipSearchNavigator}
    />
    <Stack.Screen
      options={{
        animation: "none",
      }}
      name={Constant.VIP_SENDTHOUGHT_SCREEN}
      component={SendThoughtsScreen}
    />
    <Stack.Screen
      options={{ animation: "none" }}
      name={Constant.VIP_ADDECHO_SCREEN}
      component={AddEchoScreen}
    />
  </Stack.Navigator>
);
// const VipNavigator = () => (
//   <Tab.Navigator
//     screenOptions={{ headerShown: false, tabBarStyle: { display: "none" } }}
//   >
//     <Tab.Screen
//       name={Constant.VIP_SEARCH_NAVIGATOR}
//       component={VipSearchNavigator}
//     />
//     <Tab.Screen
//       name={Constant.VIP_SENDTHOUGHT_SCREEN}
//       component={SendThoughtsScreen}
//     />
//     <Tab.Screen name={Constant.VIP_ADDECHO_SCREEN} component={AddEchoScreen} />
//   </Tab.Navigator>
// );

export default VipNavigator;
