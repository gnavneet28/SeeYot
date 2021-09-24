import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import LottieView from "lottie-react-native";
import { StyleSheet } from "react-native";

import AddContactScreen from "../screens/AddContactsScreen";
import HomeScreen from "../screens/HomeScreen";
import NotificationScreen from "../screens/NotificationScreen";

import defaultstyles from "../config/styles";

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
                source={require("../assets/animations/home.json")}
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
        name="Home"
        component={HomeScreen}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <>
              <LottieView
                source={require("../assets/animations/addContacts.json")}
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
        name="AddContact"
        component={AddContactScreen}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <>
              <LottieView
                source={require("../assets/animations/notification.json")}
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
        name="Notification"
        component={NotificationScreen}
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
