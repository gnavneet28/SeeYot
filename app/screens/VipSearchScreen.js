import React, { useState, useCallback, useMemo, useEffect } from "react";
import { View, Modal } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import { useIsFocused } from "@react-navigation/native";

import AppHeader from "../components/AppHeader";
import ApiOption from "../components/ApiOption";
import InfoAlert from "../components/InfoAlert";
import Option from "../components/Option";
import Screen from "../components/Screen";
import SearchBox from "../components/SearchBox";
import VipSearchResultList from "../components/VipSearchResultList";
import VipThoughtCardList from "../components/VipThoughtCardList";
import HelpDialogueBox from "../components/HelpDialogueBox";

import Constant from "../navigation/NavigationConstants";

import defaultStyles from "../config/styles";

import usersApi from "../api/users";

import useMountedRef from "../hooks/useMountedRef";

import debounce from "../utilities/debounce";
import storeDetails from "../utilities/storeDetails";
import apiActivity from "../utilities/apiActivity";

import useAuth from "../auth/useAuth";

let defaultSearchHistory = [];

function VipSearchScreen({ navigation }) {
  const { user, setUser } = useAuth();
  const mounted = useMountedRef().current;
  const isFocused = useIsFocused();
  const { tackleProblem } = apiActivity;

  // STATES
  const [apiProcessing, setApiProcessing] = useState(false);
  const [interestedUser, setInterestedUser] = useState(null);
  const [searchResult, setSearchResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (!isFocused && mounted && infoAlert.showInfoAlert === true) {
      setInfoAlert({
        infoAlertMessage: "",
        showInfoAlert: false,
      });
    }
  }, [isFocused, mounted]);

  useEffect(() => {
    if (!isFocused && mounted && isVisible === true) {
      setIsVisible(false);
    }
  }, [isFocused, mounted]);

  // DATA NEEDED
  const searchHistory = useMemo(
    () => (user.searchHistory ? user.searchHistory : defaultSearchHistory),
    [user.searchHistory]
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
        setIsLoading(false);
        tackleProblem(problem, data, setInfoAlert);
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

  const hanldeRemoveFromSearchHistory = useCallback(
    debounce(
      async () => {
        setApiProcessing(true);
        const { ok, problem, data } = await usersApi.removeFromSearchHstory(
          interestedUser._id
        );
        if (ok) {
          const res = await usersApi.getCurrentUser();
          if (res.ok && res.data) {
            if (res.data.__v > data.user.__v) {
              await storeDetails(res.data);
              setUser(res.data);
              setApiProcessing(false);
              return setIsVisible(false);
            }
          }
          setApiProcessing(false);
          setIsVisible(false);
          await storeDetails(data.user);
          return setUser(data.user);
        }
        setApiProcessing(false);
        setIsVisible(false);
        tackleProblem(problem, data, setInfoAlert);
      },
      5000,
      true
    ),
    [interestedUser, user]
  );

  return (
    <>
      <Screen style={styles.container}>
        <AppHeader
          leftIcon="arrow-back"
          onPressLeft={handleLeftPress}
          onPressRight={handleHelpPress}
          rightIcon="help-outline"
          title="Vip Area"
        />
        <InfoAlert
          description={infoAlert.infoAlertMessage}
          leftPress={handleCloseInfoAlert}
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
              onThoughtCardPress={handleThougthCardPress}
              users={searchHistory}
            />
          </View>
        ) : null}
        <VipSearchResultList
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
              onPress={() => setIsVisible(false)}
              title="Close"
              titleStyle={styles.optionClose}
            />
            <ApiOption
              processing={apiProcessing}
              title="Remove"
              onPress={hanldeRemoveFromSearchHistory}
            />

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
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
  },
  matchedThoughtsContainer: {
    borderRadius: "5@s",
    height: "80@s",
    paddingHorizontal: "10@s",
    width: "100%",
  },
  optionsContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderColor: defaultStyles.colors.dark_Variant,
    borderRadius: "20@s",
    borderWidth: 1,
    overflow: "hidden",
    width: "60%",
  },
  optionClose: {
    backgroundColor: defaultStyles.colors.dark_Variant,
    color: defaultStyles.colors.white,
    opacity: 1,
  },
  removeFromSearchHstoryButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: "40@s",
    width: "100%",
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
