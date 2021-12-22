import React, { useEffect, useState } from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import IndexNavigator from "./IndexNavigator";
import ProfileNavigator from "./ProfileNavigator";
import VipNavigator from "./VipNavigator";
import Constant from "./NavigationConstants";
import storeDetails from "../utilities/storeDetails";

import socket from "../api/socketClient";

import navigation from "./rootNavigation";

import SendThoughtsScreen from "../screens/SendThoughtsScreen";
import AddEchoScreen from "../screens/AddEchoScreen";

import useNotifications from "../hooks/useNotifications";

import useAuth from "../auth/useAuth";
import FavoritesNavigator from "./FavoritesNavigator";
import ActiveForContext from "../utilities/activeForContext";
import ActiveMessagesContext from "../utilities/activeMessagesContext";

const Tab = createBottomTabNavigator();

function AppNavigator(props) {
  const { user, setUser } = useAuth();
  const [activeFor, setActiveFor] = useState([]);
  const [activeMessages, setActiveMessages] = useState([]);

  useEffect(() => {
    const subscription1 = socket.on(`newNotification${user._id}`, (data) => {
      if (data.user) {
        return setUser(data.user);
      }
      return;
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

    const subscription5 = socket.on(`newActiveMessage${user._id}`, (data) => {
      return setActiveMessages([...activeMessages, data.newMessage]);
    });

    const subscription6 = socket.on(`setActiveFor${user._id}`, (data) => {
      if (activeFor.filter((u) => u == data._id)[0]) return;
      setActiveFor([...activeFor, data._id]);
    });

    const subscription7 = socket.on(`setInActiveFor${user._id}`, (data) => {
      let newList = activeFor.filter((u) => u != data._id);
      setActiveFor(newList);
    });

    return () => {
      subscription1.off();
      subscription2.off();
      subscription3.off();
      subscription4.off();
      subscription5.off();
      subscription6.off();
      subscription7.off();
    };
  }, [user, activeMessages, activeFor]);

  useNotifications((data) => {
    //console.log(data.notification.request.content.data.message);
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
    <ActiveForContext.Provider value={{ activeFor, setActiveFor }}>
      <ActiveMessagesContext.Provider
        value={{ activeMessages, setActiveMessages }}
      >
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: { display: "none" },
          }}
        >
          <Tab.Screen
            name={Constant.INDEX_NAVIGATOR}
            component={IndexNavigator}
          />
          <Tab.Screen name={Constant.VIP_NAVIGATOR} component={VipNavigator} />
          <Tab.Screen
            name={Constant.PROFILE_NAVIGATOR}
            component={ProfileNavigator}
          />
          <Tab.Screen
            name={Constant.SEND_THOUGHT_SCREEN}
            component={SendThoughtsScreen}
          />
          <Tab.Screen
            name={Constant.ADD_ECHO_SCREEN}
            component={AddEchoScreen}
          />
          <Tab.Screen
            name={Constant.FAVORITES_NAVIGATOR}
            component={FavoritesNavigator}
          />
        </Tab.Navigator>
      </ActiveMessagesContext.Provider>
    </ActiveForContext.Provider>
  );
}

export default AppNavigator;
