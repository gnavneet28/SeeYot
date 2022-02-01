import React from "react";
import { TouchableHighlight } from "react-native";
import LottieView from "lottie-react-native";
import { ScaledSheet, scale } from "react-native-size-matters";

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
          loop={false}
          source={emoji}
          style={{ width: scale(25), height: scale(25), marginRight: scale(2) }}
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
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "20@s",
    flex: 1,
    flexDirection: "row",
    height: "32@s",
    marginHorizontal: "5@s",
    minWidth: "80@s",
    padding: "5@s",
  },
  moodLabel: {
    fontSize: "12@s",
    marginRight: "10@s",
  },
});

export default Mood;
