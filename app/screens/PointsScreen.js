import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { AdMobRewarded } from "expo-ads-admob";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";

import Screen from "../components/Screen";
import AppHeader from "../components/AppHeader";

import useAuth from "../auth/useAuth";

import defaultStyles from "../config/styles";

import ApiActivity from "../components/ApiActivity";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import AppTextInput from "../components/AppTextInput";
import Details from "../components/Details";
import InfoAlert from "../components/InfoAlert";
import LoadingIndicator from "../components/LoadingIndicator";
import Alert from "../components/Alert";

import apiFlow from "../utilities/ApiActivityStatus";
import asyncStorage from "../utilities/cache";
import debounce from "../utilities/debounce";
import DataConstants from "../utilities/DataConstants";

import usersApi from "../api/users";

const Points = {
  totalPoints: 0,
};

function PointsScreen({ navigation }) {
  const { user, setUser } = useAuth();
  const { apiActivityStatus, initialApiActivity } = apiFlow;

  // STATES
  const [showAlert, setShowAlert] = useState(false);
  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [apiActivity, setApiActivity] = useState({
    message: "",
    processing: true,
    visible: false,
    success: false,
  });

  // ALERT ACTION
  const handleCloseAlert = useCallback(() => {
    setShowAlert(false);
  }, []);

  const handleEarnMorePointsPress = useCallback(() => {
    setShowAlert(false);
    handleShowAd();
  });

  // API ACTIVITY ACTIONS
  const handleApiActivityClose = useCallback(
    () => setApiActivity({ ...apiActivity, visible: false }),
    []
  );

  // HEADER ACTION
  const handleBack = useCallback(
    debounce(
      () => {
        navigation.goBack();
      },
      500,
      true
    ),
    []
  );

  // INFO ALERT ACTION
  const handleCloseInfoAlert = useCallback(
    () => setInfoAlert({ infoAlertMessage: "", showInfoAlert: false }),
    []
  );

  const removeAllListeners = async () => {
    const result = await AdMobRewarded.removeAllListeners();
  };

  const updatePoints = async () => {
    let modifiedUser = { ...user };
    const { ok, problem, data } = await usersApi.updatePoints();
    if (ok) {
      modifiedUser.points = data.points;
      setUser(modifiedUser);
      await asyncStorage.store(DataConstants.POINTS, data.points);
      return setShowAlert(true);
    }

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
  };

  const subscription1 = async () =>
    await AdMobRewarded.addEventListener(
      "rewardedVideoUserDidEarnReward",
      () => {
        setIsLoading(false);
        return updatePoints();
      }
    );

  const subsciption2 = async () =>
    await AdMobRewarded.addEventListener("rewardedVideoDidFailToLoad", () => {
      setIsLoading(false);
      return setInfoAlert({
        infoAlertMessage: "Something went wrong! Please try again.",
        showInfoAlert: true,
      });
    });

  useEffect(() => {
    let listenEvents = true;
    if (listenEvents) {
      subscription1();
      subsciption2();
    }

    return () => removeAllListeners();
  }, []);

  const handleShowAd = debounce(
    async () => {
      setIsLoading(true);
      try {
        await AdMobRewarded.setAdUnitID(
          "ca-app-pub-3940256099942544/5224354917"
        ); // Test admob ID
        await AdMobRewarded.requestAdAsync();
        await AdMobRewarded.showAdAsync();
      } catch (error) {
        setIsLoading(false);
        setInfoAlert({
          infoAlertMessage:
            "Problem has occured while loading the ad. Please try again.",
          showInfoAlert: true,
        });
      }
    },
    1000,
    true
  );

  const calculateTotalRedeemablePoints = (points) => {
    let totalPoints = points;
    let totalUnRedeemablePoints = points % 20;

    return totalPoints - totalUnRedeemablePoints;
  };

  const handleRedeemPoints = debounce(
    async () => {
      initialApiActivity(setApiActivity, "Redeeming Points...");
      let modifiedUser = { ...user };

      const response = await usersApi.redeemPoints(pointsToRedeem);

      if (response.ok) {
        setPointsToRedeem(0);
        modifiedUser.vip = response.data.vip;
        modifiedUser.points = response.data.points;
        setUser(modifiedUser);
        await asyncStorage.store(DataConstants.VIP, response.data.vip);
        await asyncStorage.store(DataConstants.POINTS, response.data.points);
      }
      return apiActivityStatus(response, setApiActivity);
    },
    1000,
    true
  );

  return (
    <Screen>
      <AppHeader
        leftIcon="arrow-back"
        title="Points"
        onPressLeft={handleBack}
      />
      <Alert
        title="Points"
        description="Congratulations! You earned 5 points. Want to collect more points?"
        leftOption="Close"
        rightOption="Yes"
        visible={showAlert}
        onRequestClose={handleCloseAlert}
        rightPress={handleEarnMorePointsPress}
        leftPress={handleCloseAlert}
      />
      <InfoAlert
        description={infoAlert.infoAlertMessage}
        visible={infoAlert.showInfoAlert}
        leftPress={handleCloseInfoAlert}
      />
      <ApiActivity
        message={apiActivity.message}
        onDoneButtonPress={handleApiActivityClose}
        onRequestClose={handleApiActivityClose}
        processing={apiActivity.processing}
        success={apiActivity.success}
        visible={apiActivity.visible}
      />
      <LoadingIndicator visible={isLoading} />
      <ScrollView contentContainerStyle={styles.container}>
        <AppText style={styles.infoText}>
          Collect points to avail Subscription to SeeYot Vip.
        </AppText>

        <Details title="Total Points:" value={user.points.totalPoints} />
        <Details
          style={{ marginBottom: 20 }}
          title="Redeemable Points:"
          value={calculateTotalRedeemablePoints(user.points.totalPoints)}
        />

        <View style={styles.redeemConatainer}>
          <AppText style={styles.redeemInfo}>
            For every 20 points, you can avail SeeYot Vip Subscription for 24
            hours. You can collect Points by watching ads.
          </AppText>

          <View style={styles.actionConatiner}>
            <AppTextInput
              keyboardType="numeric"
              onChangeText={setPointsToRedeem}
              subStyle={styles.inputSub}
              style={styles.input}
              placeholder="Enter no. of points to redeem"
            />
            <AppButton
              disabled={
                pointsToRedeem.toString().replace(/\s/g, "").length >= 2
                  ? false
                  : true
              }
              onPress={handleRedeemPoints}
              title="Redeem"
              style={styles.redeemButton}
              subStyle={styles.redeemButtonSub}
            />
          </View>
        </View>

        <AppButton
          onPress={handleShowAd}
          style={styles.collectPointsButton}
          subStyle={styles.collectPointsButtonSub}
          title="Collect Points"
        />
        <View style={styles.collectPointsInfoContainer}>
          <MaterialCommunityIcon
            name="google-ads"
            size={15}
            color={defaultStyles.colors.yellow_Variant}
            style={{ alignSelf: "flex-start" }}
          />
          <AppText style={styles.collectPointsInfo}>
            Clicking on this button will show you an Ad. For each Ad you see,
            you will be awarded 5 points.
          </AppText>
        </View>
      </ScrollView>
    </Screen>
  );
}
const styles = StyleSheet.create({
  actionConatiner: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    width: "100%",
  },
  collectPointsButton: {
    backgroundColor: defaultStyles.colors.tomato,
    borderRadius: 20,
    height: 40,
    marginBottom: 10,
    marginTop: 100,
    width: 120,
  },
  collectPointsButtonSub: {
    color: defaultStyles.colors.white,
    fontSize: 17,
  },
  collectPointsInfoContainer: {
    alignItems: "center",
    alignSelf: "center",
    borderTopColor: defaultStyles.colors.light,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 5,
    paddingVertical: 5,
    width: "80%",
  },
  collectPointsInfo: {
    color: defaultStyles.colors.blue,
    fontSize: 15,
    paddingTop: 0,
    textAlign: "left",
    width: "70%",
  },
  container: {
    alignItems: "center",
    flexGrow: 1,
  },
  infoText: {
    borderBottomWidth: 1,
    borderColor: defaultStyles.colors.yellow_Variant,
    color: defaultStyles.colors.blue,
    fontSize: 18,
    marginVertical: 10,
    paddingHorizontal: 10,
    textAlign: "center",
    textAlignVertical: "center",
    width: "95%",
  },
  input: {
    paddingHorizontal: 5,
    width: "75%",
  },
  inputSub: {
    fontSize: 18,
    textAlign: "center",
  },
  redeemConatainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.light,
    borderColor: defaultStyles.colors.lightGrey,
    borderRadius: 5,
    borderWidth: 1,
    padding: 10,
    width: "85%",
  },
  redeemInfo: {
    color: defaultStyles.colors.dark_Variant,
    fontSize: 15,
    marginBottom: 15,
    textAlign: "left",
    letterSpacing: 0.3,
  },
  redeemButton: {
    backgroundColor: defaultStyles.colors.tomato,
    height: 35,
    width: "20%",
  },
  redeemButtonSub: {
    color: defaultStyles.colors.white,
    fontSize: 16,
  },
});

export default PointsScreen;
