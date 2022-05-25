import React, { useState, useEffect, useCallback } from "react";
import { ScaledSheet, scale } from "react-native-size-matters";

import AppModal from "./AppModal";
import InfoAlert from "./InfoAlert";

import defaultStyles from "../config/styles";

import groupsApi from "../api/groups";

import AppActivityIndicator from "./ActivityIndicator";
import AppText from "./AppText";
import AppHeader from "./AppHeader";
import apiActivity from "../utilities/apiActivity";
import MyGroupsListPro from "./MyGroupsListPro";
import useAuth from "../auth/useAuth";

function MyGroupsModal({
  visible,
  setVisible,
  onGroupSelection,
  groups,
  onAddEchoPress,
  onSendThoughtsPress,
  isFocused,
}) {
  const { tackleProblem } = apiActivity;
  const { user } = useAuth();
  const [myGroups, setMyGroups] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });
  const [refreshing, setRefreshing] = useState(false);

  // INFO ALERT ACTION
  const handleCloseInfoAlert = useCallback(
    () => setInfoAlert({ ...infoAlert, showInfoAlert: false }),
    []
  );

  const getGroups = async () => {
    const { ok, data, problem } = await groupsApi.getMyGroups();
    if (ok) {
      setMyGroups(data.groups);
      return setIsReady(true);
    }
    if (problem) {
      setIsReady(true);
      tackleProblem(problem, data, setInfoAlert);
    }
  };

  const handleRefresh = useCallback(() => {
    getGroups();
  }, []);

  useEffect(() => {
    if (visible) {
      getGroups();
    }
  }, [visible]);

  return (
    <>
      <AppModal
        visible={visible}
        onRequestClose={() => setVisible(false)}
        style={styles.container}
        animationType="slide"
      >
        <AppHeader
          title="My Groups"
          leftIcon="arrow-back"
          onPressLeft={() => setVisible(false)}
        />
        {isReady ? (
          myGroups.length ? (
            <MyGroupsListPro
              isFocused={isFocused}
              inputBoxStyle={styles.inputBoxStyle}
              onAddEchoPress={onAddEchoPress}
              onSendThoughtsPress={onSendThoughtsPress}
              groups={myGroups}
              user={user}
              onVisitGroupPress={onGroupSelection}
              refreshing={refreshing}
              onRefresh={handleRefresh}
              showBlocked={true}
              showCategory={true}
            />
          ) : (
            <AppText style={styles.noGroupsInfo}>No groups to show!</AppText>
          )
        ) : (
          <AppActivityIndicator />
        )}
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
    backgroundColor: defaultStyles.colors.white,
  },
  inputBoxStyle: { borderRadius: "7@s" },
  noGroupsInfo: {
    flex: 1,
    fontSize: "15@s",
    textAlign: "center",
  },
});

export default MyGroupsModal;
