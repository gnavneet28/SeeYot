import React from "react";
import { Animated } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";
import MaterialCommunityIcons from "../../node_modules/react-native-vector-icons/MaterialCommunityIcons";

import defaultStyles from "../config/styles";

function ActiveChatReplyAction({ trans }) {
  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: trans }],
        },
      ]}
    >
      <MaterialCommunityIcons
        size={scale(20)}
        color={defaultStyles.colors.dark_Variant}
        name="reply-circle"
      />
    </Animated.View>
  );
}
const styles = ScaledSheet.create({
  container: {
    width: "40@s",
    flex: 1,
    paddingHorizontal: "20@s",
    justifyContent: "center",
  },
});

export default ActiveChatReplyAction;
