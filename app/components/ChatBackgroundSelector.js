import React from "react";
import { StyleSheet, ImageBackground } from "react-native";

import defaultStyles from "../config/styles";

function ChatBackgroundSelector({ children, activeChat }) {
  return (
    <ImageBackground
      resizeMode="cover"
      source={{ uri: "chatwallpaper" }}
      style={styles.imageBackgroundContainer}
    >
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    alignItems: "center",
  },
  imageBackgroundContainer: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.white,
    height: "100%",
    width: "100%",
  },
});

export default ChatBackgroundSelector;
