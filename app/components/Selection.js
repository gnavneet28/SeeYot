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
        ]}
      >
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: opted
              ? defaultStyles.colors.tomato
              : defaultStyles.colors.light,
          }}
        />
      </View>
      <AppText style={{ fontSize: 18, opacity: 0.8 }} onPress={onPress}>
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
    borderColor: defaultStyles.colors.yellow_Variant,
    borderWidth: 2,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  text: {
    fontSize: 18,
  },
});

export default memo(Selection);
