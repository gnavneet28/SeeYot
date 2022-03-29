import React from "react";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";

import HomeScreen from "../screens/HomeScreen";

import Constants from "./NavigationConstants";
import EchoModalScreen from "../screens/EchoModalScreen";

const Stack = createSharedElementStackNavigator();

const forFade = ({ current, closing }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

function HomeNavigator(props) {
  return (
    <Stack.Navigator
      initialRouteName={Constants.HOME_SCREEN}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        options={{ cardStyleInterpolator: forFade }}
        name={Constants.HOME_SCREEN}
        component={HomeScreen}
      />
      <Stack.Screen
        sharedElements={(route) => [
          route.params.recipient._id,
          `echoIcon${route.params.recipient._id}`,
        ]}
        options={{ cardStyleInterpolator: forFade }}
        name={Constants.ECHO_MODAL_SCREEN}
        component={EchoModalScreen}
      />
    </Stack.Navigator>
  );
}

export default HomeNavigator;
