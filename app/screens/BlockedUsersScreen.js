import React, { useState, useCallback, useMemo } from "react";
import { FlatList } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import { useIsFocused } from "@react-navigation/native";

import AppHeader from "../components/AppHeader";
import ApiActivity from "../components/ApiActivity";
import AppText from "../components/AppText";
import BlockedUserCard from "../components/BlockedUserCard";
import ItemSeperatorComponent from "../components/ItemSeperatorComponent";
import Screen from "../components/Screen";

import asyncStorage from "../utilities/cache";
import apiFlow from "../utilities/ApiActivityStatus";
import debounce from "../utilities/debounce";
import DataConstants from "../utilities/DataConstants";

import useAuth from "../auth/useAuth";

import useMountedRef from "../hooks/useMountedRef";

import myApi from "../api/my";
import userApi from "../api/users";

function BlockedUsersScreen({ navigation }) {
  const { user, setUser } = useAuth();
  const mounted = useMountedRef().current;
  const isFocused = useIsFocused();
  const { apiActivityStatus, initialApiActivity } = apiFlow;

  // STATES
  const [refreshing, setRefreshing] = useState(false);
  const [apiActivity, setApiActivity] = useState({
    message: "",
    processing: true,
    visible: false,
    success: false,
  });

  useEffect(() => {
    if (mounted && apiActivity.visible === true) {
      setApiActivity({
        message: "",
        processing: true,
        visible: false,
        success: false,
      });
    }
  }, [isFocused, mounted]);

  // API ACTIVITY ACTIONS
  const handleApiActivityClose = useCallback(
    () => setApiActivity({ ...apiActivity, visible: false }),
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

  // BLOCK ACTION
  const handleUnblockPress = async (userToUnblock) => {
    initialApiActivity(setApiActivity, `Unblocking ${userToUnblock.name}...`);
    let modifiedUser = { ...user };

    const response = await userApi.unBlockContact(userToUnblock._id);

    if (response.ok) {
      modifiedUser.blocked = response.data.blocked;
      await asyncStorage.store(DataConstants.BLOCKED, response.data.blocked);
      setUser(modifiedUser);
    }
    return apiActivityStatus(response, setApiActivity);
  };

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
    initialApiActivity(setApiActivity, "Getting blocklist...");
    let modifiedUser = { ...user };

    const response = await myApi.getBlockList();
    if (response.ok) {
      modifiedUser.blocked = response.data.blocked;
      await asyncStorage.store(DataConstants.BLOCKED, response.data.blocked);
      setUser(modifiedUser);
    }
    return apiActivityStatus(response, setApiActivity);
  };

  const renderItem = useCallback(
    ({ item }) => (
      <BlockedUserCard
        blockedUser={item}
        onUnBlockPress={() => handleUnblockPress(item)}
      />
    ),
    []
  );

  const keyExtractor = useCallback((item) => item._id, []);

  return (
    <Screen style={styles.container}>
      <AppHeader
        leftIcon="arrow-back"
        onPressLeft={handleBackPress}
        title="Blocklist"
      />
      <ApiActivity
        message={apiActivity.message}
        onDoneButtonPress={handleApiActivityClose}
        onRequestClose={handleApiActivityClose}
        processing={apiActivity.processing}
        success={apiActivity.success}
        visible={apiActivity.visible}
      />
      {user && !currentUser.blocked.length ? (
        <AppText style={styles.emptyBlocklistInfo}>Blocklist is empty.</AppText>
      ) : null}
      <FlatList
        data={data}
        ItemSeparatorComponent={ItemSeperatorComponent}
        keyExtractor={keyExtractor}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        renderItem={renderItem}
        style={styles.blockList}
      />
    </Screen>
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
