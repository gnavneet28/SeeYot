import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SendOtpScreen from "../screens/SendOtpScreen";
import Constant from "./NavigationConstants";

const Stack = createNativeStackNavigator();

function AuthNavigator(props) {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    >
      <Stack.Screen
        options={{ animationTypeForReplace: "pop" }}
        name={Constant.SEND_OTP_SCREEN}
        component={SendOtpScreen}
      />
    </Stack.Navigator>
  );
}

export default AuthNavigator;
