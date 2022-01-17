import React, { memo } from "react";
import { TouchableOpacity } from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ScaledSheet, scale } from "react-native-size-matters";

import AppText from "./AppText";
import ChatBubble from "./ChatBubble";

import defaultStyles from "../config/styles";

let defaultThought = {
  message: "",
  createdAt: Date.now(),
};

function ThoughtCard({ thought = defaultThought, mine }) {
  dayjs.extend(relativeTime);
  return (
    <TouchableOpacity activeOpacity={1} style={styles.container}>
      <ChatBubble
        mine={mine}
        text={thought.message}
        createdAt={thought.createdAt}
      />
      <AppText
        style={[
          styles.date,
          {
            fontFamily: "Comic-LightItalic",
            marginHorizontal: scale(16),
            textAlign: mine ? "right" : "left",
          },
        ]}
      >
        {dayjs(thought.createdAt).fromNow()}
      </AppText>
    </TouchableOpacity>
  );
}
const styles = ScaledSheet.create({
  container: {
    justifyContent: "center",
    width: "100%",
  },
  date: {
    color: defaultStyles.colors.light,
    fontSize: "9.5@s",
    paddingTop: 0,
  },
});

export default memo(ThoughtCard);
