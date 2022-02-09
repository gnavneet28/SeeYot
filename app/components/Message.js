import React from "react";
import { TouchableHighlight } from "react-native";
import LottieView from "lottie-react-native";
import defaultStyles from "../config/styles";
import { ScaledSheet, scale } from "react-native-size-matters";

const Love = "love.json";
const Sad = "sad.json";
const Happy = "happy.json";
const Furious = "angry.json";
const Confused = "confused.json";

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
          borderWidth: seen ? 0 : 2,
          borderColor: seen
            ? defaultStyles.colors.light
            : defaultStyles.colors.green,
        },
      ]}
    >
      <>
        <LottieView
          autoPlay
          loop={false}
          source={emoji}
          style={{ width: scale(30), height: scale(30) }}
        />
      </>
    </TouchableHighlight>
  );
}
const styles = ScaledSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: defaultStyles.colors.light,
    borderRadius: "25@s",
    height: "50@s",
    justifyContent: "center",
    marginHorizontal: "5@s",
    padding: "5@s",
    width: "50@s",
  },
});

export default Message;
