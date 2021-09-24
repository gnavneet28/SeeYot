import React, { useCallback } from "react";
import { StyleSheet, ScrollView, View } from "react-native";

import AppButton from "../components/AppButton";
import AppHeader from "../components/AppHeader";
import AppText from "../components/AppText";
import DescriptionItem from "../components/DescriptionItem";
import PlanCard from "../components/PlanCard";
import Screen from "../components/Screen";
import VipAdCard from "../components/VipAdCard";

import defaultStyles from "../config/styles";
import { AdMobRewarded } from "expo-ads-admob";

function SubscriptionScreen({ navigation, route }) {
  // HEADER ACTION
  const hanldeHeaderLeftPress = useCallback(() => {
    navigation.goBack();
  }, []);

  const handleManageSubscriptionPress = useCallback(() => {
    navigation.navigate("Manager");
  }, []);

  const handleCollectButtonPress = useCallback(() => {
    navigation.navigate("PointsScreen");
    // Display a rewarded ad
    // await AdMobRewarded.setAdUnitID("ca-app-pub-3940256099942544/5224354917"); // Test admob ID
    // await AdMobRewarded.requestAdAsync();
    // await AdMobRewarded.showAdAsync();
  }, []);

  return (
    <Screen>
      <AppHeader
        leftIcon="arrow-back"
        onPressLeft={hanldeHeaderLeftPress}
        title="Subscription"
      />
      <VipAdCard style={styles.vipAdCard} />
      <AppText
        onPress={handleManageSubscriptionPress}
        style={styles.manageSubscription}
      >
        Manage Subscriptions
      </AppText>
      <ScrollView>
        <View style={styles.scrollView}>
          <DescriptionItem
            description="You can only be blocked by other vip members."
            name="block-helper"
          />
          <DescriptionItem
            description="You can search people outside your contacts."
            name="account-search"
          />
          <DescriptionItem
            description="You can send your thoughts to anyone outside your contacts."
            name="thought-bubble"
          />
          <DescriptionItem
            description="You can see the actual thoughts sent by anyone, without your thoughts being matched."
            name="lock-open"
          />
          <AppText style={styles.selectPlanText}>Select a Plan</AppText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <PlanCard planName="Plan A" planRate={250} planDuration="1 Month" />
            <PlanCard
              planName="Plan B"
              planRate={450}
              planDuration="2 Months"
            />
            <PlanCard
              planName="Plan C"
              planRate={600}
              planDuration="3 Months"
            />
            <PlanCard
              planName="Plan D"
              planRate={1150}
              planDuration="6 Months"
            />
            <PlanCard planName="Plan E" planRate={2600} planDuration="1 Year" />
          </ScrollView>
          <AppText style={styles.selectPlanText}>Or Collect Points</AppText>
          <AppButton
            onPress={handleCollectButtonPress}
            style={styles.collectPoints}
            title="Collect Points"
          />
        </View>
      </ScrollView>
    </Screen>
  );
}
const styles = StyleSheet.create({
  manageSubscription: {
    alignSelf: "flex-end",
    borderColor: defaultStyles.colors.lightGrey,
    borderRadius: 5,
    borderWidth: 1,
    color: defaultStyles.colors.blue,
    marginBottom: 10,
    marginRight: 20,
    paddingHorizontal: 20,
  },
  collectPoints: {
    marginVertical: 5,
    width: "90%",
    backgroundColor: defaultStyles.colors.yellow_Variant,
    height: 35,
  },
  scrollView: {
    alignItems: "center",
    paddingHorizontal: 20,
    width: "100%",
  },
  selectPlanText: {
    marginVertical: 10,
    fontSize: 20,
    color: defaultStyles.colors.secondary,
    alignSelf: "flex-start",
  },
  vipAdCard: {
    marginVertical: 5,
  },
});

export default SubscriptionScreen;
