import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";

import Screen from "../components/Screen";
import AppHeader from "../components/AppHeader";
import { AdMobRewarded } from "expo-ads-admob";

import useAuth from "../auth/useAuth";

import defaultStyles from "../config/styles";
import AppText from "../components/AppText";
import AppTextInput from "../components/AppTextInput";
import AppButton from "../components/AppButton";
import InfoAlert from "../components/InfoAlert";
import LoadingIndicator from "../components/LoadingIndicator";

const Points = {
  totalPoints: 20,
};

function PointsScreen({ navigation }) {
  const { user, setUser } = useAuth();

  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });

  const [pointsToRedeem, setPointsToRedeem] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleBack = useCallback(() => navigation.goBack(), []);

  const handleCloseInfoAlert = useCallback(
    () => setInfoAlert({ infoAlertMessage: "", showInfoAlert: false }),
    []
  );

  const removeAllListeners = async () => {
    const result = await AdMobRewarded.removeAllListeners();
  };

  const subscription1 = async () =>
    await AdMobRewarded.addEventListener(
      "rewardedVideoUserDidEarnReward",
      () => {
        setIsLoading(false);
        setInfoAlert({
          infoAlertMessage: "Congrats! You earned two points.",
          showInfoAlert: true,
        });
        return console.log("Points earned!");
      }
    );

  const subsciption2 = async () =>
    await AdMobRewarded.addEventListener("rewardedVideoDidFailToLoad", () => {
      setIsLoading(false);
      return console.log("Ad failed to load");
    });

  const subsciption3 = async () =>
    await AdMobRewarded.addEventListener("rewardedVideoDidDismiss", () => {
      setIsLoading(false);
      return console.log("Ad was dismissed");
    });
  useEffect(() => {
    let listenEvents = true;
    if (listenEvents) {
      subscription1();
      subsciption2();
      subsciption3();
    }

    return () => removeAllListeners();
  }, []);

  const handleShowAd = async () => {
    setIsLoading(true);
    await AdMobRewarded.setAdUnitID("ca-app-pub-3940256099942544/5224354917"); // Test admob ID
    await AdMobRewarded.requestAdAsync();
    await AdMobRewarded.showAdAsync();
  };

  return (
    <Screen>
      <AppHeader
        leftIcon="arrow-back"
        title="Points"
        onPressLeft={handleBack}
      />
      <InfoAlert
        description={infoAlert.infoAlertMessage}
        visible={infoAlert.showInfoAlert}
        leftPress={handleCloseInfoAlert}
      />
      <LoadingIndicator visible={isLoading} />
      <ScrollView contentContainerStyle={styles.container}>
        <AppText style={styles.infoText}>
          Collect points to avail Subscription to SeeYot Vip.
        </AppText>

        <View style={styles.descriptionContainer}>
          <AppText style={styles.descriptionTitle}>Total Points:</AppText>
          <AppText>{Points.totalPoints}</AppText>
        </View>
        <View style={[styles.descriptionContainer, { marginBottom: 20 }]}>
          <AppText style={styles.descriptionTitle}>Redeemable Points:</AppText>
          <AppText>{Points.totalPoints}</AppText>
        </View>

        <View style={styles.redeemConatainer}>
          <AppText style={styles.redeemInfo}>
            For every 20 points you can avail SeeYot Vip Subscription for 24
            hours.You can collect Points by watching ads.
          </AppText>

          <View style={styles.actionConatiner}>
            <AppTextInput
              subStyle={styles.inputSub}
              style={styles.input}
              placeholder="Enter no. of points to redeem"
            />
            <AppButton
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
        <AppText style={styles.collectPointsInfo}>
          Clicking on this button will show you an Ad. For each Ad you see, you
          will be awarded 2 points.
        </AppText>
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
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderRadius: 20,
    height: 40,
    marginBottom: 10,
    marginTop: 100,
    width: 120,
  },
  collectPointsButtonSub: {
    color: defaultStyles.colors.secondary,
    fontSize: 17,
  },
  collectPointsInfo: {
    color: defaultStyles.colors.blue,
    textAlign: "center",
    width: "60%",
  },
  container: {
    alignItems: "center",
    flexGrow: 1,
  },
  descriptionContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.light,
    borderColor: defaultStyles.colors.lightGrey,
    borderRadius: 5,
    borderWidth: 1,
    flexDirection: "row",
    height: 40,
    justifyContent: "space-between",
    marginBottom: 10,
    marginTop: 10,
    paddingHorizontal: 20,
    width: "85%",
  },
  descriptionTitle: {
    color: defaultStyles.colors.secondary,
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
    color: defaultStyles.colors.secondary,
    fontSize: 15,
    marginBottom: 15,
    textAlign: "center",
  },
  redeemButton: {
    backgroundColor: defaultStyles.colors.yellow_Variant,
    height: 35,
    width: "20%",
  },
  redeemButtonSub: {
    color: defaultStyles.colors.dark,
    fontSize: 16,
  },
});

export default PointsScreen;
