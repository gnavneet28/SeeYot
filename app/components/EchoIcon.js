import React from "react";
import { TouchableOpacity } from "react-native";
import { scale, ScaledSheet } from "react-native-size-matters";
import MaterialIcons from "../../node_modules/react-native-vector-icons/MaterialIcons";

import defaultStyles from "../config/styles";

function EchoIcon({
  onPress,
  forInfo = false,
  containerStyle,
  textStyle,
  size = scale(22),
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[styles.echoIconContainer, containerStyle]}
    >
      <MaterialIcons
        name="swap-horiz"
        size={size}
        color={defaultStyles.colors.white}
        style={styles.icon}
      />
    </TouchableOpacity>
  );
}
const styles = ScaledSheet.create({
  icon: {
    transform: [{ rotate: "-45deg" }],
  },
  echoIconContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.secondary,
    borderRadius: "8@s",
    elevation: 1,
    height: "32@s",
    justifyContent: "center",
    overflow: "hidden",
    width: "32@s",
  },
});

export default EchoIcon;
