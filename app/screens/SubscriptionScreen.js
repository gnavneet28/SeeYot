import React, { useCallback } from "react";
import { ScrollView, View } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

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
      <ScrollView keyboardShouldPersistTaps="always">
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
            description="You will be notified when someone add you to his/her Fovorite People list.(Does not include the name of the person who added you.)"
            name="bell-circle"
          />

          <DescriptionItem
            description="Get insights on the number of people who tapped on your Display Picture, sent you Thoughts and Messages."
            name="information-outline"
          />
          <AppText style={styles.selectPlanText}>Select a Plan</AppText>
          <ScrollView
            keyboardShouldPersistTaps="always"
            horizontal
            showsHorizontalScrollIndicator={false}
          >
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
