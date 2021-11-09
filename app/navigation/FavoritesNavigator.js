import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import AddFavoritesScreen from "../screens/AddFavoritesScreen";

import Constants from "./NavigationConstants";
import RepliesScreen from "../screens/RepliesScreen";

const Tab = createBottomTabNavigator();

function FavoritesNavigator(props) {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false, tabBarStyle: { display: "none" } }}
    >
      <Tab.Screen
        name={Constants.ADD_FAVORITES_SCREEN}
        component={AddFavoritesScreen}
      />
      <Tab.Screen
        name={Constants.ALL_REPLIES_SCREEN}
        component={RepliesScreen}
      />
    </Tab.Navigator>
  );
}

export default FavoritesNavigator;
