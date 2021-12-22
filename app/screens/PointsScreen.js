import React, { useCallback, useEffect, useState, useContext } from "react";
import { View, ScrollView, Modal } from "react-native";
import { AdMobRewarded } from "expo-ads-admob";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { ScaledSheet, scale } from "react-native-size-matters";
import { useIsFocused } from "@react-navigation/native";
import AntDesign from "react-native-vector-icons/AntDesign";

import ApiProcessingContainer from "../components/ApiProcessingContainer";
import AppButton from "../components/AppButton";
import AppHeader from "../components/AppHeader";
import AppText from "../components/AppText";
import AppTextInput from "../components/AppTextInput";
import Details from "../components/Details";
import InfoAlert from "../components/InfoAlert";
import InfoText from "../components/InfoText";
import LoadingIndicator from "../components/LoadingIndicator";
import Screen from "../components/Screen";

import useAuth from "../auth/useAuth";

import defaultStyles from "../config/styles";

import SuccessMessageContext from "../utilities/successMessageContext";
import debounce from "../utilities/debounce";
import storeDetails from "../utilities/storeDetails";
import apiActivity from "../utilities/apiActivity";
import asyncStorage from "../utilities/cache";
import DataConstants from "../utilities/DataConstants";
import authorizeAds from "../utilities/authorizeAds";

import useMountedRef from "../hooks/useMountedRef";

import usersApi from "../api/users";
import ModalFallback from "../components/ModalFallback";

const Points = {
  totalPoints: 0,
};

