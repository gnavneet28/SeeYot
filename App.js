import React, { useState, useCallback, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppLoading from "expo-app-loading";
import * as SystemUI from "expo-system-ui";
import { Image } from "react-native";
import { Asset } from "expo-asset";
import Bugsnag from "@bugsnag/react-native";
import AccessDeniedScreen from "./app/screens/AccessDeniedScreen";
import * as IAP from "expo-in-app-purchases";

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
import SuccessMessage from "./app/components/SuccessMessage";
import SuccessMessageContext from "./app/utilities/successMessageContext";

function cacheImages(images) {
  return images.map((image) => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

export default function App() {
  const [user, setUser] = useState(null);
  const [state, setState] = useState({
    fontLoaded: false,
    isReady: false,
  });
  const jailBroken = useJailBreak();
  const [success, setSuccess] = useState({
    message: "",
    show: false,
  });
  const [onboarded, setOnboarded] = useState(false);

  const checkOnBoard = async () => {
    let userOnboarded = await cache.get("onboarded");
    if (userOnboarded) return setOnboarded(true);
  };

  useEffect(() => {
    const subscription = IAP.setPurchaseListener(
      ({ responseCode, errorCode, results }) => {
        console.log(errorCode, responseCode, results);
      }
    );

    return () => {
      try {
        subscription.remove();
      } catch (error) {}
      try {
        IAP.disconnectAsync();
      } catch (error) {}
    };
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
    await Promise.all([
      SystemUI.setBackgroundColorAsync(defaultStyles.colors.primary),
      checkOnBoard(),
      restoreUser(),
      // cacheImages([
      //   require("./app/assets/activeChat.png"),
      //   require("./app/assets/echoMessage.png"),
      //   require("./app/assets/nickname.png"),
      //   require("./app/assets/sendMessages.png"),
      //   require("./app/assets/sendThoughts.png"),
      //   require("./app/assets/user.png"),
      //   require("./app/assets/vipBanner.png"),
      //   require("./app/assets/logo.png"),
      // ]),
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
            <SuccessMessageContext.Provider value={{ success, setSuccess }}>
              <OfflineNotice />
              {success.show ? (
                <SuccessMessage message={success.message} />
              ) : null}
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
      )}
    </SafeAreaProvider>
  );
}
