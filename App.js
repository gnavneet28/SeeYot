import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppLoading from "expo-app-loading";
import * as SystemUI from "expo-system-ui";
import AccessDeniedScreen from "./app/screens/AccessDeniedScreen";
import FlashMessage from "react-native-flash-message";
import jwtDecode from "jwt-decode";
import { SocketContext, socket } from "./app/api/socketClient";

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
import useJailBreak from "./app/hooks/useJailBreak";

import Onboarding from "./app/components/Onboarding";
import OtpContext from "./app/utilities/otpContext";

export default function App() {
  const [user, setUser] = useState(null);
  const [state, setState] = useState({
    fontLoaded: false,
    isReady: false,
  });
  const [otpFailed, setOtpFailed] = useState(false);
  const jailBroken = useJailBreak();
  const [onboarded, setOnboarded] = useState(false);

  const checkOnBoard = async () => {
    let userOnboarded = await cache.get("onboarded");
    if (userOnboarded) return setOnboarded(true);
  };

  const restoreUser = async () => {
    const token = await authStorage.getUser();
    if (token) {
      let decodedToken = jwtDecode(token);
      const cachedUser = await getDetails();
      if (cachedUser && cachedUser._id == decodedToken._id)
        return setUser(cachedUser);
      return setUser(null);
    }
    return setUser(null);
  };

  const setUp = async () => {
    await Promise.all([
      SystemUI.setBackgroundColorAsync(defaultStyles.colors.primary),
      checkOnBoard(),
      restoreUser(),
    ]);
  };

  if (!state.isReady) {
    return (
      <AppLoading
        startAsync={setUp}
        onFinish={() => setState({ ...state, isReady: true })}
        onError={console.warn}
      />
    );
  }

  return (
    <SafeAreaProvider>
      {jailBroken ? (
        <AccessDeniedScreen />
      ) : (
        <AuthContext.Provider value={{ user, setUser }}>
          <OnboardingContext.Provider value={{ onboarded, setOnboarded }}>
            <OtpContext.Provider value={{ otpFailed, setOtpFailed }}>
              <OfflineNotice />
              {onboarded ? (
                <NavigationContainer ref={navigationRef}>
                  {user ? (
                    <SocketContext.Provider value={socket}>
                      <AppNavigator />
                    </SocketContext.Provider>
                  ) : (
                    <AuthNavigator />
                  )}
                </NavigationContainer>
              ) : (
                <Onboarding />
              )}
              <StatusBar style="light" />
              <FlashMessage position="top" />
            </OtpContext.Provider>
          </OnboardingContext.Provider>
        </AuthContext.Provider>
      )}
    </SafeAreaProvider>
  );
}
