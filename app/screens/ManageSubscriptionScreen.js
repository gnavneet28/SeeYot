import React, { useCallback } from "react";
import { ScrollView } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";

import AppHeader from "../components/AppHeader";
import AppText from "../components/AppText";
import Details from "../components/Details";
import Screen from "../components/Screen";

import useAuth from "../auth/useAuth";

import defaultStyles from "../config/styles";

import formatDate from "../utilities/formatDate";
import debounce from "../utilities/debounce";
import ScreenSub from "../components/ScreenSub";

function ManageSubscriptionScreen({ navigation }) {
  const { user } = useAuth();

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

  // SUBSCRIPTION DETAILS
  let subscription = user.vip.subscription ? "Active" : "Inactive";
  let subscriptionStartDate = user.vip.subscriptionStartDate
    ? formatDate(user.vip.subscriptionStartDate)
    : "";
  let subscriptionEndDate = user.vip.subscriptionEndDate
    ? formatDate(user.vip.subscriptionEndDate)
    : "";
  let subscriptionType = user.vip.subscriptionType
    ? user.vip.subscriptionType
    : "Type";

  return (
    <Screen>
      <AppHeader
        leftIcon="arrow-back"
        title="Current Subscription"
        onPressLeft={handleBack}
      />
      <ScreenSub>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.container}
        >
          {subscription == "Inactive" ? (
            <AppText style={styles.noActiveSubsInfo}>
              There are no active subscriptions.
            </AppText>
          ) : (
            <>
              <Details
                style={{ marginTop: scale(20) }}
                title="Subscription:"
                value={subscription}
              />
              <Details title="Subscription Mode:" value={subscriptionType} />
              <Details
                title="Subscription Start Date:"
                value={subscriptionStartDate}
              />
              <Details
                title="Subscription End Date:"
                value={subscriptionEndDate}
              />
            </>
          )}
        </ScrollView>
      </ScreenSub>
    </Screen>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    flexGrow: 1,
  },
  noActiveSubsInfo: {
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "5@s",
    color: defaultStyles.colors.dark_Variant,
    elevation: 2,
    fontSize: "13@s",
    marginVertical: "10@s",
    minHeight: "35@s",
    paddingHorizontal: "10@s",
    paddingVertical: "10@s",
    textAlign: "center",
    textAlignVertical: "center",
    width: "90%",
  },
});

export default ManageSubscriptionScreen;
