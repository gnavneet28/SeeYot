import React, { useState, useCallback, useMemo } from "react";
import { View, StyleSheet, Modal } from "react-native";

import AppHeader from "../components/AppHeader";
import AppText from "../components/AppText";
import InfoAlert from "../components/InfoAlert";
import Screen from "../components/Screen";
import SearchBox from "../components/SearchBox";
import VipSearchedUserList from "../components/VipSearchedUserList";
import VipThoughtCardList from "../components/VipThoughtCardList";

import defaultStyles from "../config/styles";

import usersApi from "../api/users";

import asyncStorage from "../utilities/cache";
import debounce from "../utilities/debounce";

import useAuth from "../auth/useAuth";

let defaultSearchHistory = [];

function VipSearchScreen({ navigation }) {
  const { user, setUser } = useAuth();

  // STATES
  const [interestedUser, setInterestedUser] = useState(null);
  const [searchResult, setSearchResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });

  // DATA NEEDED
  const searchHistory = useMemo(
    () => (user.searchHistory ? user.searchHistory : defaultSearchHistory),
    [user.searchHistory.length]
  );

  // INFO ALERT ACTION
  const handleCloseInfoAlert = useCallback(
    () => setInfoAlert({ ...infoAlert, showInfoAlert: false }),
    []
  );

  // HEADER ACTION
  const handleLeftPress = useCallback(
    debounce(
      () => {
        navigation.goBack();
      },
      500,
      true
    ),
    []
  );

  // SEARCH HISTORY ACTION
  const handleThougthCardPress = useCallback((user) => {
    setInterestedUser(user);
    setIsVisible(true);
  }, []);

  // SEARCH ACTION
  const handleSearchQuery = useCallback(
    async (searchQuery) => {
      if (searchQuery && searchQuery.length >= 3) {
        setIsLoading(true);
        const { data, problem, ok } = await usersApi.searchUser(searchQuery);
        if (ok) {
          setIsLoading(false);
          return setSearchResult(data);
        }
        if (data) {
          setIsLoading(false);
          return setInfoAlert({
            ...infoAlert,
            infoAlertMessage: data.message,
            showInfoAlert: true,
          });
        }

        setIsLoading(false);
        return setInfoAlert({
          ...infoAlert,
          infoAlertMessage: problem,
          showInfoAlert: true,
        });
      }
      setSearchResult([]);
    },
    [searchResult]
  );

  // SEARCH RESULT ACTION
  const handleOnSendThoughtButtonPress = useCallback(async (userToAdd) => {
    if (userToAdd) {
      return navigation.navigate("VipSendThought", {
        recipient: userToAdd,
        from: "VipSearchScreen",
      });
    }

    setInfoAlert({
      ...infoAlert,
      infoAlertMessage: "Something went wrong! Please try again.",
      showInfoAlert: true,
    });
  }, []);

  const handleAddEchoButtonPress = useCallback(async (userToAdd) => {
    if (userToAdd) {
      return navigation.navigate("VipAddEcho", {
        recipient: userToAdd,
        from: "VipSearchScreen",
      });
    }
    setInfoAlert({
      ...infoAlert,
      infoAlertMessage: "Something went wrong! Please try again.",
      showInfoAlert: true,
    });
  }, []);

  // SEARCH HISTORY OPTION AND ACTION

  const handlePopUpOnSendThoughtButtonPress = useCallback(async () => {
    setIsVisible(false);
    if (interestedUser) {
      return navigation.navigate("VipSendThought", {
        recipient: interestedUser,
        from: "VipSearchScreen",
      });
    }

    setInfoAlert({
      ...infoAlert,
      infoAlertMessage: "Something went wrong! Please try again.",
      showInfoAlert: true,
    });
  }, [interestedUser]);

  const handlePopUpAddEchoButtonPress = useCallback(async () => {
    setIsVisible(false);
    if (interestedUser) {
      return navigation.navigate("VipAddEcho", {
        recipient: interestedUser,
        from: "VipSearchScreen",
      });
    }
    setInfoAlert({
      ...infoAlert,
      infoAlertMessage: "Something went wrong! Please try again.",
      showInfoAlert: true,
    });
  }, [interestedUser]);

  const hanldeRemoveFromSearchHistory = useCallback(async () => {
    let modifiedUser = { ...user };
    const { ok, problem, data } = await usersApi.removeFromSearchHstory(
      interestedUser
    );
    if (ok) {
      modifiedUser.searchHistory = data;
      setUser(modifiedUser);
      setIsVisible(false);
      await asyncStorage.store("userSearchHistory", data);
      return;
    }
    if (data) {
      setIsVisible(false);
      return setInfoAlert({
        ...infoAlert,
        infoAlertMessage: data.message,
        showInfoAlert: true,
      });
    }

    setIsVisible(false);
    setInfoAlert({
      ...infoAlert,
      infoAlertMessage: problem,
      showInfoAlert: true,
    });
  }, [interestedUser, user]);

  return (
    <>
      <Screen style={styles.container}>
        <AppHeader
          leftIcon="arrow-back"
          onPressLeft={handleLeftPress}
          title="Vip Area"
        />
        <InfoAlert
          leftPress={handleCloseInfoAlert}
          description={infoAlert.infoAlertMessage}
          visible={infoAlert.showInfoAlert}
        />
        <SearchBox
          invite={false}
          list={searchResult}
          onChange={handleSearchQuery}
          placeholder="Search people on SeeYot..."
        />
        {user.searchHistory.length > 0 ? (
          <View style={styles.matchedThoughtsContainer}>
            <VipThoughtCardList
              users={searchHistory}
              onThoughtCardPress={handleThougthCardPress}
            />
          </View>
        ) : null}
        <VipSearchedUserList
          isLoading={isLoading}
          onAddEchoPress={handleAddEchoButtonPress}
          onSendThoughtsPress={handleOnSendThoughtButtonPress}
          users={searchResult}
        />
      </Screen>
      <Modal
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
        transparent={true}
        visible={isVisible}
      >
        <View style={styles.searchHistoryMainContainer}>
          <View style={styles.optionsContainer}>
            <AppText
              style={[styles.option, { color: defaultStyles.colors.blue }]}
              onPress={() => setIsVisible(false)}
            >
              Close
            </AppText>
            <AppText
              style={styles.option}
              onPress={hanldeRemoveFromSearchHistory}
            >
              Remove
            </AppText>
            <AppText
              style={styles.option}
              onPress={handlePopUpAddEchoButtonPress}
            >
              Add Echo
            </AppText>
            <AppText
              style={styles.option}
              onPress={handlePopUpOnSendThoughtButtonPress}
            >
              Send Thoughts
            </AppText>
          </View>
        </View>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  matchedThoughtsContainer: {
    borderRadius: 5,
    height: 100,
    paddingHorizontal: 10,
    width: "100%",
  },
  optionsContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: 10,
    overflow: "hidden",
    width: "60%",
  },
  option: {
    borderBottomColor: defaultStyles.colors.light,
    borderBottomWidth: 1,
    fontSize: 18,
    height: defaultStyles.dimensionConstants.height,
    opacity: 0.8,
    textAlign: "center",
    textAlignVertical: "center",
    width: "100%",
  },
  searchHistoryMainContainer: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
});

export default VipSearchScreen;
