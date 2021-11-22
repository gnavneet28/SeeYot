import React, { useState, useCallback } from "react";
import { Image, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";

import getDetails from "./app/utilities/getDetails";
import storeDetails from "./app/utilities/storeDetails";

import { navigationRef } from "./app/navigation/rootNavigation";
import AppNavigator from "./app/navigation/AppNavigator";
import AuthNavigator from "./app/navigation/AuthNavigator";

import OfflineNotice from "./app/components/OfflineNotice";

import AuthContext from "./app/auth/context";
import authStorage from "./app/auth/storage";

import usersApi from "./app/api/users";
import Screen from "./app/components/Screen";
import Onboarding from "./app/components/Onboarding";

export default function App() {
  const [user, setUser] = useState(null);
  const [state, setState] = useState({
    fontLoaded: false,
    isReady: false,
  });

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
      const { data, ok, problem } = await usersApi.getCurrentUser();
      if (ok) {
        await storeDetails(data);
        return setUser(data);
      }
      if (problem) {
        if (data) {
          if (
            data.message == "Invalid Token" ||
            data.message == "Access denied! No token provided"
          )
            return setUser(null);
        }

        const cachedUser = await getDetails();
        return setUser(cachedUser);
      }
    }

    return setUser(null);
  };

  const setUp = async () => {
    if (!state.fontLoaded) {
      await loadFont();
    }
    await restoreUser();
  };

  if (!state.isReady || !state.fontLoaded)
    return (
      <AppLoading
        startAsync={setUp}
        onFinish={() => {
          setState({ ...state, isReady: true, fontLoaded: true });
        }}
        onError={console.warn}
      />
    );

  return (
    // <Screen>
    //   <Onboarding />
    // </Screen>
    <SafeAreaProvider>
      <AuthContext.Provider value={{ user, setUser }}>
        <Image
          style={styles.wallPaperImage}
          source={require("./app/assets/chatWallPaper.png")}
        />
        <OfflineNotice />
        <NavigationContainer ref={navigationRef}>
          {user ? <AppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
        <StatusBar style="light" />
      </AuthContext.Provider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  wallPaperImage: {
    position: "absolute",
    top: -20,
    opacity: 0,
  },
});
