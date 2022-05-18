import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "../../node_modules/react-native-vector-icons/MaterialCommunityIcons";
import { scale } from "react-native-size-matters";
import Ionicons from "../../node_modules/react-native-vector-icons/Ionicons";
import AntDesign from "../../node_modules/react-native-vector-icons/AntDesign";

import AddContactScreen from "../screens/AddContactsScreen";
import Constant from "./NavigationConstants";
import FavoritesNavigator from "./FavoritesNavigator";
import FavoriteTabButton from "../components/FavoriteTabButton";
import HomeNavigator from "./HomeNavigator";
import NotificationNavigator from "./NotificationNavigator";
import TabButton from "../components/TabButton";

import defaultstyles from "../config/styles";
import GroupNavigator from "./GroupNavigator";

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
          height: scale(45),
          borderTopWidth: 0,
        },
      }}
    >
      <Tab.Screen
        options={{
          tabBarIcon: ({ size, color }) => (
            <AntDesign name="home" size={size} color={color} />
          ),
          tabBarButton: (props) => (
            <TabButton animation="rubberBand" {...props} />
          ),
          tabBarActiveTintColor: defaultstyles.colors.yellow_Variant,
          tabBarInactiveTintColor: defaultstyles.colors.white,
          tabBarHideOnKeyboard: true,
        }}
        name={Constant.HOME_NAVIGATOR}
        component={HomeNavigator}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ size, color }) => (
            <AntDesign name="adduser" size={size} color={color} />
          ),
          tabBarButton: (props) => (
            <TabButton animation="rubberBand" {...props} />
          ),
          tabBarActiveTintColor: defaultstyles.colors.yellow_Variant,
          tabBarInactiveTintColor: defaultstyles.colors.white,
          tabBarHideOnKeyboard: true,
        }}
        name={Constant.ADD_CONTACTS_SCREEN}
        component={AddContactScreen}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused, size, color }) => (
            <AntDesign
              name={focused ? "star" : "staro"}
              size={size}
              color={color}
            />
          ),
          tabBarButton: (props) => (
            <FavoriteTabButton animation="rotate" {...props} />
          ),
          tabBarActiveTintColor: defaultstyles.colors.secondary_Variant,
          tabBarInactiveTintColor: defaultstyles.colors.white,
          tabBarHideOnKeyboard: true,
        }}
        name={Constant.FAVORITES_NAVIGATOR}
        component={FavoritesNavigator}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-group"
              // name="crown-outline"
              size={size}
              color={color}
            />
          ),
          tabBarActiveTintColor: defaultstyles.colors.yellow_Variant,
          tabBarInactiveTintColor: defaultstyles.colors.white,
          tabBarStyle: { display: "none" },
        }}
        name={Constant.GROUP_NAVIGATOR}
        component={GroupNavigator}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="notifications-outline" size={size} color={color} />
          ),
          tabBarButton: (props) => <TabButton animation="swing" {...props} />,
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
          tabBarHideOnKeyboard: true,
        }}
        name={Constant.NOTIFICATION_NAVIGATOR}
        component={NotificationNavigator}
      />
    </Tab.Navigator>
  );
}

export default IndexNavigator;
