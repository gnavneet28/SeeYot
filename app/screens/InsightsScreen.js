import React, { useCallback } from "react";
import { ScrollView } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";

import AppHeader from "../components/AppHeader";
import AppText from "../components/AppText";
import AccountStatDetail from "../components/AccountStatDetail";
import Screen from "../components/Screen";

import useAuth from "../auth/useAuth";

import defaultStyles from "../config/styles";

import formatDate from "../utilities/formatDate";
import debounce from "../utilities/debounce";

function InsightsScreen({ navigation }) {
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
        title="Account Information"
        onPressLeft={handleBack}
      />
      <ScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={styles.container}
      >
        {subscription == "Inactive" ? (
          <AppText style={styles.noActiveSubsInfo}>
            There are no active subscriptions. Subscribe to SeeYot Vip and get
            insights on the number of people who tapped on your Display Picture,
            sent you Thoughts and Messages.
          </AppText>
        ) : (
          <>
            <AccountStatDetail
              style={{ marginTop: scale(20) }}
              title="Total Photo Taps:"
              value={user.stats.photoTaps}
            />
            <AccountStatDetail
              title="Total Messages Received:"
              value={user.stats.messagesReceived}
            />
            <AppText
              style={[
                styles.noActiveSubsInfo,
                { textAlign: "left", fontSize: scale(12) },
              ]}
            >
              Note: This number shown above for total messages received is the
              total number of time, people tried to send you message, that
              includes people in your favorites as well as others. Messages sent
              by people other than in your favorites are not delivered to you.
            </AppText>
            <AccountStatDetail
              title="Total Thoughts Received:"
              value={user.stats.thoughtsReceived}
            />
          </>
        )}
      </ScrollView>
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

export default InsightsScreen;
