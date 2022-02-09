import React, { memo } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { moderateScale, scale } from "react-native-size-matters";
import Autolink from "react-native-autolink";

import defaultStyles from "../config/styles";
import AppImage from "./AppImage";

let defaultThought = {
  message: "",
  createdAt: Date.now(),
};

function ActiveChatBubble({
  thought = defaultThought,
  mine,
  onLongPress,
  activeChat,
  recipient,
}) {
  dayjs.extend(relativeTime);
  return (
    <TouchableOpacity
      activeOpacity={activeChat ? 1 : 0.9}
      onLongPress={onLongPress}
      style={[styles.message, !mine ? styles.mine : styles.not_mine]}
    >
      {mine ? null : (
        <AppImage
          resizeMode="cover"
          overlayColor={defaultStyles.colors.white}
          imageUrl={recipient.picture}
          style={styles.recipientPicture}
          subStyle={styles.recipientPictureSub}
        />
      )}
      <View
        style={[
          styles.cloud,
          {
            backgroundColor: !mine
              ? defaultStyles.colors.secondary
              : defaultStyles.colors.yellow_Variant,
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
            onLongPress,
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
    borderRadius: scale(10),
    maxWidth: moderateScale(250, 2),
    paddingHorizontal: scale(10),
    paddingVertical: scale(6),
  },
  createdAt: {
    fontSize: scale(8),
    fontFamily: "ComicNeue-Bold",
    paddingTop: 0,
    textAlign: "right",
  },
  message: {
    flexDirection: "row",
    marginVertical: moderateScale(7, 2),
  },
  mine: {
    marginLeft: scale(10),
  },
  not_mine: {
    alignSelf: "flex-end",
    marginRight: scale(10),
  },
  recipientPicture: {
    alignSelf: "flex-end",
    borderColor: defaultStyles.colors.lightGrey,
    borderWidth: 1,
    height: scale(20),
    marginRight: scale(10),
    width: scale(20),
  },
  recipientPictureSub: {
    height: scale(22),
    width: scale(22),
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
