import React, { useCallback } from "react";
import { ScrollView } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import MaterialCommunityIcons from "../../node_modules/react-native-vector-icons/MaterialCommunityIcons";
import Feather from "../../node_modules/react-native-vector-icons/Feather";

import AppHeader from "../components/AppHeader";
import AppText from "../components/AppText";
import Screen from "../components/Screen";
import Information from "../components/Information";

import useAuth from "../auth/useAuth";

import defaultStyles from "../config/styles";

import debounce from "../utilities/debounce";
import ScreenSub from "../components/ScreenSub";

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

  return (
    <Screen>
      <AppHeader
        leftIcon="arrow-back"
        title="Account Information"
        onPressLeft={handleBack}
      />
      <ScreenSub style={{ paddingTop: 10 }}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.container}
        >
          {subscription == "Inactive" ? (
            <AppText style={styles.noActiveSubsInfo}>
              There are no active subscriptions. Subscribe to SeeYot Vip and get
              insights on the number of people who tapped on your Display
              Picture, sent you Thoughts and Messages.
            </AppText>
          ) : (
            <>
              <Information
                IconCategory={MaterialCommunityIcons}
                iconName="gesture-tap-box"
                data={user.stats.photoTaps}
                iconSize={scale(38)}
                iconColor={defaultStyles.colors.blue}
                information="Total Photo Taps"
                infoDetails="Total number of times people tapped on your Display Picture."
              />
              <Information
                IconCategory={MaterialCommunityIcons}
                iconName="thought-bubble"
                data={user.stats.thoughtsReceived}
                iconSize={scale(38)}
                iconColor={defaultStyles.colors.blue}
                information="Total Thoughts Received"
                infoDetails="Total number of times people sent you their Thoughts."
              />
              <Information
                IconCategory={Feather}
                iconName="inbox"
                data={user.stats.messagesReceived}
                iconSize={scale(38)}
                iconColor={defaultStyles.colors.blue}
                information="Total Favorite Messages Received"
                infoDetails="Total Favorite Messages received is the
              total number of time, people tried to send you message, that
              includes people in your favorites as well as others. Messages sent
              by people other than in your favorites are not delivered to you."
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
