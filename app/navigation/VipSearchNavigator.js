import React from "react";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";

import Constants from "./NavigationConstants";
import EchoModalScreen from "../screens/EchoModalScreen";
import VipSearchScreen from "../screens/VipSearchScreen";

const Stack = createSharedElementStackNavigator();

const forFade = ({ current, closing }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

function VipSearchNavigator(props) {
  return (
    <Stack.Navigator
      initialRouteName={Constants.VIP_SEARCH_SCREEN}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        options={{ cardStyleInterpolator: forFade }}
        name={Constants.VIP_SEARCH_SCREEN}
        component={VipSearchScreen}
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

export default VipSearchNavigator;
