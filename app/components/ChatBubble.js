import React, { memo } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import Svg, { Path } from "react-native-svg";
import { moderateScale, scale } from "react-native-size-matters";
import Autolink from "react-native-autolink";

import defaultStyles from "../config/styles";

let defaultThought = {
  message: "",
  createdAt: Date.now(),
};

function ChatBubble({
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
              ? defaultStyles.colors.chatBubble
              : defaultStyles.colors.white,
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
            selectable: false,
            style: styles.text,
            onLongPress,
          }}
          email={true}
          phone="sms"
        />
        <Text style={styles.createdAt}>
          {dayjs(thought.createdAt).fromNow()}
        </Text>
        <View
          style={[
            styles.arrow_container,
            !mine ? styles.arrow_left_container : styles.arrow_right_container,
          ]}
        >
          <Svg
            enable-background="new 32.485 17.5 15.515 17.5"
            height={moderateScale(17.5, 0.6)}
            style={!mine ? styles.arrow_left : styles.arrow_right}
            viewBox="32.484 17.5 15.515 17.5"
            width={moderateScale(15.5, 0.6)}
          >
            <Path
              d={
                !mine
                  ? "M38.484,17.5c0,8.75,1,13.5-6,17.5C51.484,35,52.484,17.5,38.484,17.5z"
                  : "M48,35c-7-4-6-8.75-6-17.5C28,17.5,29,35,48,35z"
              }
              fill={
                !mine
                  ? defaultStyles.colors.chatBubble
                  : defaultStyles.colors.white
              }
              x="0"
              y="0"
            />
          </Svg>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  arrow_container: {
    bottom: 0,
    flex: 1,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: -1,
  },
  arrow_left_container: {
    alignItems: "flex-start",
    justifyContent: "flex-end",
  },
  arrow_right_container: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  arrow_left: {
    left: moderateScale(-6, 0.5),
  },
  arrow_right: {
    right: moderateScale(-6, 0.5),
  },
  cloud: {
    borderRadius: 20,
    maxWidth: moderateScale(250, 2),
    paddingBottom: moderateScale(7, 2),
    paddingHorizontal: moderateScale(10, 2),
    paddingTop: moderateScale(5, 2),
  },
  createdAt: {
    color: defaultStyles.colors.dark_Variant,
    fontSize: scale(8),
    paddingTop: scale(2),
    textAlign: "right",
  },
  message: {
    flexDirection: "row",
    marginVertical: moderateScale(7, 2),
  },
  mine: {
    marginLeft: 20,
  },
  not_mine: {
    alignSelf: "flex-end",
    marginRight: 20,
  },

  text: {
    ...defaultStyles.text,
    color: defaultStyles.colors.dark,
    fontSize: scale(13),
    fontFamily: "Comic-Bold",
    lineHeight: scale(16),
  },
});

export default memo(ChatBubble);
