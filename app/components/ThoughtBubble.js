import React, { memo } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { moderateScale, scale } from "react-native-size-matters";
import Autolink from "react-native-autolink";

import defaultStyles from "../config/styles";

const color1 = "rgba(111, 0, 158,0.9)";
const color2 = "rgba(255, 204, 0,0.9)";

let defaultThought = {
  message: "",
  createdAt: Date.now(),
  media: "",
};

function ThoughtBubble({
  thought = defaultThought,
  onLongPress,
  activeChat,
  user,
}) {
  dayjs.extend(relativeTime);

  const handleLongPress = () => onLongPress(thought);
  let mine = thought.createdBy == user._id ? true : false;

  return (
    <TouchableOpacity
      activeOpacity={activeChat ? 1 : 0.9}
      onLongPress={handleLongPress}
      style={[styles.message, !mine ? styles.mine : styles.not_mine]}
    >
      <View
        style={[
          styles.cloud,
          {
            backgroundColor: !mine ? color1 : color2,
            paddingHorizontal: activeChat
              ? thought.media
                ? 0
                : scale(10)
              : scale(10),
            paddingVertical: activeChat
              ? thought.media
                ? 0
                : scale(6)
              : scale(6),

            borderTopLeftRadius: mine ? scale(15) : 5,
            borderTopRightRadius: mine ? 5 : scale(15),
          },
        ]}
      >
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
            handleLongPress,
          }}
          email={true}
          phone="sms"
        />

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

export default memo(ThoughtBubble);
