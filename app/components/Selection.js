import React, { memo } from "react";
import { View, StyleSheet } from "react-native";

import AppText from "./AppText";

import defaultStyles from "../config/styles";

const height = defaultStyles.height;

function Selection({ style, onPress, opted, value = "" }) {
  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          [
            styles.checkBox,
            {
              width: opted ? 20 : 24,
              height: opted ? 20 : 24,
              borderRadius: opted ? 10 : 12,
            },
          ],
          {
            backgroundColor: opted
              ? defaultStyles.colors.yellow_Variant
              : defaultStyles.colors.light,
          },
        ]}
      />
      <AppText
        style={{ fontSize: 18, fontFamily: "Comic-Bold" }}
        onPress={onPress}
      >
        {value}
      </AppText>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    flexDirection: "row",
    height: height > 640 ? height * 0.0577 : height * 0.07,
    padding: 5,
    width: "95%",
  },
  checkBox: {
    borderColor: defaultStyles.colors.danger,
    borderWidth: 2,
    marginHorizontal: 5,
  },
  text: {
    fontSize: 18,
  },
});

export default memo(Selection);
