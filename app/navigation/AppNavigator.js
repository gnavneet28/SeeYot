import React, { useEffect } from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import IndexNavigator from "./IndexNavigator";
import ProfileNavigator from "./ProfileNavigator";
import VipNavigator from "./VipNavigator";
import Constant from "./NavigationConstants";

import socket from "../api/socketClient";

import navigation from "./rootNavigation";

import SendThoughtsScreen from "../screens/SendThoughtsScreen";
import AddEchoScreen from "../screens/AddEchoScreen";
import AddFavoritesScreen from "../screens/AddFavoritesScreen";

import useNotifications from "../hooks/useNotifications";

import useAuth from "../auth/useAuth";

const Tab = createBottomTabNavigator();

function AppNavigator(props) {
  const { user, setUser } = useAuth();

  useEffect(() => {
    const subscription1 = socket.on(`newNotification${user._id}`, (data) => {
      let modifiedUser = { ...user };
      modifiedUser.notifications = data.notifications;
      return setUser(modifiedUser);
    });

    const subscription2 = socket.on(`thoughtMatched${user._id}`, (data) => {
      let modifiedUser = { ...user };
      modifiedUser.thoughts = data.thoughts;
      return setUser(modifiedUser);
    });

    const subscription3 = socket.on(`newMessage${user._id}`, (data) => {
      let modifiedUser = { ...user };
      modifiedUser.messages = data.messages;
      return setUser(modifiedUser);
    });

    return () => {
      subscription1.off();
      subscription2.off();
      subscription3.off();
    };
  }, [user]);

  useNotifications(() => navigation.navigate("Notification"));

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" },
      }}
    >
      <Tab.Screen name={Constant.INDEX_NAVIGATOR} component={IndexNavigator} />
      <Tab.Screen name={Constant.VIP_NAVIGATOR} component={VipNavigator} />
      <Tab.Screen
        name={Constant.PROFILE_NAVIGATOR}
        component={ProfileNavigator}
      />
      <Tab.Screen
        name={Constant.SEND_THOUGHT_SCREEN}
        component={SendThoughtsScreen}
      />
      <Tab.Screen name={Constant.ADD_ECHO_SCREEN} component={AddEchoScreen} />
      <Tab.Screen
        name={Constant.ADD_FAVORITES_SCREEN}
        component={AddFavoritesScreen}
      />
    </Tab.Navigator>
  );
}

export default AppNavigator;
