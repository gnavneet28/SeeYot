import React, { useState, useCallback, useMemo } from "react";
import { FlatList } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

import AppHeader from "../components/AppHeader";
import InfoAlert from "../components/InfoAlert";
import AppText from "../components/AppText";
import BlockedUserCard from "../components/BlockedUserCard";
import ItemSeperatorComponent from "../components/ItemSeperatorComponent";

import debounce from "../utilities/debounce";
import ApiContext from "../utilities/apiContext";
import apiActivity from "../utilities/apiActivity";

import useAuth from "../auth/useAuth";

import defaultStyles from "../config/styles";

import ScreenSub from "../components/ScreenSub";
import AppModal from "./AppModal";

function GroupBlockedUsersModal({ isVisible, handleCloseModal }) {
  const { user, setUser } = useAuth();
  const { tackleProblem } = apiActivity;

  // STATES
  const [apiProcessing, setApiProcessing] = useState(false);

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

  const renderItem = useCallback(
    ({ item }) => <BlockedUserCard blockedUser={item} />,
    []
  );

  const keyExtractor = useCallback((item) => item._id, []);

  return (
    <>
      <AppModal style={styles.container}>
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
              renderItem={renderItem}
              style={styles.blockList}
            />
          </ApiContext.Provider>
        </ScreenSub>
      </AppModal>
      <InfoAlert
        leftPress={handleCloseInfoAlert}
        description={infoAlert.infoAlertMessage}
        visible={infoAlert.showInfoAlert}
      />
    </>
  );
}
const styles = ScaledSheet.create({
  container: {
    width: defaultStyles.width,
    flex: 1,
  },
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

export default GroupBlockedUsersModal;
