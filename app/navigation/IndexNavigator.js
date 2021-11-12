import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import LottieView from "lottie-react-native";
import { StyleSheet } from "react-native";

import AddContactScreen from "../screens/AddContactsScreen";
import HomeScreen from "../screens/HomeScreen";
import NotificationNavigator from "./NotificationNavigator";
import Constant from "./NavigationConstants";
import FavoritesNavigator from "./FavoritesNavigator";

import defaultstyles from "../config/styles";

const home = require("../assets/animations/home.json");
const addContacts = require("../assets/animations/addContacts.json");
const notification = require("../assets/animations/notification.json");
const addFavorite = require("../assets/animations/addFavorite.json");

const Tab = createBottomTabNavigator();

function IndexNavigator(props) {
  const { user } = useAuth();
  let notificationsLength;

  if (user.notifications) {
    notificationsLength = user.notifications.filter(
      (n) => n.seen === false
    ).length;
  }

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: defaultstyles.colors.primary,
          height: 52,
          borderTopWidth: 0,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <>
              <LottieView
                source={home}
                autoPlay={focused}
                loop={true}
                style={[styles.lottie, { opacity: focused ? 1 : 0 }]}
              />

              {!focused ? (
                <AntDesign
                  style={[styles.icon, { opacity: focused ? 0 : 1 }]}
                  name="home"
                  size={size}
                  color={defaultstyles.colors.white}
                />
              ) : null}
            </>
          ),
          tabBarActiveTintColor: defaultstyles.colors.yellow,
          tabBarInactiveTintColor: defaultstyles.colors.white,
        }}
        name={Constant.HOME_SCREEN}
        component={HomeScreen}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <>
              <LottieView
                source={addContacts}
                autoPlay={focused}
                loop={true}
                style={[
                  styles.lottie,
                  { opacity: focused ? 1 : 0, height: 50, width: 50 },
                ]}
              />

              {!focused ? (
                <AntDesign
                  style={[styles.icon, { opacity: focused ? 0 : 1 }]}
                  name="adduser"
                  size={size}
                  color={color}
                />
              ) : null}
            </>
          ),
          tabBarActiveTintColor: defaultstyles.colors.yellow,
          tabBarInactiveTintColor: defaultstyles.colors.white,
        }}
        name={Constant.ADD_CONTACTS_SCREEN}
        component={AddContactScreen}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <>
              <LottieView
                source={addFavorite}
                autoPlay={focused}
                loop={true}
                style={[
                  styles.lottie,
                  { opacity: focused ? 1 : 0, height: 52, width: 52 },
                ]}
              />

              {!focused ? (
                <AntDesign
                  style={[styles.icon, { opacity: focused ? 0 : 1 }]}
                  name="staro"
                  size={size}
                  color={color}
                />
              ) : null}
            </>
          ),
          tabBarActiveTintColor: defaultstyles.colors.yellow,
          tabBarInactiveTintColor: defaultstyles.colors.white,
        }}
        name={Constant.FAVORITES_NAVIGATOR}
        component={FavoritesNavigator}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <>
              <LottieView
                source={notification}
                autoPlay={focused}
                loop={true}
                style={[
                  styles.lottie,
                  { opacity: focused ? 1 : 0, height: 50, width: 50 },
                ]}
              />

              {!focused ? (
                <Ionicons
                  style={[styles.icon, { opacity: focused ? 0 : 1 }]}
                  name="notifications-outline"
                  size={size}
                  color={color}
                />
              ) : null}
            </>
          ),
          tabBarBadge: notificationsLength ? notificationsLength : "",
          tabBarBadgeStyle: {
            opacity: !notificationsLength ? 0 : 1,
            backgroundColor: !notificationsLength
              ? defaultstyles.colors.primary
              : defaultstyles.colors.danger,
            color: !notificationsLength
              ? defaultstyles.colors.primary
              : defaultstyles.colors.white,
          },
          tabBarActiveTintColor: defaultstyles.colors.yellow,
          tabBarInactiveTintColor: defaultstyles.colors.white,
        }}
        name={Constant.NOTIFICATION_NAVIGATOR}
        component={NotificationNavigator}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  icon: {
    position: "absolute",
    alignSelf: "center",
  },
  lottie: {
    width: 35,
    height: 35,
  },
});

export default IndexNavigator;
