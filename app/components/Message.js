import React from "react";
import { StyleSheet, TouchableHighlight } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import defaultStyles from "../config/styles";
import { ScaledSheet, scale } from "react-native-size-matters";

const Confused = require("../assets/animations/confused.json");
const Furious = require("../assets/animations/angry.json");
const Happy = require("../assets/animations/happy.json");
const Sad = require("../assets/animations/sad.json");
const Love = require("../assets/animations/love.json");

function Message({ mood = "Happy", onPress, seen = false }) {
  let emoji;

  if (mood === "Happy") emoji = Happy;
  if (mood === "Sad") emoji = Sad;
  if (mood === "Furious") emoji = Furious;
  if (mood === "Confused") emoji = Confused;
  if (mood === "Love") emoji = Love;
  return (
    <TouchableHighlight
      activeOpacity={0.8}
      underlayColor={defaultStyles.colors.lightGrey}
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: seen
            ? defaultStyles.colors.lightGrey
            : defaultStyles.colors.blue,
        },
      ]}
    >
      <>
        <LinearGradient colors={["#8e9eab", "#eef2f3"]} style={styles.gradient}>
          <LottieView
            autoPlay
            loop
            source={emoji}
            style={{ width: scale(40), height: scale(40) }}
          />
        </LinearGradient>
      </>
    </TouchableHighlight>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    borderRadius: "25@s",
    height: "50@s",
    justifyContent: "center",
    marginHorizontal: "5@s",
    padding: "5@s",
    width: "50@s",
  },
  gradient: {
    alignItems: "center",
    borderRadius: "22.5@s",
    height: "45@s",
    justifyContent: "center",
    padding: "2@s",
    width: "45@s",
  },
});

export default Message;
