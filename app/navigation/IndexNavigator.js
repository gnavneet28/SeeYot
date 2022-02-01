import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "../../node_modules/react-native-vector-icons/Ionicons";
import AntDesign from "../../node_modules/react-native-vector-icons/AntDesign";
import { scale } from "react-native-size-matters";
import { useNavigation, TabActions } from "@react-navigation/native";

import AddContactScreen from "../screens/AddContactsScreen";
import HomeScreen from "../screens/HomeScreen";
import NotificationNavigator from "./NotificationNavigator";
import Constant from "./NavigationConstants";
import FavoritesNavigator from "./FavoritesNavigator";

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

  const navigation = useNavigation();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: defaultstyles.colors.primary,
          height: scale(45),
          borderTopWidth: 0,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" size={size} color={color} />
          ),
          tabBarActiveTintColor: defaultstyles.colors.yellow_Variant,
          tabBarInactiveTintColor: defaultstyles.colors.white,
        }}
        name={Constant.HOME_SCREEN}
        component={HomeScreen}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="adduser" size={size} color={color} />
          ),
          tabBarActiveTintColor: defaultstyles.colors.yellow_Variant,
          tabBarInactiveTintColor: defaultstyles.colors.white,
        }}
        name={Constant.ADD_CONTACTS_SCREEN}
        component={AddContactScreen}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="staro" size={size} color={color} />
          ),
          tabBarActiveTintColor: defaultstyles.colors.yellow_Variant,
          tabBarInactiveTintColor: defaultstyles.colors.white,
        }}
        name={Constant.FAVORITES_NAVIGATOR}
        component={FavoritesNavigator}
        // listeners={{ tabPress: () => navigation.popToTop() }}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" size={size} color={color} />
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
          tabBarActiveTintColor: defaultstyles.colors.yellow_Variant,
          tabBarInactiveTintColor: defaultstyles.colors.white,
        }}
        name={Constant.NOTIFICATION_NAVIGATOR}
        component={NotificationNavigator}
      />
    </Tab.Navigator>
  );
}

export default IndexNavigator;
