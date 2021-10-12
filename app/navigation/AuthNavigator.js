import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import RegisterDetailsScreen from "../screens/RegisterDetailsScreen";
import SendOtpScreen from "../screens/SendOtpScreen";
import VerifyOtpScreen from "../screens/VerifyOtpScreen";
import Constant from "./NavigationConstants";

const Tab = createBottomTabNavigator();

function AuthNavigator(props) {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false, tabBarStyle: { display: "none" } }}
    >
      <Tab.Screen name={Constant.SEND_OTP_SCREEN} component={SendOtpScreen} />
      <Tab.Screen
        name={Constant.VERIFY_OTP_SCREEN}
        component={VerifyOtpScreen}
      />
      <Tab.Screen
        name={Constant.PROFILE_DETAILS_SCREEN}
        component={RegisterDetailsScreen}
      />
    </Tab.Navigator>
  );
}

export default AuthNavigator;
