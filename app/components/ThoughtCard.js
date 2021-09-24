import React, { memo } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import AppText from "./AppText";
import ChatBubble from "./ChatBubble";

import defaultStyles from "../config/styles";

const height = defaultStyles.height;

let defaultThought = {
  message: "",
  createdAt: Date.now(),
};

function ThoughtCard({ thought = defaultThought, mine }) {
  dayjs.extend(relativeTime);
  return (
    <TouchableOpacity activeOpacity={1} style={styles.container}>
      <ChatBubble mine={mine} text={thought.message} />
      <AppText
        style={[
          styles.date,
          {
            fontFamily: "Comic-LightItalic",
            marginHorizontal: 20,
            textAlign: mine ? "right" : "left",
          },
        ]}
      >
        {dayjs(thought.createdAt).fromNow()}
      </AppText>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    width: "100%",
  },
  date: {
    color: defaultStyles.colors.light,
    fontSize: height * 0.015,
    paddingTop: 0,
  },
});

export default memo(ThoughtCard);
