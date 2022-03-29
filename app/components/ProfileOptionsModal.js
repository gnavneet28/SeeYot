import React, { memo } from "react";
import { View, Modal } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import AntDesign from "../../node_modules/react-native-vector-icons/AntDesign";
import Backdrop from "./Backdrop";

import defaultStyles from "../config/styles";

import ProfileOption from "./ProfileOption";

function ProfileOptionsModal({
  handleBlockListPress,
  handleHelpPress,
  handleInsightsPress,
  handleOpenLogout,
  handleReportPress,
  handleSettingsPress,
  handleSubscriptionPress,
  setVisible,
  visible,
}) {
  return (
    <Modal
      animationType="slide"
      onRequestClose={() => setVisible(false)}
      transparent={true}
      visible={visible}
    >
      <View style={styles.optionsContainerBackground}>
        <Backdrop onPress={() => setVisible(false)} />
        <View style={styles.closeMessageIconContainer}>
          <AntDesign
            onPress={() => setVisible(false)}
            name="downcircle"
            color={defaultStyles.colors.secondary_Variant}
            size={scale(28)}
          />
        </View>
        <View style={styles.optionsContainer}>
          <ProfileOption
            icon="block"
            onPress={handleBlockListPress}
            title="Blocklist"
          />
          <ProfileOption
            icon="library-books"
            onPress={handleSubscriptionPress}
            title="Subscriptions"
          />

          <ProfileOption
            icon="report-problem"
            onPress={handleReportPress}
            title="Report problem"
          />

          <ProfileOption
            icon="help-center"
            onPress={handleHelpPress}
            title="Help"
          />

          <ProfileOption
            icon="settings"
            onPress={handleSettingsPress}
            title="Settings"
          />

          <ProfileOption
            icon="info-outline"
            onPress={handleInsightsPress}
            title="Insights"
          />

          <ProfileOption
            icon="logout"
            onPress={handleOpenLogout}
            title="Log Out"
          />
        </View>
      </View>
    </Modal>
  );
}
const styles = ScaledSheet.create({
  closeMessageIconContainer: {
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
  optionsContainerBackground: {
    flex: 1,
    justifyContent: "space-between",
    overflow: "hidden",
    width: "100%",
  },
  optionsContainer: {
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
    overflow: "hidden",
    paddingTop: "20@s",
    paddingBottom: "15@s",
    width: "100%",
  },
});

export default memo(ProfileOptionsModal);
