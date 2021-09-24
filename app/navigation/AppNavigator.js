import React, { useEffect } from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import IndexNavigator from "./IndexNavigator";
import ProfileNavigator from "./ProfileNavigator";
import VipNavigator from "./VipNavigator";

import socket from "../api/socketClient";

import navigation from "./rootNavigation";

import SendThoughtsScreen from "../screens/SendThoughtsScreen";
import AddEchoScreen from "../screens/AddEchoScreen";

import useNotifications from "../hooks/useNotifications";

import useAuth from "../auth/useAuth";

const Tab = createBottomTabNavigator();

function AppNavigator(props) {
  const { user, setUser } = useAuth();

  useEffect(() => {
    socket.on(`newNotification${user._id}`, (data) => {
      let modifiedUser = { ...user };
      modifiedUser.notifications = data.notifications;
      return setUser(modifiedUser);
    });

    socket.on(`thoughtMatched${user._id}`, (data) => {
      let modifiedUser = { ...user };
      modifiedUser.thoughts = data.thoughts;
      return setUser(modifiedUser);
    });
  }, [user]);

  useNotifications(() => navigation.navigate("Notification"));

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" },
      }}
    >
      <Tab.Screen name="Index" component={IndexNavigator} />
      <Tab.Screen name="Vip" component={VipNavigator} />
      <Tab.Screen name="ProfileScreen" component={ProfileNavigator} />
      <Tab.Screen name="SendThought" component={SendThoughtsScreen} />
      <Tab.Screen name="AddEcho" component={AddEchoScreen} />
    </Tab.Navigator>
  );
}

export default AppNavigator;
