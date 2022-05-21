import React, { useState, useCallback, useMemo, useEffect } from "react";
import { View } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import { useIsFocused } from "@react-navigation/native";

import AppHeader from "../components/AppHeader";
import InfoAlert from "../components/InfoAlert";
import Screen from "../components/Screen";
import SearchBox from "../components/SearchBox";
import VipSearchResultList from "../components/VipSearchResultList";
import VipThoughtCardList from "../components/VipThoughtCardList";
import VipScreenOptions from "../components/VipScreenOptions";

import Constant from "../navigation/NavigationConstants";

import usersApi from "../api/users";

import debounce from "../utilities/debounce";
import storeDetails from "../utilities/storeDetails";
import apiActivity from "../utilities/apiActivity";
import defaultProps from "../utilities/defaultProps";

import useAuth from "../auth/useAuth";
import onBoarding from "../utilities/onBoarding";
import ScreenSub from "../components/ScreenSub";

let defaultSearchHistory = [];

function VipSearchScreen({ navigation }) {
  const { user, setUser } = useAuth();
  let isUnmounting = false;
  const isFocused = useIsFocused();
  const { tackleProblem } = apiActivity;
  const { onboardingKeys, isInfoSeen, updateInfoSeen } = onBoarding;

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
  const [echoModal, setEchoModal] = useState({
    recipient: defaultProps.defaultEchoMessageRecipient,
    visible: false,
    echoMessage: { message: "" },
  });
  const [showHelp, setShowHelp] = useState(false);

  // ONBOADING INFO

  const showOnboarding = async () => {
    const isShown = await isInfoSeen(onboardingKeys.VIP_INFO);
    if (!isShown) {
      setShowHelp(true);
      updateInfoSeen(onboardingKeys.VIP_INFO);
    }
  };

  useEffect(() => {
    showOnboarding();

    return () => (isUnmounting = true);
  }, []);

  useEffect(() => {
    if (!isFocused && !isUnmounting && infoAlert.showInfoAlert === true) {
      setInfoAlert({
        infoAlertMessage: "",
        showInfoAlert: false,
      });
    }
  }, [isFocused]);

  useEffect(() => {
    if (!isFocused && !isUnmounting && isVisible === true) {
      setIsVisible(false);
    }
  }, [isFocused]);

  useEffect(() => {
    if (!isFocused && !isUnmounting && echoModal.visible === true) {
      setEchoModal({ ...echoModal, visible: false });
    }
  }, [isFocused]);

  // DATA NEEDED
  const searchHistory = useMemo(
    () => (user.searchHistory ? user.searchHistory : defaultSearchHistory),
    [user]
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
    debounce(
      async (searchQuery) => {
        if (searchQuery && searchQuery.length >= 2) {
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
      500,
      true
    ),
    [searchResult]
  );

  const updateSearchHistory = async (recipient) => {
    const { ok, data, problem } = await usersApi.addToSearchHistory(
      recipient._id
    );
    if (ok) {
      setUser(data.user);
      return storeDetails(data.user);
    } else return;
  };

  // SEARCH RESULT ACTION
  const handleOnSendThoughtButtonPress = useCallback(
    async (userToAdd) => {
      if (userToAdd) {
        let inSearchHistory = user.searchHistory.filter(
          (h) => h._id == userToAdd._id
        ).length;
        if (!inSearchHistory) {
          updateSearchHistory(userToAdd);
        }
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
    },
    [user]
  );

  const handleAddEchoButtonPress = useCallback(
    async (userToAdd) => {
      if (userToAdd) {
        let inSearchHistory = user.searchHistory.filter(
          (h) => h._id == userToAdd._id
        ).length;
        if (!inSearchHistory) {
          updateSearchHistory(userToAdd);
        }
        return navigation.navigate(Constant.VIP_ADDECHO_SCREEN, {
          recipient: userToAdd,
          from: Constant.VIP_SEARCH_SCREEN,
        });
      }
      setInfoAlert({
        infoAlertMessage: "Something went wrong! Please try again.",
        showInfoAlert: true,
      });
    },
    [user]
  );

  const handleImagePress = useCallback((recipient) => {
    navigation.push(Constant.ECHO_MODAL_SCREEN, {
      recipient,
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

  const handleCloseOptionModal = useCallback(() => {
    setIsVisible(false);
  }, []);

  return (
    <>
      <Screen style={styles.container}>
        <AppHeader
          leftIcon="arrow-back"
          onPressLeft={handleLeftPress}
          onPressRight={handleHelpPress}
          rightIcon="help-outline"
          title="Vip"
          tip="Only SeeYot Vip members can interact with people outside their contacts."
          showTip={showHelp}
          setShowTip={setShowHelp}
        />

        <ScreenSub>
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
            onImagePress={handleImagePress}
            onSendThoughtsPress={handleOnSendThoughtButtonPress}
            users={searchResult}
          />
        </ScreenSub>
      </Screen>

      <VipScreenOptions
        apiProcessing={apiProcessing}
        isVisible={isVisible}
        handleCloseOptionModal={handleCloseOptionModal}
        handlePopUpAddEchoButtonPress={handlePopUpAddEchoButtonPress}
        handlePopUpOnSendThoughtButtonPress={
          handlePopUpOnSendThoughtButtonPress
        }
        hanldeRemoveFromSearchHistory={hanldeRemoveFromSearchHistory}
      />
      <InfoAlert
        description={infoAlert.infoAlertMessage}
        leftPress={handleCloseInfoAlert}
        visible={infoAlert.showInfoAlert}
      />
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
  removeFromSearchHstoryButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: "40@s",
    width: "100%",
  },
});

export default VipSearchScreen;
