import React, { useState, useCallback, useMemo } from "react";
import { View, StyleSheet, Modal } from "react-native";

import AppHeader from "../components/AppHeader";
import InfoAlert from "../components/InfoAlert";
import Option from "../components/Option";
import Screen from "../components/Screen";
import SearchBox from "../components/SearchBox";
import VipSearchedUserList from "../components/VipSearchedUserList";
import VipThoughtCardList from "../components/VipThoughtCardList";
import HelpDialogueBox from "../components/HelpDialogueBox";

import Constant from "../navigation/NavigationConstants";

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
  const [showHelp, setShowHelp] = useState(false);

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

  const handleHelpPress = useCallback(() => {
    setShowHelp(true);
  }, []);


  const handleCloseHelp = useCallback(() => {
    setShowHelp(false);
  }, []);

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
      return navigation.navigate(Constant.VIP_SENDTHOUGHT_SCREEN, {
        recipient: userToAdd,
        from: Constant.VIP_SEARCH_SCREEN,
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
      return navigation.navigate(Constant.VIP_ADDECHO_SCREEN, {
        recipient: userToAdd,
        from: Constant.VIP_SEARCH_SCREEN,
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
      return navigation.navigate(Constant.VIP_SENDTHOUGHT_SCREEN, {
        recipient: interestedUser,
        from: Constant.VIP_SEARCH_SCREEN,
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
      return navigation.navigate(Constant.VIP_ADDECHO_SCREEN, {
        recipient: interestedUser,
        from: Constant.VIP_SEARCH_SCREEN,
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
          rightIcon="help-outline"
          onPressRight={handleHelpPress}
        />
        <InfoAlert
          leftPress={handleCloseInfoAlert}
          description={infoAlert.infoAlertMessage}
          visible={infoAlert.showInfoAlert}
        />
        <SearchBox
          invite={false}
          list={searchResult}
          loading={isLoading}
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
      <HelpDialogueBox
        information="Only SeeYot Vip members can search people outside their contacts and interact with them."
        onPress={handleCloseHelp}
        setVisible={setShowHelp}
        visible={showHelp}
      />
      <Modal
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
        transparent={true}
        visible={isVisible}
      >
        <View style={styles.searchHistoryMainContainer}>
          <View style={styles.optionsContainer}>
            <Option
              title="Close"
              titleStyle={styles.optionClose}
              onPress={() => setIsVisible(false)}
            />

            <Option title="Remove" onPress={hanldeRemoveFromSearchHistory} />

            <Option title="Add Echo" onPress={handlePopUpAddEchoButtonPress} />
            <Option
              title="Send Thoughts"
              onPress={handlePopUpOnSendThoughtButtonPress}
            />
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
    borderColor: defaultStyles.colors.dark_Variant,
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    width: "60%",
  },
  optionClose: {
    backgroundColor: defaultStyles.colors.dark_Variant,
    color: defaultStyles.colors.white,
    opacity: 1,
  },
  searchHistoryMainContainer: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
});

export default VipSearchScreen;
