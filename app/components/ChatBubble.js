import React from "react";
import { StyleSheet, View } from "react-native";

import Svg, { Path } from "react-native-svg";
import { moderateScale, scale } from "react-native-size-matters";
import Autolink from "react-native-autolink";

import defaultStyles from "../config/styles";

function ChatBubble({ text = "", mine }) {
  return (
    <View style={[styles.message, !mine ? styles.mine : styles.not_mine]}>
      <View
        style={[
          styles.cloud,
          {
            backgroundColor: !mine
              ? defaultStyles.colors.secondary
              : defaultStyles.colors.blue,
          },
        ]}
      >
        <Autolink
          showAlert={true}
          text={text}
          linkProps={{
            suppressHighlighting: true,
            testID: "link",
          }}
          linkStyle={{
            ...styles.text,
            color: defaultStyles.colors.yellow,
            fontFamily: "Comic-Bold",
          }}
          textProps={{
            selectable: false,
            style: {
              ...styles.text,
              color: defaultStyles.colors.white,
              fontFamily: "Comic-Bold",
            },
          }}
          email={true}
          hashtag="instagram"
          phone="sms"
          mention="instagram"
        />
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
                  ? defaultStyles.colors.secondary
                  : defaultStyles.colors.blue
              }
              x="0"
              y="0"
            />
          </Svg>
        </View>
      </View>
    </View>
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
    fontSize: scale(14),
    lineHeight: scale(16),
    paddingTop: 3,
  },
});

export default ChatBubble;
