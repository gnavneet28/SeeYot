import React, { useState, useCallback, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ScaledSheet, scale } from "react-native-size-matters";

import AppText from "./AppText";
import InfoAlert from "./InfoAlert";

import useAuth from "../auth/useAuth";

import thoughtsApi from "../api/thoughts";

import defaultStyles from "../config/styles";

import asyncStorage from "../utilities/cache";
import DataConstants from "../utilities/DataConstants";
import debounce from "../utilities/debounce";

function ThoughtTimer({ thought }) {
  let currentDate = Date.now();
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
        color={defaultStyles.colors.dark_Variant}
        name="timer-outline"
        size={scale(25)}
        style={styles.timerIcon}
      />
      <View style={styles.thoughtDetailsContainer}>
        <AppText style={styles.message}>{thought.message}</AppText>
        <AppText style={styles.createdAt}>
          {Math.ceil(
            10 -
              dayjs(currentDate).diff(dayjs(thought.createdAt), "seconds") / 60
          )}{" "}
          minutes left.
        </AppText>
      </View>
      <View style={styles.deleteContainer}>
        {!processing ? (
          <MaterialCommunityIcons
            color={defaultStyles.colors.danger}
            name="delete-circle-outline"
            onPress={handleDeletePress}
            size={scale(20)}
          />
        ) : (
          <ActivityIndicator
            size={scale(16)}
            color={defaultStyles.colors.tomato}
          />
        )}
      </View>
      <InfoAlert
        description={infoAlert.infoAlertMessage}
        leftPress={handleCloseInfoAlert}
        visible={infoAlert.showInfoAlert}
      />
    </View>
  );
}

const styles = ScaledSheet.create({
  createdAt: {
    color: defaultStyles.colors.lightGrey,
    fontSize: "10@s",
    paddingTop: 0,
  },
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "5@s",
    flexDirection: "row",
    marginVertical: "5@s",
    padding: "8@s",
    width: "96%",
  },
  deleteContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.light,
    borderColor: defaultStyles.colors.light,
    borderRadius: "10@s",
    borderWidth: 1,
    height: "30@s",
    justifyContent: "center",
    marginHorizontal: "15@s",
    width: "30@s",
  },
  thoughtDetailsContainer: {
    width: "70%",
  },
  message: {
    fontSize: "13@s",
    paddingBottom: 0,
  },
  timerIcon: {
    marginHorizontal: "5@s",
  },
});

export default ThoughtTimer;
