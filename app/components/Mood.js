import React from "react";
import { StyleSheet, TouchableHighlight } from "react-native";
import LottieView from "lottie-react-native";

import AppText from "./AppText";

import defaultStyles from "../config/styles";

const Confused = require("../assets/animations/confused.json");
const Furious = require("../assets/animations/angry.json");
const Happy = require("../assets/animations/happy.json");
const Sad = require("../assets/animations/sad.json");
const Love = require("../assets/animations/love.json");

function Mood({ mood, onPress, isSelected = false }) {
  let emoji;

  if (mood === "Happy") emoji = Happy;
  if (mood === "Sad") emoji = Sad;
  if (mood === "Furious") emoji = Furious;
  if (mood === "Confused") emoji = Confused;
  if (mood === "Love") emoji = Love;

  return (
    <TouchableHighlight
      onPress={onPress}
      activeOpacity={0.8}
      underlayColor={defaultStyles.colors.lightGrey}
      style={[
        styles.container,
        {
          backgroundColor: isSelected
            ? defaultStyles.colors.blue
            : defaultStyles.colors.light,
        },
      ]}
    >
      <>
        <LottieView
          autoPlay
          loop
          source={emoji}
          style={{ width: 30, height: 30, marginRight: 2 }}
        />
        <AppText
          style={[
            styles.moodLabel,
            {
              color: isSelected
                ? defaultStyles.colors.white
                : defaultStyles.colors.dark,
            },
          ]}
        >
          {mood}
        </AppText>
      </>
    </TouchableHighlight>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.light,
    borderRadius: 20,
    flex: 1,
    flexDirection: "row",
    height: 40,
    marginHorizontal: 5,
    minWidth: 80,
    padding: 5,
  },
  moodLabel: {
    fontSize: 12,
    marginRight: 10,
  },
});

export default Mood;
