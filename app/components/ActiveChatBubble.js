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

function ActiveChatBubble({
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
        {thought.media ? (
          <ActiveChatImage uri={thought.media} />
        ) : (
          <Autolink
            showAlert={true}
            text={thought.message}
            linkProps={{
              suppressHighlighting: true,
              testID: "link",
            }}
            linkStyle={{
              ...styles.text,
              color: defaultStyles.colors.blue,
            }}
            textProps={{
              selectable: true,
              style: [
                styles.text,
                {
                  color: !mine
                    ? defaultStyles.colors.white
                    : defaultStyles.colors.dark,
                },
              ],
              onLongPress,
            }}
            email={true}
            phone="sms"
          />
        )}
        {activeChat ? null : (
          <Text
            style={[
              styles.createdAt,
              {
                color: !mine
                  ? defaultStyles.colors.white
                  : defaultStyles.colors.dark_Variant,
              },
            ]}
          >
            {dayjs(thought.createdAt).fromNow()}
          </Text>
        )}
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
    marginVertical: scale(2),
    overflow: "hidden",
    width: "100%",
  },
  mine: {
    paddingLeft: scale(15),
    alignItems: "flex-start",
  },
  not_mine: {
    paddingRight: scale(15),
    alignItems: "flex-end",
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

export default memo(ActiveChatBubble);