function PointsScreen({ navigation }) {
  const { user, setUser } = useAuth();
  const mounted = useMountedRef().current;
  const isFocused = useIsFocused();
  const { setSuccess } = useContext(SuccessMessageContext);
  const { tackleProblem, showSucessMessage } = apiActivity;

  // STATES
  const [collectingPoints, setCollectingPoints] = useState(false);
  const [showAdsInfo, setShowAdsInfo] = useState(false);
  const [redeeming, setRedeeming] = useState(false);
  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isFocused && mounted && infoAlert.showInfoAlert === true) {
      setInfoAlert({
        infoAlertMessage: "",
        showInfoAlert: false,
      });
    }
  }, [isFocused, mounted]);

  useEffect(() => {
    if (!isFocused && mounted && isLoading === true) {
      setIsLoading(false);
    }
  }, [isFocused, mounted]);

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
    const { ok, problem, data } = await usersApi.updatePoints();
    if (ok) {
      let newAdStats = await asyncStorage.get(DataConstants.ADSSTATS);
      newAdStats.numberOfAdsSeen.push(new Date());

      const res = await usersApi.getCurrentUser();
      if (res.ok && res.data) {
        if (res.data.__v > data.user.__v) {
          await asyncStorage.store(DataConstants.ADSSTATS, newAdStats);
          await storeDetails(res.data);
          setUser(res.data);
          return showSucessMessage(setSuccess, "Congrats you earned 5 points.");
        }
      }
      await asyncStorage.store(DataConstants.ADSSTATS, newAdStats);
      await storeDetails(data.user);
      setUser(data.user);
      return showSucessMessage(setSuccess, "Congrats you earned 5 points.");
    }
    tackleProblem(problem, data, setInfoAlert);
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
      setCollectingPoints(true);
      const canShowAd = await authorizeAds();
      if (!canShowAd) {
        setCollectingPoints(false);
        return setShowAdsInfo(true);
      }
      try {
        await AdMobRewarded.setAdUnitID(
          "ca-app-pub-3940256099942544/5224354917"
        ); // Test admob ID
        await AdMobRewarded.requestAdAsync();
        await AdMobRewarded.showAdAsync();
      } catch (error) {
        setCollectingPoints(false);
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
      setRedeeming(true);
      const { ok, data, problem } = await usersApi.redeemPoints(pointsToRedeem);
      if (ok) {
        setPointsToRedeem(0);
        const res = await usersApi.getCurrentUser();
        if (res.ok && res.data) {
          if (res.data.__v > data.user.__v) {
            await storeDetails(res.data);
            setUser(res.data);
            setRedeeming(false);
            return showSucessMessage(
              setSuccess,
              "Congrats! You have now become a SeeYot Vip member. Enjoy connecting with more people without hesitation.",
              6000
            );
          }
        }
        await storeDetails(data.user);
        setUser(data.user);
        setRedeeming(false);
        return showSucessMessage(
          setSuccess,
          "Congrats! You have now become a SeeYot Vip member. Enjoy connecting with more people without hesitation.",
          6000
        );
      }
      setPointsToRedeem(0);
      setRedeeming(false);
      tackleProblem(problem, data, setInfoAlert);
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
      <InfoAlert
        description={infoAlert.infoAlertMessage}
        visible={infoAlert.showInfoAlert}
        leftPress={handleCloseInfoAlert}
      />
      <LoadingIndicator visible={isLoading} />
      <ScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={styles.container}
      >
        <AppText style={styles.infoText}>
          Collect points to avail Subscription to SeeYot Vip.
        </AppText>

        <Details title="Total Points:" value={user.points.totalPoints} />
        <Details
          style={{ marginBottom: scale(20) }}
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
              value={pointsToRedeem.toString()}
            />
            <ApiProcessingContainer
              style={styles.apiProcessingContainer}
              processing={redeeming}
            >
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
            </ApiProcessingContainer>
          </View>
        </View>
        <ApiProcessingContainer
          style={styles.collectPointsApiProcessingContainer}
          processing={collectingPoints}
        >
          <AppButton
            onPress={handleShowAd}
            style={styles.collectPointsButton}
            subStyle={styles.collectPointsButtonSub}
            title="Collect Points"
          />
        </ApiProcessingContainer>
        <View style={styles.collectPointsInfoContainer}>
          <MaterialCommunityIcon
            name="google-ads"
            size={scale(14)}
            color={defaultStyles.colors.yellow_Variant}
            style={{ alignSelf: "flex-start" }}
          />
          <AppText style={styles.collectPointsInfo}>
            Clicking on this button will show you an Ad. For each Ad you see,
            you will be awarded 5 points.
          </AppText>
        </View>
        <AppText onPress={() => setShowAdsInfo(true)}>
          Terms and Condition.
        </AppText>
      </ScrollView>
      {showAdsInfo ? <ModalFallback /> : null}
      <Modal
        visible={showAdsInfo}
        onRequestClose={() => setShowAdsInfo(false)}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.adsInfoContainerBackground}>
          <View style={styles.closeAdsInfoIconContainer}>
            <AntDesign
              onPress={() => setShowAdsInfo(false)}
              name="downcircle"
              color={defaultStyles.colors.tomato}
              size={scale(28)}
            />
          </View>
          <View style={styles.adsInfoContainer}>
            <AppText style={styles.adsTermAndConditionInfo}>
              Terms and Conditions to use Ads to avail SeeYot Vip membership.
            </AppText>
            <InfoText information="a. You account should be minimum 15 days old." />
            <InfoText information="b. You can watch only 6 ads within 24 hours. (successful watch)" />
            <InfoText information="c. You can watch only 1 ad within 10 minutes. (successful watch)" />
          </View>
        </View>
      </Modal>
    </Screen>
  );
}
const styles = ScaledSheet.create({
  actionConatiner: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: "5@s",
    width: "100%",
  },
  adsInfoContainerBackground: {
    flex: 1,
    justifyContent: "flex-end",
    overflow: "hidden",
    width: "100%",
  },
  adsInfoContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderLeftColor: defaultStyles.colors.light,
    borderLeftWidth: 1,
    borderRightColor: defaultStyles.colors.light,
    borderRightWidth: 1,
    borderTopColor: defaultStyles.colors.light,
    borderTopLeftRadius: "10@s",
    borderTopRightRadius: "10@s",
    borderTopWidth: 1,
    bottom: 0,
    height: "150@s",
    overflow: "hidden",
    paddingTop: "20@s",
    width: "100%",
  },
  adsTermAndConditionInfo: {
    color: defaultStyles.colors.secondary,
    fontSize: "13@s",
    marginVertical: "10@s",
    paddingHorizontal: "10@s",
    textAlign: "center",
    textAlignVertical: "center",
    width: "100%",
  },
  apiProcessingContainer: {
    borderColor: defaultStyles.colors.tomato,
    borderRadius: "5@s",
    borderWidth: 1,
    height: "35@s",
    padding: 0,
    width: "24%",
  },
  closeAdsInfoIconContainer: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "25@s",
    bottom: "-25@s",
    height: "40@s",
    justifyContent: "center",
    padding: "5@s",
    width: "40@s",
    zIndex: 222,
  },
  collectPointsApiProcessingContainer: {
    borderColor: defaultStyles.colors.tomato,
    borderRadius: "20@s",
    borderWidth: "1@s",
    height: "35@s",
    marginBottom: "10@s",
    marginTop: "100@s",
    width: "110@s",
  },
  collectPointsButton: {
    backgroundColor: defaultStyles.colors.tomato,
    borderRadius: "20@s",
    height: "35@s",
    width: "110@s",
  },
  collectPointsButtonSub: {
    color: defaultStyles.colors.white,
    fontSize: "15@s",
  },
  collectPointsInfoContainer: {
    alignItems: "center",
    alignSelf: "center",
    borderTopColor: defaultStyles.colors.light,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: "5@s",
    paddingVertical: "5@s",
    width: "80%",
  },
  collectPointsInfo: {
    color: defaultStyles.colors.blue,
    fontSize: "12@s",
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
    fontSize: "15@s",
    marginVertical: "10@s",
    paddingHorizontal: "10@s",
    textAlign: "center",
    textAlignVertical: "center",
    width: "95%",
  },
  input: {
    paddingHorizontal: "5@s",
    width: "74%",
  },
  inputSub: {
    fontSize: "14@s",
    textAlign: "center",
  },
  redeemConatainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.light,
    borderColor: defaultStyles.colors.lightGrey,
    borderRadius: "5@s",
    borderWidth: 1,
    elevation: 2,
    padding: "10@s",
    width: "90%",
  },
  redeemInfo: {
    color: defaultStyles.colors.dark_Variant,
    fontSize: "12@s",
    letterSpacing: "0.3@s",
    marginBottom: "10@s",
    textAlign: "left",
  },
  redeemButton: {
    backgroundColor: defaultStyles.colors.tomato,
    height: "35@s",
    width: "100%",
  },
  redeemButtonSub: {
    color: defaultStyles.colors.white,
    fontSize: "14@s",
  },
});

export default PointsScreen;
