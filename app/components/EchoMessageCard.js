import React, { memo } from "react";
import { View, StyleSheet } from "react-native";

import AppImage from "./AppImage";
import AppText from "./AppText";

import defaultStyles from "../config/styles";

const defaultEchoMessage = {
  _id: "",
  messageFor: "",
  message: "",
  name: "",
  picture: "",
};

function EchoMessageCard({
  echoMessage = defaultEchoMessage,
  style,
  onEchoMessagePress,
}) {
  return (
    <>
      <View style={[styles.container, style]}>
        <AppImage
          imageUrl={echoMessage.picture}
          onPress={onEchoMessagePress}
          style={styles.image}
          subStyle={styles.subImage}
        />
        <AppText numberOfLines={1} style={styles.name}>
          {echoMessage.name}
        </AppText>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    height: 100,
    justifyContent: "center",
    width: 80,
  },
  image: {
    alignItems: "center",
    borderColor: defaultStyles.colors.light,
    borderRadius: 25,
    borderWidth: 2,
    height: 50,
    justifyContent: "center",
    width: 50,
  },
  name: {
    color: defaultStyles.colors.secondary,
    fontSize: 15,
  },
  subImage: {
    borderRadius: 24,
    height: 48,
    width: 48,
  },
});

export default memo(EchoMessageCard);
