import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Constant from "./NavigationConstants";

import QrScannerScreen from "../screens/QrScannerScreen";
import GroupScreen from "../screens/GroupScreen";
import GroupChatScreen from "../screens/GroupChatScreen";

const Stack = createNativeStackNavigator();

function GroupNavigator(props) {
  return (
    <Stack.Navigator
      initialRouteName={Constant.FIND_GROUP_SCREEN}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name={Constant.FIND_GROUP_SCREEN}
        component={QrScannerScreen}
      />
      <Stack.Screen name={Constant.GROUP_INFO_SCREEN} component={GroupScreen} />
      <Stack.Screen
        name={Constant.GROUP_CHAT_SCREEN}
        component={GroupChatScreen}
      />
    </Stack.Navigator>
  );
}

export default GroupNavigator;
