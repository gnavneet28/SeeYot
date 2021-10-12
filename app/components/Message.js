import React from "react";
import { View, StyleSheet, TouchableHighlight } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import defaultStyles from "../config/styles";

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
            style={{ width: 40, height: 40 }}
          />
        </LinearGradient>
      </>
    </TouchableHighlight>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderRadius: 30,
    height: 60,
    justifyContent: "center",
    marginHorizontal: 5,
    padding: 5,
    width: 60,
  },
  gradient: {
    alignItems: "center",
    borderRadius: 27.5,
    height: 55,
    justifyContent: "center",
    padding: 2,
    width: 55,
  },
});

export default Message;
