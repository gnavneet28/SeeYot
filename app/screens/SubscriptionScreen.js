import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, View, Platform } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import * as IAP from "expo-in-app-purchases";
import crashlytics from "@react-native-firebase/crashlytics";

import AppButton from "../components/AppButton";
import AppHeader from "../components/AppHeader";
import AppText from "../components/AppText";
import DescriptionItem from "../components/DescriptionItem";
import PlanCard from "../components/PlanCard";
import Screen from "../components/Screen";
import VipAdCard from "../components/VipAdCard";
import InfoAlert from "../components/InfoAlert";

import Constant from "../navigation/NavigationConstants";

import defaultStyles from "../config/styles";

import defaultProps from "../utilities/defaultProps";

import debounce from "../utilities/debounce";

import usersApi from "../api/users";

import ScreenSub from "../components/ScreenSub";
import apiActivity from "../utilities/apiActivity";

const items = Platform.select({
  ios: [],
  android: [
    "seeyotvip_125_1m",
    "seeyotvip_225_2m",
    "seeyotvip_325_3m",
    "seeyotvip_525_6m",
  ],
});

const plans = defaultProps.plans;

function SubscriptionScreen({ navigation, route }) {
  const { tackleProblem } = apiActivity;
  const [products, setProducts] = useState([]);
  const [checkingVip, setCheckingVip] = useState("");
  const [infoAlert, setInfoAlert] = useState({
    infoAlertMessage: "",
    showInfoAlert: false,
  });
  // HEADER ACTION
  const hanldeHeaderLeftPress = useCallback(
    debounce(
      () => {
        navigation.goBack();
      },
      500,
      true
    ),
    []
  );

  const handleManageSubscriptionPress = useCallback(() => {
    navigation.navigate(Constant.MANAGER_SCREEN);
  }, []);

  const handleCollectButtonPress = useCallback(() => {
    navigation.navigate(Constant.POINTS_SCREEN);
  }, []);

  // INFO ALERT ACTION
  const handleCloseInfoAlert = () =>
    setInfoAlert({ ...infoAlert, showInfoAlert: false });

  const connectToTheAppStore = () => {
    IAP.connectAsync()
      .catch((error) => {
        if (typeof error === "string") {
          crashlytics().recordError(new Error(error));
        }
      })
      .then(() => {
        IAP.getProductsAsync(items).then(({ responseCode, results }) =>
          setProducts(results)
        );
      })
      .catch((error) => {
        if (typeof error === "string") {
          crashlytics().recordError(new Error(error));
        }
      });
  };

  useEffect(() => {
    connectToTheAppStore();

    return;
  }, []);

  const handlePayment = debounce(
    async (id) => {
      setCheckingVip(id);
      const { ok, problem, data } = await usersApi.checkIsVip();
      if (ok) {
        setCheckingVip("");
        try {
          return await IAP.purchaseItemAsync(id);
        } catch (error) {
          if (typeof error === "string") {
            crashlytics().recordError(new Error(error));
          }
        }
      }
      setCheckingVip("");
      tackleProblem(problem, data, setInfoAlert);
    },
    5000,
    true
  );

  return (
    <>
      <Screen>
        <AppHeader
          leftIcon="arrow-back"
          onPressLeft={hanldeHeaderLeftPress}
          title="Subscription"
        />
        <ScreenSub>
          <VipAdCard style={styles.vipAdCard} />
          <AppText
            onPress={handleManageSubscriptionPress}
            style={styles.manageSubscription}
          >
            Active Subscriptions
          </AppText>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.scrollView}>
              {/* <DescriptionItem
                description="You can search people outside your contacts."
                name="account-search"
              /> */}
              <DescriptionItem
                description="You can send your thoughts to anyone outside your contacts."
                name="thought-bubble"
              />
              <DescriptionItem
                description="You can see the actual thoughts sent by anyone, without your thoughts being matched."
                name="lock-open"
              />
              <DescriptionItem
                description="You can only be blocked by other vip members."
                name="block-helper"
              />
              <DescriptionItem
                description="Get insights on the number of people who tapped on your Display Picture, sent you Thoughts and Messages."
                name="information-outline"
              />
              <DescriptionItem
                description="You can join any group in incognito mode. (You will not be visible in active users list)."
                name="incognito-circle"
              />
              <AppText style={styles.selectPlanText}>Select a Plan</AppText>
              <ScrollView
                keyboardShouldPersistTaps="handled"
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                {plans.map((p) => (
                  <PlanCard
                    key={p._id}
                    _id={p._id}
                    planName={p.planName}
                    planDuration={p.planDuration}
                    planRate={p.planRate}
                    onProcess={handlePayment}
                    processing={checkingVip}
                  />
                ))}
              </ScrollView>
              <AppButton
                onPress={handleCollectButtonPress}
                style={styles.collectPoints}
                title="Or Collect Points"
              />
            </View>
          </ScrollView>
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
  manageSubscription: {
    alignSelf: "flex-end",
    backgroundColor: defaultStyles.colors.yellow_Variant,
    borderBottomLeftRadius: "20@s",
    borderTopLeftRadius: "20@s",
    color: defaultStyles.colors.secondary,
    fontSize: "14@s",
    height: "30@s",
    marginBottom: "10@s",
    paddingHorizontal: "10@s",
    textAlign: "right",
    textAlignVertical: "center",
  },
  collectPoints: {
    backgroundColor: defaultStyles.colors.secondary,
    borderRadius: "20@s",
    height: "35@s",
    marginVertical: "5@s",
    marginBottom: "15@s",
    width: "95%",
  },
  scrollView: {
    alignItems: "center",
    paddingHorizontal: "15@s",
    width: "100%",
  },
  selectPlanText: {
    alignSelf: "flex-start",
    borderBottomColor: defaultStyles.colors.lightGrey,
    borderBottomWidth: 1,
    color: defaultStyles.colors.secondary,
    fontSize: "16@s",
    marginTop: "15@s",
  },
  vipAdCard: {
    marginVertical: "5@s",
  },
});

export default SubscriptionScreen;
