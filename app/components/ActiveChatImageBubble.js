import React, { memo } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { moderateScale, scale } from "react-native-size-matters";
import Autolink from "react-native-autolink";

import ActiveChatImage from "./ActiveChatImage";

import defaultStyles from "../config/styles";

let defaultThought = {
  message: "",
  createdAt: Date.now(),
  media: "",
};

function ActiveChatImageBubble({
  thought = defaultThought,
  mine,
  onLongPress,
  activeChat,
}) {
  dayjs.extend(relativeTime);
  return (
    <TouchableOpacity
      activeOpacity={activeChat ? 1 : 0.9}
      onLongPress={onLongPress}
      style={[styles.message, !mine ? styles.mine : styles.not_mine]}
    >
      <View
        style={[
          styles.cloud,
          {
            backgroundColor: !mine
              ? defaultStyles.colors.secondary
              : defaultStyles.colors.yellow_Variant,
            paddingHorizontal: activeChat
              ? thought.media
                ? scale(2)
                : scale(10)
              : scale(10),
            paddingVertical: activeChat
              ? thought.media
                ? scale(2)
                : scale(6)
              : scale(6),
          },
        ]}
      >
        <ActiveChatImage uri={thought.media} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cloud: {
    borderRadius: scale(15),
    maxWidth: moderateScale(250, 2),
    paddingHorizontal: scale(10),
    paddingVertical: scale(6),
    overflow: "hidden",
  },
  createdAt: {
    fontSize: scale(8),
    fontFamily: "ComicNeue-Bold",
    paddingTop: 0,
    textAlign: "right",
  },
  message: {
    flexDirection: "row",
    marginVertical: scale(4),
    overflow: "hidden",
  },
  mine: {
    marginLeft: scale(15),
  },
  not_mine: {
    alignSelf: "flex-end",
    marginRight: scale(15),
  },
  text: {
    ...defaultStyles.text,
    color: defaultStyles.colors.dark,
    fontFamily: "ComicNeue-Bold",
    fontSize: scale(13.5),
    lineHeight: scale(16),
    paddingBottom: 0,
  },
});

export default memo(ActiveChatImageBubble);
