import React, { useCallback } from "react";
import { StyleSheet, ScrollView } from "react-native";

import AppHeader from "../components/AppHeader";
import AppText from "../components/AppText";
import Details from "../components/Details";
import Screen from "../components/Screen";

import useAuth from "../auth/useAuth";

import defaultStyles from "../config/styles";

import formatDate from "../utilities/formatDate";
import debounce from "../utilities/debounce";

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
      <ScrollView contentContainerStyle={styles.container}>
        {subscription == "Inactive" ? (
          <AppText style={styles.noActiveSubsInfo}>
            There are no active subscriptions.
          </AppText>
        ) : (
          <>
            <Details
              style={{ marginTop: 20 }}
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
    </Screen>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexGrow: 1,
  },
  noActiveSubsInfo: {
    backgroundColor: defaultStyles.colors.white,
    borderRadius: 5,
    elevation: 2,
    height: 40,
    marginVertical: 10,
    textAlign: "center",
    textAlignVertical: "center",
    width: "90%",
  },
});

export default ManageSubscriptionScreen;
