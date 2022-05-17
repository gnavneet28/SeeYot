import React, { useState, useCallback, useContext } from "react";
import { FlatList } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

import AppHeader from "../components/AppHeader";
import InfoAlert from "../components/InfoAlert";
import AppText from "../components/AppText";
import ItemSeperatorComponent from "../components/ItemSeperatorComponent";

import ApiContext from "../utilities/apiContext";

import defaultStyles from "../config/styles";

import ScreenSub from "../components/ScreenSub";
import AppModal from "./AppModal";
import GroupContext from "../utilities/groupContext";
import GroupBlockedCard from "./GroupBlockedCard";

function GroupBlockedUsersModal({ isVisible, handleCloseModal }) {
  const { group, setGroup } = useContext(GroupContext);
  // STATES
  const [apiProcessing, setApiProcessing] = useState("");

  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });
  // INFO ALERT ACTION
  const handleCloseInfoAlert = useCallback(
    () => setInfoAlert({ ...infoAlert, showInfoAlert: false }),
    []
  );

  // BLOCK LIST ACTION

  const renderItem = useCallback(
    ({ item }) => <GroupBlockedCard blockedUser={item} />,
    [group._id]
  );

  const keyExtractor = useCallback((item) => item._id, []);

  return (
    <>
      <AppModal
        visible={isVisible}
        animationType="slide"
        onRequestClose={handleCloseModal}
        style={styles.container}
      >
        <AppHeader
          leftIcon="arrow-back"
          onPressLeft={handleCloseModal}
          title="Group Blocklist"
        />
        <ScreenSub>
          {!group.blocked.length ? (
            <AppText style={styles.emptyBlocklistInfo}>
              Blocklist is empty.
            </AppText>
          ) : null}
          <ApiContext.Provider value={{ apiProcessing, setApiProcessing }}>
            <FlatList
              data={group.blocked}
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
