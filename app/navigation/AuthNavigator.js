import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import RegisterDetailsScreen from "../screens/RegisterDetailsScreen";
import SendOtpScreen from "../screens/SendOtpScreen";
import VerifyOtpScreen from "../screens/VerifyOtpScreen";

const Tab = createBottomTabNavigator();

function AuthNavigator(props) {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false, tabBarStyle: { display: "none" } }}
    >
      <Tab.Screen name="SendOtp" component={SendOtpScreen} />
      <Tab.Screen name="VerifyOtp" component={VerifyOtpScreen} />
      <Tab.Screen name="ProfileDetails" component={RegisterDetailsScreen} />
    </Tab.Navigator>
  );
}

export default AuthNavigator;
