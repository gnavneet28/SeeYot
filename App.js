import React, { useState, useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import * as SystemUI from "expo-system-ui";
import JailMonkey from "jail-monkey";

import getDetails from "./app/utilities/getDetails";

import cache from "./app/utilities/cache";

import { navigationRef } from "./app/navigation/rootNavigation";
import AppNavigator from "./app/navigation/AppNavigator";
import AuthNavigator from "./app/navigation/AuthNavigator";

import OfflineNotice from "./app/components/OfflineNotice";

import AuthContext from "./app/auth/context";
import authStorage from "./app/auth/storage";

import defaultStyles from "./app/config/styles";

import OnboardingContext from "./app/utilities/onboardingContext";

import Onboarding from "./app/components/Onboarding";
import SuccessMessage from "./app/components/SuccessMessage";
import SuccessMessageContext from "./app/utilities/successMessageContext";

export default function App() {
  const [user, setUser] = useState(null);
  const [state, setState] = useState({
    fontLoaded: false,
    isReady: false,
  });

  const [success, setSuccess] = useState({
    message: "",
    show: false,
  });

  const [onboarded, setOnboarded] = useState(false);

  const loadFont = useCallback(async () => {
    await Font.loadAsync({
      "Comic-Bold": require("./app/assets/fonts/ComicNeue-Bold.ttf"),
      "Comic-BoldItalic": require("./app/assets/fonts/ComicNeue-BoldItalic.ttf"),
      "Comic-LightItalic": require("./app/assets/fonts/ComicNeue-LightItalic.ttf"),
    });
  }, []);

  const restoreUser = async () => {
    const token = await authStorage.getUser();
    if (token) {
      const cachedUser = await getDetails();
      if (cachedUser) return setUser(cachedUser);
      return setUser(null);
    }
    return setUser(null);
  };

  const setUp = async () => {
    await SystemUI.setBackgroundColorAsync(defaultStyles.colors.primary);
    if (!state.fontLoaded) {
      await loadFont();
    }
    await restoreUser();

    let userOnboarded = await cache.get("onboarded");
    if (userOnboarded) return setOnboarded(true);
  };

  // use bugsnag instead of console.warn
  if (!state.isReady || !state.fontLoaded)
    return (
      <AppLoading
        startAsync={setUp}
        onFinish={() => {
          setState({ isReady: true, fontLoaded: true });
        }}
        onError={console.warn}
      />
    );

  return (
    <SafeAreaProvider>
      <AuthContext.Provider value={{ user, setUser }}>
        <OnboardingContext.Provider value={{ onboarded, setOnboarded }}>
          <SuccessMessageContext.Provider value={{ success, setSuccess }}>
            <OfflineNotice />
            {success.show ? <SuccessMessage message={success.message} /> : null}
            {onboarded ? (
              <NavigationContainer ref={navigationRef}>
                {user ? <AppNavigator /> : <AuthNavigator />}
              </NavigationContainer>
            ) : (
              <Onboarding />
            )}
            <StatusBar style="light" />
          </SuccessMessageContext.Provider>
        </OnboardingContext.Provider>
      </AuthContext.Provider>
    </SafeAreaProvider>
  );
}
