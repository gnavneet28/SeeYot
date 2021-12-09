import React, { memo } from "react";
import { View, TouchableOpacity } from "react-native";
import { ScaledSheet, scale } from "react-native-size-matters";

import AppText from "./AppText";

import defaultStyles from "../config/styles";

function Selection({
  style,
  onPress,
  opted,
  dotStyle,
  containerStyle,
  value = "",
}) {
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={onPress}
        style={[
          [
            styles.checkBox,
            {
              width: opted ? scale(18) : scale(14),
              height: opted ? scale(18) : scale(14),
              borderRadius: opted ? scale(9) : scale(7),
            },
            containerStyle,
          ],
        ]}
      >
        <View
          style={[
            {
              width: scale(8),
              height: scale(8),
              borderRadius: scale(4),
              backgroundColor: opted
                ? defaultStyles.colors.tomato
                : defaultStyles.colors.light,
            },
            dotStyle,
          ]}
        />
      </TouchableOpacity>
      <AppText style={{ fontSize: scale(15), opacity: 0.8 }} onPress={onPress}>
        {value}
      </AppText>
    </View>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    flexDirection: "row",
    height: "40@s",
    padding: "5@s",
    width: "95%",
  },
  checkBox: {
    borderColor: defaultStyles.colors.yellow_Variant,
    borderWidth: 2,
    marginHorizontal: "5@s",
    justifyContent: "center",
    alignItems: "center",
    padding: "5@s",
  },
});

export default memo(Selection);
