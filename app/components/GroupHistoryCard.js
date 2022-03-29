import React from "react";
import { View, TouchableOpacity } from "react-native";
import { scale, ScaledSheet } from "react-native-size-matters";
import QRCode from "react-native-qrcode-svg";

import AppText from "./AppText";

import defaultStyles from "../config/styles";

function GroupHistoryCard({ group, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.container}
    >
      <QRCode enableLinearGradient={true} value={group.name} size={scale(20)} />
      <AppText numberOfLines={2} style={styles.groupName}>
        {group.name}
      </AppText>
    </TouchableOpacity>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    borderRadius: "20@s",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: "20@s",
    paddingVertical: "5@s",
    marginRight: "5@s",
    maxWidth: "120@s",
  },
  groupName: {
    fontSize: "12@s",
    textAlign: "center",
    textAlignVertical: "center",
  },
});

export default GroupHistoryCard;
