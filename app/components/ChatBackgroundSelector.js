import React from "react";
import { StyleSheet, ImageBackground } from "react-native";
import LinearGradient from "react-native-linear-gradient";

import defaultStyles from "../config/styles";

function ChatBackgroundSelector({ children, activeChat }) {
  if (!activeChat)
    return (
      <ImageBackground
        resizeMode="cover"
        source={{ uri: "chat_wallpaper" }}
        style={{
          height: "100%",
          width: "100%",
          alignItems: "center",
          backgroundColor: defaultStyles.colors.white,
        }}
      >
        {children}
      </ImageBackground>
    );
  return (
    <LinearGradient
      colors={
        !activeChat
          ? [
              defaultStyles.colors.white,
              defaultStyles.colors.white,
              defaultStyles.colors.white,
            ]
          : [
              defaultStyles.colors.lightGrey,
              defaultStyles.colors.lightGrey,
              defaultStyles.colors.primary,
            ]
      }
      style={styles.container}
      locations={[0.0, 0.2, 1.0]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    alignItems: "center",
  },
});

export default ChatBackgroundSelector;
