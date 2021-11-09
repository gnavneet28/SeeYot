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

import useNotifications from "../hooks/useNotifications";

import useAuth from "../auth/useAuth";
import FavoritesNavigator from "./FavoritesNavigator";

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

    const subscription4 = socket.on(`deletedThought${user._id}`, (data) => {
      let modifiedUser = { ...user };
      modifiedUser.thoughts = data.thoughts;
      return setUser(modifiedUser);
    });

    return () => {
      subscription1.off();
      subscription2.off();
      subscription3.off();
      subscription4.off();
    };
  }, [user]);

  useNotifications((data) => {
    console.log(data.notification.request.content.data.message);
    if (
      data.notification.request.content.data.message !==
      "One of your favorites sent you a message!"
    ) {
      return navigation.navigate(Constant.NOTIFICATION_NAVIGATOR);
    }

    navigation.navigate(Constant.INDEX_NAVIGATOR, {
      screen: Constant.HOME_SCREEN,
    });
  });

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
        name={Constant.FAVORITES_NAVIGATOR}
        component={FavoritesNavigator}
      />
    </Tab.Navigator>
  );
}

export default AppNavigator;
