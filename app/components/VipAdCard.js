import React, { memo } from "react";
import { Image, StyleSheet, TouchableHighlight } from "react-native";

import defaultStyles from "../config/styles";

let width = defaultStyles.width;
let height = width * 0.4365;

function VipAdCard({ style, onPress }) {
  return (
    <TouchableHighlight
      onPress={onPress}
      style={[styles.container, style]}
      underlayColor={defaultStyles.colors.white}
    >
      <Image
        source={require("../assets/vipBanner.png")}
        style={{
          height: "100%",
          width: "100%",
        }}
      />
    </TouchableHighlight>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    height: height,
    width: width,
  },
});

export default memo(VipAdCard);
