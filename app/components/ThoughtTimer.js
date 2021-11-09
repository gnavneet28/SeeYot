import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import AppText from "./AppText";
import InfoAlert from "./InfoAlert";

import useAuth from "../auth/useAuth";

import thoughtsApi from "../api/thoughts";

import defaultStyles from "../config/styles";

import asyncStorage from "../utilities/cache";
import DataConstants from "../utilities/DataConstants";
import debounce from "../utilities/debounce";

function ThoughtTimer({ thought }) {
  dayjs.extend(relativeTime);

  const { user, setUser } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });

  // INFO ALERT ACTIONS
  const handleCloseInfoAlert = useCallback(async () => {
    setInfoAlert({ showInfoAlert: false });
  }, []);

  const handleDeletePress = useCallback(
    debounce(
      async () => {
        setProcessing(true);
        let modifiedUser = { ...user };

        const { ok, data, problem } = await thoughtsApi.deleteThought(
          thought._id
        );

        if (ok) {
          modifiedUser.thoughts = data.thoughts;
          setUser(modifiedUser);
          await asyncStorage.store(DataConstants.THOUGHTS, data.thoughts);
          return;
        }

        setProcessing(false);

        if (problem) {
          if (data) {
            return setInfoAlert({
              infoAlertMessage: data.message,
              showInfoAlert: true,
            });
          }

          return setInfoAlert({
            infoAlertMessage: "Something went wrong! Please try again.",
            showInfoAlert: true,
          });
        }
      },
      1000,
      true
    ),
    [thought, user.thoughts]
  );

  useEffect(() => {
    setProcessing(false);

    return () => setProcessing(false);
  }, [thought._id]);

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        style={styles.timerIcon}
        name="timer-outline"
        size={25}
        color={defaultStyles.colors.dark_Variant}
      />
      <View style={styles.thoughtDetailsContainer}>
        <AppText style={styles.message}>{thought.message}</AppText>
        <AppText style={styles.createdAt}>
          Sent {dayjs(thought.createdAt).fromNow()}
        </AppText>
      </View>
      <View style={styles.deleteContainer}>
        {!processing ? (
          <MaterialCommunityIcons
            name="delete-circle-outline"
            size={20}
            onPress={handleDeletePress}
            color={defaultStyles.colors.danger}
          />
        ) : (
          <ActivityIndicator size={18} color={defaultStyles.colors.tomato} />
        )}
      </View>
      <InfoAlert
        leftPress={handleCloseInfoAlert}
        description={infoAlert.infoAlertMessage}
        visible={infoAlert.showInfoAlert}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  createdAt: {
    color: defaultStyles.colors.lightGrey,
    fontSize: 12,
    paddingTop: 0,
  },
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: 5,
    flexDirection: "row",
    marginVertical: 10,
    padding: 8,
    width: "96%",
  },
  deleteContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.light,
    borderColor: defaultStyles.colors.light,
    borderRadius: 10,
    borderWidth: 1,
    height: 35,
    justifyContent: "center",
    marginHorizontal: 15,
    width: 35,
  },
  thoughtDetailsContainer: {
    width: "70%",
  },
  message: {
    fontSize: 15,
    paddingBottom: 0,
  },
  timerIcon: {
    marginHorizontal: 10,
  },
});

export default ThoughtTimer;
