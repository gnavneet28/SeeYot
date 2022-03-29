import React from "react";
import { View } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import Ionicons from "../../node_modules/react-native-vector-icons/Ionicons";
import MaterialIcons from "../../node_modules/react-native-vector-icons/MaterialIcons";

import defaultStyles from "../config/styles";
import ActiveChatImage from "./ActiveChatImage";
import AppText from "./AppText";

function GroupChatReplyBubble({
  creator,
  message,
  media,
  onClose,
  show = true,
  style,
  messageContainerStyle,
  onLayout,
  onShowInfo,
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
        />
      ) : (
        <MaterialIcons
          name="more-vert"
          size={scale(15)}
          color={defaultStyles.colors.dark_Variant}
          onPress={onShowInfo}
        />
      )}
    </View>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignSelf: "center",
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "10@s",
    flexDirection: "row",
    paddingHorizontal: "5@s",
    paddingVertical: "5@s",
    //width: "90%",
  },
  messageDetailsContainer: {
    borderColor: defaultStyles.colors.yellow_Variant,
    borderLeftWidth: 2,
    borderRadius: "5@s",
    flexShrink: 1,
    justifyContent: "center",
    paddingLeft: "5@s",
    // width: "100%",
  },
  message: {
    fontSize: "11@s",
    paddingBottom: 0,
    paddingTop: 0,
    //backgroundColor: "tomato",
  },
  creator: {
    color: defaultStyles.colors.secondary,
    paddingBottom: 0,
    paddingTop: 0,
    fontSize: "13@s",
  },
  imageContainerStyle: {
    width: "40@s",
    height: "40@s",
  },
});

export default GroupChatReplyBubble;
