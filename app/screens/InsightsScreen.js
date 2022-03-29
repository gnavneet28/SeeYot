import React, { useCallback, useState, useEffect } from "react";
import { ScrollView, RefreshControl } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import { useIsFocused } from "@react-navigation/native";

import AppHeader from "../components/AppHeader";
import AppText from "../components/AppText";
import AppActivityIndicator from "../components/ActivityIndicator";
import InfoAlert from "../components/InfoAlert";
import Screen from "../components/Screen";

import useAuth from "../auth/useAuth";

import usersApi from "../api/users";

import defaultStyles from "../config/styles";

import debounce from "../utilities/debounce";
import ScreenSub from "../components/ScreenSub";
import Chart from "../components/Chart";
import defaultProps from "../utilities/defaultProps";

import apiActivity from "../utilities/apiActivity";
import insight from "../utilities/insight";

let defaultStats = {
  photoTaps: [],
  messagesReceived: [],
  thoughtsReceived: [],
};

function InsightsScreen({ navigation }) {
  const { user } = useAuth();
  const { tackleProblem } = apiActivity;
  const isFocused = useIsFocused();
  // SUBSCRIPTION DETAILS
  let subscription = user.vip.subscription ? "Active" : "Inactive";

  const [stats, setStats] = useState(defaultStats);
  const [infoAlert, setInfoAlert] = useState({
    showInfoAlert: false,
    infoAlertMessage: "",
  });
  const [isReady, setIsReady] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  // Stat STATE
  const [tapsData, setTapsData] = useState({
    tapCategory: "All",
    totalTaps: 0,
    tapsDetails: [
      {
        name: "Friends",
        population: 0,
        color: defaultStyles.colors.secondary_Variant,
        ...defaultProps.defaultStylesForData,
      },
      {
        name: "Others",
        population: 0,
        color: defaultStyles.colors.yellow_Variant,
        ...defaultProps.defaultStylesForData,
      },
    ],
  });
  const [messageData, setMessageData] = useState({
    messageCategory: "All",
    totalMessages: 0,
    messagesDetails: [
      {
        name: "Favorites",
        population: 0,
        color: defaultStyles.colors.secondary_Variant,
        ...defaultProps.defaultStylesForData,
      },
      {
        name: "Others",
        population: 0,
        color: defaultStyles.colors.yellow_Variant,
        ...defaultProps.defaultStylesForData,
      },
    ],
  });
  const [thoughtsData, setThoughtsData] = useState({
    thoughtCategory: "All",
    totalThoughts: 0,
    thoughtDetails: [
      {
        name: "Friends",
        population: 0,
        color: defaultStyles.colors.secondary_Variant,
        ...defaultProps.defaultStylesForData,
      },
      {
        name: "Others",
        population: 0,
        color: defaultStyles.colors.yellow_Variant,
        ...defaultProps.defaultStylesForData,
      },
    ],
  });

  const setUpPage = async () => {
    if (subscription !== "Active") return;
    const { ok, data, problem } = await usersApi.getMyStats();
    if (ok) {
      setStats(data);
      setChartDetailsForMessagesReceived("All", data.messagesReceived);
      setChartDetailsForTotalTaps("All", data.photoTaps);
      setChartDetailsForTotalThoughts("All", data.thoughtsReceived);
      return setIsReady(true);
    }
    setIsReady(true);
    tackleProblem(problem, data, setInfoAlert);
  };

  const handleRefresh = () => {
    setUpPage();
  };

  useEffect(() => {
    if (isFocused) {
      setUpPage();
    }
  }, [isFocused]);

  // FUNCTION TO CALCULATE/PROCESS STATS DATA

  const setChartDetailsForMessagesReceived = (duration, data) => {
    // get data from getStats and calculate data for total messages received
    const totalMessages = typeof data !== "undefined" ? data : [];
    if (!totalMessages.length) {
      return setMessageData({
        ...messageData,
        messageCategory: duration,
        totalMessages: 0,
      });
    }
    let { numberOfPeopleInFavorites, others } =
      insight.getNumberOfPeopleInFavorites(totalMessages, duration, user);

    setMessageData({
      ...messageData,
      totalMessages: numberOfPeopleInFavorites + others,
      messageCategory: duration,
      messagesDetails: [
        {
          name: "Favorites",
          population: numberOfPeopleInFavorites,
          color: defaultStyles.colors.secondary_Variant,
          ...defaultProps.defaultStylesForData,
        },
        {
          name: "Others",
          population: others,
          color: defaultStyles.colors.yellow_Variant,
          ...defaultProps.defaultStylesForData,
        },
      ],
    });
  };
  const setChartDetailsForTotalTaps = (duration, data) => {
    // get data from getStats and calculate data for total taps

    const totalPhotoTaps = typeof data !== "undefined" ? data : [];
    if (!totalPhotoTaps.length) {
      return setTapsData({
        ...tapsData,
        tapCategory: duration,
        totalTaps: 0,
      });
    }
    let { numberOfPeopleInContacts, others } =
      insight.getNumberOfPeopleInContacts(totalPhotoTaps, duration, user);

    setTapsData({
      ...tapsData,
      tapCategory: duration,
      totalTaps: numberOfPeopleInContacts + others,
      tapsDetails: [
        {
          name: "Friends",
          population: numberOfPeopleInContacts,
          color: defaultStyles.colors.secondary_Variant,
          ...defaultProps.defaultStylesForData,
        },
        {
          name: "Others",
          population: others,
          color: defaultStyles.colors.yellow_Variant,
          ...defaultProps.defaultStylesForData,
        },
      ],
    });
  };
  const setChartDetailsForTotalThoughts = (duration, data) => {
    // get data from getStats and calculate data for total taps
    const totalThoughts = typeof data !== "undefined" ? data : [];
    if (!totalThoughts.length) {
      return setThoughtsData({
        ...thoughtsData,
        thoughtCategory: duration,
        totalThoughts: 0,
      });
    }
    let { numberOfPeopleInContacts, others } =
      insight.getNumberOfPeopleInContacts(totalThoughts, duration, user);

    setThoughtsData({
      ...thoughtsData,
      thoughtCategory: duration,
      totalThoughts: numberOfPeopleInContacts + others,
      thoughtDetails: [
        {
          name: "Friends",
          population: numberOfPeopleInContacts,
          color: defaultStyles.colors.secondary_Variant,
          ...defaultProps.defaultStylesForData,
        },
        {
          name: "Others",
          population: others,
          color: defaultStyles.colors.yellow_Variant,
          ...defaultProps.defaultStylesForData,
        },
      ],
    });
  };

  // INFO ALERT ACTIONS

  const handleCloseInfoAlert = () => {
    setInfoAlert({
      ...infoAlert,
      showInfoAlert: false,
    });
  };

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

  // TAPS
  const handleGetDataForTapsInLastMonth = () => {
    setChartDetailsForTotalTaps("Month", stats.photoTaps);
  };

  const handleGetDataForTapsInLastWeek = () => {
    setChartDetailsForTotalTaps("Week", stats.photoTaps);
  };

  const handleGetDataForTapsAll = () => {
    setChartDetailsForTotalTaps("All", stats.photoTaps);
  };

  // THOUGHTS
  const handleGetDataForThoughtsInLastMonth = () => {
    setChartDetailsForTotalThoughts("Month", stats.thoughtsReceived);
  };

  const handleGetDataForThoughtsInLastWeek = () => {
    setChartDetailsForTotalThoughts("Week", stats.thoughtsReceived);
  };

  const handleGetDataForThoughtsAll = () => {
    setChartDetailsForTotalThoughts("All", stats.thoughtsReceived);
  };
  // MESSAGES
  const handleGetDataForMessagesInLastMonth = () => {
    setChartDetailsForMessagesReceived("Month", stats.messagesReceived);
  };

  const handleGetDataForMessagesInLastWeek = () => {
    setChartDetailsForMessagesReceived("Week", stats.messagesReceived);
  };

  const handleGetDataForMessagesAll = () => {
    setChartDetailsForMessagesReceived("All", stats.messagesReceived);
  };

  return (
    <Screen>
      <AppHeader
        leftIcon="arrow-back"
        title="Profile Insights"
        onPressLeft={handleBack}
      />
      <ScreenSub style={{ paddingTop: 10 }}>
        {!isReady ? (
          <AppActivityIndicator />
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl
                onRefresh={handleRefresh}
                refreshing={refreshing}
              />
            }
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
          >
            {subscription == "Active" ? (
              <>
                <Chart
                  chartConfig={defaultProps.defaultChartConfig}
                  description="Total number of times people tapped on your Display Picture."
                  onLastMonthDataPress={handleGetDataForTapsInLastMonth}
                  onLastWeekDataPress={handleGetDataForTapsInLastWeek}
                  onTotalDataPress={handleGetDataForTapsAll}
                  opted={tapsData.tapCategory}
                  pieChartData={tapsData.tapsDetails}
                  style={styles.chart}
                  title="Total Photo Taps"
                  totalData={tapsData.totalTaps}
                />
                <Chart
                  chartConfig={defaultProps.defaultChartConfig}
                  description="Total number of times people sent you their Thoughts."
                  onLastMonthDataPress={handleGetDataForThoughtsInLastMonth}
                  onLastWeekDataPress={handleGetDataForThoughtsInLastWeek}
                  onTotalDataPress={handleGetDataForThoughtsAll}
                  opted={thoughtsData.thoughtCategory}
                  pieChartData={thoughtsData.thoughtDetails}
                  style={styles.chart}
                  title="Total Thoughts Received"
                  totalData={thoughtsData.totalThoughts}
                />
                <Chart
                  chartConfig={defaultProps.defaultChartConfig}
                  description="Total Favorite Messages received is the total number of time, people tried to send you message, that includes people in your favorites as well as others. Messages sent by people other than in your favorites are not delivered to you."
                  onLastMonthDataPress={handleGetDataForMessagesInLastMonth}
                  onLastWeekDataPress={handleGetDataForMessagesInLastWeek}
                  onTotalDataPress={handleGetDataForMessagesAll}
                  opted={messageData.messageCategory}
                  pieChartData={messageData.messagesDetails}
                  style={styles.chart}
                  title="Total Messages Received"
                  totalData={messageData.totalMessages}
                />
              </>
            ) : (
              <AppText style={styles.noActiveSubsInfo}>
                There are no active subscriptions. Subscribe to SeeYot Vip and
                get insights on the number of people who tapped on your Display
                Picture, sent you Thoughts and Messages.
              </AppText>
            )}
          </ScrollView>
        )}
      </ScreenSub>
      <InfoAlert
        description={infoAlert.infoAlertMessage}
        leftPress={handleCloseInfoAlert}
        visible={infoAlert.showInfoAlert}
      />
    </Screen>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    flexGrow: 1,
  },
  chart: {
    marginBottom: "10@s",
  },
  noActiveSubsInfo: {
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "5@s",
    color: defaultStyles.colors.dark_Variant,
    fontSize: "13@s",
    marginVertical: "5@s",
    minHeight: "35@s",
    paddingHorizontal: "10@s",
    paddingVertical: "10@s",
    textAlign: "center",
    textAlignVertical: "center",
    width: "90%",
  },
});

export default InsightsScreen;
