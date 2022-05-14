import React from "react";
import { View } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import Ionicons from "../../node_modules/react-native-vector-icons/Ionicons";

import defaultStyles from "../config/styles";
import ActiveChatImage from "./ActiveChatImage";
import AppText from "./AppText";

function ActiveChatReply({
  creator,
  message,
  media,
  onClose,
  show = true,
  style,
  messageContainerStyle,
  onLayout,
}) {
  return (
    <View onLayout={onLayout} style={[styles.container, style]}>
      <View style={[styles.messageDetailsContainer, messageContainerStyle]}>
        <AppText style={styles.creator}>{creator}</AppText>
        {message ? (
          <AppText style={styles.message} numberOfLines={8}>
            {message}
          </AppText>
        ) : (
          <AppText style={styles.message} numberOfLines={8}>
            Media
          </AppText>
        )}
      </View>
      {media ? (
        <ActiveChatImage
          containerStyle={styles.imageContainerStyle}
          uri={media}
          canOpen={false}
        />
      ) : null}
      {show ? (
        <Ionicons
          color={defaultStyles.colors.dark_Variant}
          name="close"
          onPress={onClose}
          size={scale(15)}
          style={styles.closeIcon}
        />
      ) : null}
    </View>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "5@s",
    flexDirection: "row",
    paddingHorizontal: "5@s",
    paddingVertical: "5@s",
  },
  closeIcon: {
    marginLeft: "5@s",
  },
  messageDetailsContainer: {
    borderColor: defaultStyles.colors.yellow_Variant,
    borderLeftWidth: 2,
    borderRadius: "2@s",
    flexShrink: 1,
    justifyContent: "center",
    paddingLeft: "5@s",
  },
  message: {
    fontSize: "11@s",
    paddingBottom: 0,
    paddingTop: 0,
  },
  creator: {
    color: defaultStyles.colors.secondary,
    fontSize: "13@s",
    paddingBottom: 0,
    paddingTop: 0,
  },
  imageContainerStyle: {
    height: "40@s",
    width: "40@s",
  },
});

export default ActiveChatReply;
