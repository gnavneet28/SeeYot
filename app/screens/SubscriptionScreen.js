import React, { useCallback } from "react";
import { StyleSheet, ScrollView, View } from "react-native";

import AppButton from "../components/AppButton";
import AppHeader from "../components/AppHeader";
import AppText from "../components/AppText";
import DescriptionItem from "../components/DescriptionItem";
import PlanCard from "../components/PlanCard";
import Screen from "../components/Screen";
import VipAdCard from "../components/VipAdCard";

import Constant from "../navigation/NavigationConstants";

import defaultStyles from "../config/styles";

import debounce from "../utilities/debounce";

function SubscriptionScreen({ navigation, route }) {
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
        Current Subscriptions
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
          <DescriptionItem
            description="You shall be notified when someone add you to his/her Fovorite People list."
            name="bell-circle"
          />
          <AppText style={styles.selectPlanText}>Select a Plan</AppText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <PlanCard planName="Plan A" planRate={250} planDuration="1 Month" />
            <PlanCard
              planDuration="2 Months"
              planName="Plan B"
              planRate={450}
            />
            <PlanCard
              planDuration="3 Months"
              planName="Plan C"
              planRate={700}
            />
            <PlanCard
              planDuration="6 Months"
              planName="Plan D"
              planRate={1250}
            />
            <PlanCard planName="Plan E" planRate={2450} planDuration="1 Year" />
          </ScrollView>
          <AppButton
            onPress={handleCollectButtonPress}
            style={styles.collectPoints}
            title="Or Collect Points"
          />
        </View>
      </ScrollView>
    </Screen>
  );
}
const styles = StyleSheet.create({
  manageSubscription: {
    alignSelf: "flex-end",
    backgroundColor: defaultStyles.colors.blue,
    borderRadius: 5,
    color: defaultStyles.colors.white,
    marginBottom: 10,
    marginRight: 20,
    paddingHorizontal: 20,
  },
  collectPoints: {
    backgroundColor: defaultStyles.colors.secondary,
    borderRadius: 20,
    height: 35,
    marginVertical: 5,
    width: "95%",
  },
  scrollView: {
    alignItems: "center",
    paddingHorizontal: 20,
    width: "100%",
  },
  selectPlanText: {
    alignSelf: "flex-start",
    color: defaultStyles.colors.secondary,
    fontSize: 20,
    marginVertical: 10,
  },
  vipAdCard: {
    marginVertical: 5,
  },
});

export default SubscriptionScreen;
