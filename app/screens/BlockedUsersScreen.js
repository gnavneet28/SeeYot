import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { FlatList } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import { useIsFocused } from "@react-navigation/native";

import AppHeader from "../components/AppHeader";
import InfoAlert from "../components/InfoAlert";
import AppText from "../components/AppText";
import BlockedUserCard from "../components/BlockedUserCard";
import ItemSeperatorComponent from "../components/ItemSeperatorComponent";
import Screen from "../components/Screen";

import debounce from "../utilities/debounce";
import storeDetails from "../utilities/storeDetails";
import ApiContext from "../utilities/apiContext";
import apiActivity from "../utilities/apiActivity";

import useAuth from "../auth/useAuth";

import myApi from "../api/my";
import ScreenSub from "../components/ScreenSub";

function BlockedUsersScreen({ navigation }) {
  const { user, setUser } = useAuth();
  const { tackleProblem } = apiActivity;
  let canShowOnBlockedScreen = useRef(true);
  let isUnmounting = false;
  const isFocused = useIsFocused();

  // STATES
  const [apiProcessing, setApiProcessing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });
  // INFO ALERT ACTION
  const handleCloseInfoAlert = useCallback(
    () => setInfoAlert({ ...infoAlert, showInfoAlert: false }),
    []
  );

  // DATA NEEDED
  const currentUser = {
    blocked: user.blocked ? user.blocked : [],
  };

  const data = useMemo(
    () => (typeof user.blocked !== "undefined" ? user.blocked : []),
    [user.blocked.length]
  );

  // on mount and unmount

  useEffect(() => {
    return () => (isUnmounting = true);
  }, []);

  useEffect(() => {
    if (isFocused && !isUnmounting && !canShowOnBlockedScreen.current) {
      canShowOnBlockedScreen.current = true;
    } else if (!isFocused && !isUnmounting) {
      canShowOnBlockedScreen.current = false;
    }
  }, [isFocused]);

  // HAEDER ACTION
  const handleBackPress = useCallback(
    debounce(
      () => {
        navigation.goBack();
      },
      500,
      true
    ),
    []
  );

  // BLOCK LIST ACTION
  const handleRefresh = async () => {
    setRefreshing(true);

    const { ok, data, problem } = await myApi.getBlockList();
    if (ok && !isUnmounting) {
      await storeDetails(data.user);
      setUser(data.user);
      return setRefreshing(false);
    }

    setRefreshing(false);
    if (canShowOnBlockedScreen.current) {
      tackleProblem(problem, data, setInfoAlert);
    }
  };

  const renderItem = useCallback(
    ({ item }) => <BlockedUserCard blockedUser={item} />,
    []
  );

  const keyExtractor = useCallback((item) => item._id, []);

  return (
    <>
      <Screen style={styles.container}>
        <AppHeader
          leftIcon="arrow-back"
          onPressLeft={handleBackPress}
          title="Blocklist"
        />
        <ScreenSub>
          {user && !currentUser.blocked.length ? (
            <AppText style={styles.emptyBlocklistInfo}>
              Blocklist is empty.
            </AppText>
          ) : null}
          <ApiContext.Provider value={{ apiProcessing, setApiProcessing }}>
            <FlatList
              data={data}
              ItemSeparatorComponent={ItemSeperatorComponent}
              keyExtractor={keyExtractor}
              onRefresh={handleRefresh}
              refreshing={refreshing}
              renderItem={renderItem}
              style={styles.blockList}
            />
          </ApiContext.Provider>
        </ScreenSub>
      </Screen>
      <InfoAlert
        leftPress={handleCloseInfoAlert}
        description={infoAlert.infoAlertMessage}
        visible={infoAlert.showInfoAlert}
      />
    </>
  );
}
const styles = ScaledSheet.create({
  blockList: {
    marginTop: "5@s",
  },
  emptyBlocklistInfo: {
    alignSelf: "center",
    fontSize: "15@s",
    textAlign: "center",
    top: "50@s",
  },
});

export default BlockedUsersScreen;
