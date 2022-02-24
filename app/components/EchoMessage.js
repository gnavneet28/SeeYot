import React from "react";
import { View } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import { SharedElement } from "react-navigation-shared-element";

import EchoIcon from "./EchoIcon";
import AppText from "./AppText";

function EchoMessage({ echoMessage, style, id }) {
  return (
    <View style={[styles.container, style]}>
      <SharedElement id={id}>
        <EchoIcon forInfo={true} containerStyle={styles.echoIcon} />
      </SharedElement>
      <AppText style={styles.echoMessage}>{echoMessage}</AppText>
    </View>
  );
}
const styles = ScaledSheet.create({
  container: {
    flexDirection: "row",
    paddingTop: "5@s",
    width: "95%",
  },
  echoIcon: {
    borderRadius: "8@s",
    height: "28@s",
    width: "28@s",
  },
  echoMessage: {
    alignSelf: "center",
    flexShrink: 1,
    overflow: "hidden",
    paddingTop: 0,
    textAlign: "center",
    textAlignVertical: "center",
    width: "95%",
  },
});

export default EchoMessage;
